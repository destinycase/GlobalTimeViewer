import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const espree = require("espree");
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULES_DIR = path.join(ROOT_DIR, "js", "modules");
const SCRIPT_LIST_PATH = path.join(ROOT_DIR, "script_list.tmp");
const MODULE_SPEC_PATH = path.join(MODULES_DIR, "main-module-spec.js");
const MAIN_PATH = path.join(ROOT_DIR, "main.js");
const OUTPUT_PATH = path.join(ROOT_DIR, "docs", "module-dependency-inventory.md");

function parseSource(filePath) {
    return espree.parse(fs.readFileSync(filePath, "utf8"), {
        ecmaVersion: "latest",
        sourceType: "script",
        loc: true
    });
}

function visit(node, visitor, skipNestedFunctions = false, isRoot = true) {
    if (!node || typeof node !== "object") return;
    visitor(node);
    for (const [key, value] of Object.entries(node)) {
        if (key === "parent" || !value) continue;
        if (Array.isArray(value)) {
            value.forEach((child) => {
                if (child && typeof child.type === "string") {
                    if (skipNestedFunctions && !isRoot && child.type.includes("Function")) return;
                    visit(child, visitor, skipNestedFunctions, false);
                }
            });
        } else if (typeof value.type === "string") {
            if (skipNestedFunctions && !isRoot && value.type.includes("Function")) continue;
            visit(value, visitor, skipNestedFunctions, false);
        }
    }
}

function memberProperty(node) {
    if (!node || node.type !== "MemberExpression") return null;
    if (!node.computed && node.property.type === "Identifier") return node.property.name;
    if (node.computed && node.property.type === "Literal") return String(node.property.value);
    return null;
}

function getObjectProperty(objectNode, propertyName) {
    if (!objectNode || objectNode.type !== "ObjectExpression") return null;
    return objectNode.properties.find((property) => (
        property.type === "Property" && memberProperty({
            type: "MemberExpression",
            computed: property.computed,
            property: property.key
        }) === propertyName
    )) || null;
}

function getStaticValue(node) {
    if (!node) return null;
    if (node.type === "Literal") return node.value;
    if (node.type === "ObjectExpression" && node.properties.length === 0) return {};
    return null;
}

function getReturnedObject(functionNode) {
    const returnedObjects = [];
    visit(functionNode.body, (node) => {
        if (node.type !== "ReturnStatement") return;
        const argument = node.argument;
        if (
            argument?.type === "CallExpression"
            && argument.callee.type === "MemberExpression"
            && memberProperty(argument.callee) === "freeze"
            && argument.arguments[0]?.type === "ObjectExpression"
        ) {
            returnedObjects.push(argument.arguments[0]);
        }
    }, true);
    return returnedObjects.at(-1) || null;
}

function collectDependencyKeys(functionNode) {
    const dependencies = new Set();
    visit(functionNode.body, (node) => {
        if (
            node.type === "MemberExpression"
            && node.object.type === "Identifier"
            && node.object.name === "safeDeps"
        ) {
            const propertyName = memberProperty(node);
            if (propertyName) dependencies.add(propertyName);
        }
        if (
            node.type === "VariableDeclarator"
            && node.id.type === "ObjectPattern"
            && node.init?.type === "Identifier"
            && node.init.name === "safeDeps"
        ) {
            node.id.properties.forEach((property) => {
                if (property.type === "Property" && property.key.type === "Identifier") {
                    dependencies.add(property.key.name);
                }
                if (property.type === "RestElement") dependencies.add(`...${property.argument.name}`);
            });
        }
    });
    return [...dependencies].sort();
}

function extractModule(fileName) {
    const ast = parseSource(path.join(MODULES_DIR, fileName));
    const functions = new Map();
    const globals = [];

    visit(ast, (node) => {
        if (node.type === "FunctionDeclaration" && node.id?.name === "createService") {
            functions.set(node, node);
        }
        if (
            node.type === "AssignmentExpression"
            && node.left.type === "MemberExpression"
            && node.left.object.type === "Identifier"
            && node.left.object.name === "globalObj"
        ) {
            const globalName = memberProperty(node.left);
            if (globalName?.startsWith("GTV")) globals.push(globalName);
        }
    });

    const createService = [...functions.keys()].at(-1) || null;
    const returnedObject = createService ? getReturnedObject(createService) : null;
    const methods = returnedObject
        ? returnedObject.properties
            .filter((property) => property.type === "Property")
            .map((property) => memberProperty({
                type: "MemberExpression",
                computed: property.computed,
                property: property.key
            }))
            .filter(Boolean)
        : [];

    return {
        fileName,
        globalName: globals.at(-1) || "—",
        dependencies: createService ? collectDependencyKeys(createService) : [],
        methods
    };
}

