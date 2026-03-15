(function initGtvImageClone(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
            if (typeof document === "object" && document) return document;
            return null;
        }

        function toArray(iterable) {
            if (!iterable) return [];
            if (Array.isArray(iterable)) return iterable;
            try {
                return Array.from(iterable);
            } catch (_err) {
                return [];
            }
        }

        function replaceTimeInputsWithText(sourceEl, clonedEl, docRef) {
            const srcInputs = toArray(sourceEl?.querySelectorAll?.(".time-input"));
            const clonedInputs = toArray(clonedEl?.querySelectorAll?.(".time-input"));
            clonedInputs.forEach((inputEl, idx) => {
                if (!docRef?.createElement || typeof inputEl?.replaceWith !== "function") return;
                const span = docRef.createElement("span");
                span.className = "export-time-text";
                span.textContent = srcInputs[idx]?.value || "";
                inputEl.replaceWith(span);
            });
        }

        function removeBySelector(root, selector) {
            toArray(root?.querySelectorAll?.(selector)).forEach((node) => node?.remove?.());
        }

        function cloneTableForImageExport(tableEl) {
            if (!tableEl || typeof tableEl.cloneNode !== "function") return null;
            const docRef = getDocumentRef();
            const clone = tableEl.cloneNode(true);
            replaceTimeInputsWithText(tableEl, clone, docRef);
            removeBySelector(clone, ".export-exclude, .move-col, .move-cell");
            return clone;
        }

        function cloneMultiRangeBlockForImageExport(blockEl) {
            if (!blockEl || typeof blockEl.cloneNode !== "function") return null;
            const docRef = getDocumentRef();
            const clone = blockEl.cloneNode(true);
            replaceTimeInputsWithText(blockEl, clone, docRef);
            clone.classList?.remove?.("collapsed");
            removeBySelector(
                clone,
                ".multi-range-header-actions, .multi-range-adjust-row, .export-exclude, .move-col, .move-cell"
            );
            return clone;
        }

        return Object.freeze({
            cloneTableForImageExport,
            cloneMultiRangeBlockForImageExport
        });
    }

    globalObj.GTVImageClone = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

