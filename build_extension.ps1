param(
    [switch]$EnforceVersionConsistency
)

$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot
try {
    $args = @("scripts/build-extension.mjs")
    if ($EnforceVersionConsistency) {
        $args += "--enforce-version-consistency"
    }

    & node @args
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