function extractModuleSpecs() {
    const ast = parseSource(MODULE_SPEC_PATH);
    let specObject = null;
    visit(ast, (node) => {
        if (node.type !== "ObjectExpression" || specObject) return;
        const hasTimezoneEntry = node.properties.some((property) => (
            property.type === "Property"
            && property.key.type === "Identifier"
            && property.key.name === "GTV_TIMEZONE_DATA"
        ));
        if (hasTimezoneEntry) specObject = node;
    });

    const specs = new Map();
    specObject?.properties.forEach((property) => {
        if (property.type !== "Property" || property.key.type !== "Identifier") return;
        const localName = property.key.name;
        const value = property.value;
        const globalName = getStaticValue(getObjectProperty(value, "globalName")?.value);
        if (typeof globalName !== "string") return;
        const requiredMethod = getStaticValue(getObjectProperty(value, "requiredMethod")?.value);
        const optional = getStaticValue(getObjectProperty(value, "optional")?.value) === true;
        const hasValidator = !!getObjectProperty(value, "validate");
        specs.set(globalName, {
            localName,
            requiredMethod: typeof requiredMethod === "string" ? requiredMethod : "없음",
            optional,
            hasValidator
        });
    });
    return specs;
}

function extractGlobalBindingRegistry() {
    const ast = parseSource(path.join(MODULES_DIR, "main-global-bindings.js"));
    let bindingObject = null;
    visit(ast, (node) => {
        if (node.type !== "VariableDeclarator" || node.id.type !== "Identifier") return;
        if (node.id.name === "BINDING_MAP" && node.init?.type === "CallExpression") {
            bindingObject = node.init.arguments[0] || null;
        }
    });

    const bindings = new Map();
    bindingObject?.properties.forEach((property) => {
        if (
            property.type === "Property"
            && property.key.type === "Identifier"
            && property.value.type === "Literal"
            && typeof property.value.value === "string"
        ) {
            bindings.set(property.value.value, property.key.name);
        }
    });
    return bindings;
}

function extractMainAssemblyCalls() {
    const ast = parseSource(MAIN_PATH);
    const calls = [];
    visit(ast, (node) => {
        if (
            node.type !== "CallExpression"
            || node.callee.type !== "MemberExpression"
            || memberProperty(node.callee) !== "createService"
        ) return;

        const owner = node.callee.object;
        const ownerName = owner.type === "Identifier" ? owner.name : "표현식";
        const config = node.arguments[0];
        let dependencyKeys = [];
        let configDescription = "없음";
        if (config?.type === "ObjectExpression") {
            dependencyKeys = config.properties
                .filter((property) => property.type === "Property")
                .map((property) => memberProperty({
                    type: "MemberExpression",
                    computed: property.computed,
                    property: property.key
                }))
                .filter(Boolean);
            configDescription = "직접 객체";
        } else if (config?.type === "Identifier") {
            configDescription = `사전 조립 값: ${config.name}`;
        } else if (config) {
            configDescription = config.type;
        }
        calls.push({
            line: node.loc?.start.line || 0,
            ownerName,
            configDescription,
            dependencyKeys
        });
    });
    return calls.sort((left, right) => left.line - right.line);
}

function escapeCell(value) {
    return String(value || "—").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function main() {
    const scriptList = fs.readFileSync(SCRIPT_LIST_PATH, "utf8")
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    const loadOrder = new Map(scriptList.map((fileName, index) => [fileName, index + 1]));
    const moduleFiles = fs.readdirSync(MODULES_DIR)
        .filter((fileName) => fileName.endsWith(".js"))
        .sort();
    const modules = moduleFiles.map(extractModule);
    const specs = extractModuleSpecs();
    const globalBindings = extractGlobalBindingRegistry();
    const assemblyCalls = extractMainAssemblyCalls();
    const registryCounts = modules.reduce((counts, module) => {
        const inSpec = specs.has(module.globalName);
        const inBindings = globalBindings.has(module.globalName);
        if (inSpec && inBindings) counts.both += 1;
        else if (inSpec) counts.specOnly += 1;
        else if (inBindings) counts.bindingsOnly += 1;
        else counts.neither += 1;
        return counts;
    }, { both: 0, specOnly: 0, bindingsOnly: 0, neither: 0 });

    const lines = [
        "# 모듈 의존성 상세 인벤토리",
        "",
        "> 생성 기준: 현재 워킹 트리의 `script_list.tmp`, `js/modules/*.js`, `main.js`, `main-module-spec.js`. `npm` 패키지의 Espree AST parser로 전역 API, 서비스 입력 키, 반환 API 및 `main.js`의 직접 서비스 조립 호출을 추출했습니다.",
        "> 이 문서는 소스의 정적 형태를 기록합니다. 입력 키가 실제로 어떤 제공자에 연결되는지는 이름만으로 추론하지 않았으며, 간접 설정 객체는 `사전 조립 값`으로 표시합니다.",
        "",
        `- 모듈 파일: ${modules.length}개`,
        `- 로더 등록 스크립트: ${scriptList.length}개`,
        `- spec map 등록 전역 API: ${specs.size}개`,
        `- main-global-bindings 등록 전역 API: ${globalBindings.size}개`,
        `- 모듈 파일별 등록 경로: spec만 ${registryCounts.specOnly}개, bindings만 ${registryCounts.bindingsOnly}개, 양쪽 ${registryCounts.both}개, 둘 다 아님 ${registryCounts.neither}개`,
        `- main.js의 createService 호출: ${assemblyCalls.length}개`,
        "",
        "## 모듈별 서비스 계약",
        "",
        "`입력 의존성`은 `createService`가 `safeDeps` 또는 구조 분해로 읽는 키입니다. `반환 API`는 AST로 확인할 수 있는 반환 객체의 최상위 키입니다. `—`는 상수/데이터 모듈이거나 반환값을 이 추출 규칙으로 열거하지 못한 경우입니다.",
        "",
        "| 로드 순서 | 모듈 파일 | 전역 API | spec 요구사항 | 입력 의존성 키 | 반환 API |",
        "| ---: | --- | --- | --- | --- | --- |"
    ];

    modules.forEach((module) => {
        const spec = specs.get(module.globalName);
        const bindingKey = globalBindings.get(module.globalName);
        const specSummary = spec
            ? `${spec.optional ? "선택" : "필수"}; ${spec.requiredMethod}${spec.hasValidator ? "; validator" : ""}`
            : (bindingKey ? `global bindings: ${bindingKey}` : "두 레지스트리 미등록");
        lines.push([
            loadOrder.get(`js/modules/${module.fileName}`) || "—",
            `\`${module.fileName}\``,
            `\`${module.globalName}\``,
            specSummary,
            escapeCell(module.dependencies.join(", ")),
            escapeCell(module.methods.join(", "))
        ].join(" | ").replace(/^/, "| ").replace(/$/, " |"));
    });

    lines.push(
        "",
        "## `main.js` 조립 호출",
        "",
        "표의 줄 번호는 현재 `main.js` 기준입니다. 직접 객체를 넘기는 호출은 top-level 의존성 키를 보이고, builder/config를 미리 만든 호출은 그 값을 표시합니다. 각 키의 값은 해당 줄 주변의 객체 literal에서 확인할 수 있습니다.",
        "",
        "| 줄 | 조립자 | 설정 형태 | 직접 의존성 키 |",
        "| ---: | --- | --- | --- |"
    );
    assemblyCalls.forEach((call) => {
        lines.push(`| ${call.line} | \`${call.ownerName}\` | ${escapeCell(call.configDescription)} | ${escapeCell(call.dependencyKeys.join(", "))} |`);
    });

    lines.push(
        "",
        "## `main-module-spec.js` 해석",
        "",
        "`main-module-spec.js`에 등록된 모듈은 `main.js` 시작 시 `resolveModulesFromSpec()`에서 해석됩니다. 선택 모듈은 없어도 `null`로 매핑되며, 나머지는 필수로 취급됩니다. `requiredMethod`는 대부분 `createService`; timezone data는 별도 validator로 데이터 구조를 검사합니다. 별도 `main-global-bindings.js`는 `BINDING_MAP`을 통해 런타임 helper/bindings 전역들을 `main.js`에 전달합니다. 두 표에서 모두 찾을 수 없는 API는 여기서 곧바로 미사용으로 판정하지 않습니다. 내부 조립자나 config builder에 전달되는 하위 모듈일 수 있으므로 호출부를 따라 확인해야 합니다.",
        "",
        "## 다시 생성하기",
        "",
        "```powershell",
        "node ./scripts/generate-module-dependency-inventory.mjs",
        "```",
        "",
        "관계가 바뀌면 이 문서를 다시 생성해 검토합니다. 로더 목록 변경과 구현 간 일관성 검증은 `npm run sync:source-loader`, `npm run lint`, `npm run test:coverage`, `npm run build:strict`로 수행합니다.",
        ""
    );

    const generatedContent = lines.join("\n");
    if (process.argv.includes("--check")) {
        if (!fs.existsSync(OUTPUT_PATH) || fs.readFileSync(OUTPUT_PATH, "utf8") !== generatedContent) {
            process.stderr.write(
                `Module dependency inventory is stale. Run npm run docs:module-inventory.\n`
            );
            process.exitCode = 1;
            return;
        }
        process.stdout.write(`Verified ${path.relative(ROOT_DIR, OUTPUT_PATH)} is current.\n`);
        return;
    }

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, generatedContent, "utf8");
    process.stdout.write(`Generated ${path.relative(ROOT_DIR, OUTPUT_PATH)} (${modules.length} modules, ${assemblyCalls.length} assembly calls).\n`);
}

main();
