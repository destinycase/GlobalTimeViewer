$destDir = "dist_extension"
$zipFile = "GlobalTimeViewer_extension.zip"

# Reset destination directory if it exists
if (Test-Path $destDir) {
    Remove-Item -Recurse -Force $destDir
}
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

Write-Host "Creating temporary Vite entry file..." -ForegroundColor Cyan
$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

Write-Host "Creating concatenated bundle..." -ForegroundColor Cyan
$jsFiles = @(
    "i18n.js",
    "js/modules/app-config.js",
    "js/modules/date-picker.js",
    "js/modules/time-core.js",
    "js/modules/calculator.js",
    "js/modules/multi-state.js",
    "js/modules/image-export.js",
    "js/modules/group-state.js",
    "js/modules/group-tabs.js",
    "js/modules/timezone-search.js",
    "js/modules/snapshot-format.js",
    "js/modules/table-render.js",
    "js/modules/multi-range-render.js",
    "js/modules/multi-range-copy.js",
    "js/modules/copy-actions.js",
    "js/modules/time-adjust-ui.js",
    "js/modules/format-controls.js",
    "js/modules/tab-ui.js",
    "js/modules/state-persistence.js",
    "js/modules/settings-io.js",
    "js/modules/data-transfer.js",
    "main.js"
)

$bundleContent = ""
foreach ($file in $jsFiles) {
    if (Test-Path $file) {
        $bundleContent += "`n// --- File: $file ---`n"
        $bundleContent += Get-Content $file -Raw -Encoding UTF8
    }
    else {
        Write-Warning "File not found: $file"
    }
}
if (!(Test-Path "$PSScriptRoot\js")) { New-Item -ItemType Directory -Path "$PSScriptRoot\js" | Out-Null }
$bundlePath = "$PSScriptRoot\js\bundle.js"
[System.IO.File]::WriteAllText($bundlePath, $bundleContent, $utf8NoBOM)

$tempHtmlName = "vite-index.html"
$tempHtmlPath = "$PSScriptRoot\$tempHtmlName"

Write-Host "Creating temporary Vite entry file at $tempHtmlPath..." -ForegroundColor Cyan
$content = (Get-Content "$PSScriptRoot\index.html" -Raw -Encoding UTF8)
# Remove all individual script tags
$content = $content -replace '<script\s+src="[^"]+".*?></script>\s*', ""
# Inject single bundle script in body
$content = $content -replace '</body>', "    <script src=""js/bundle.js""></script>`n</body>"
# Remove cache-busting from CSS for Vite
$content = $content -replace 'href="style\.css\?v=\d+"', 'href="style.css"'

[System.IO.File]::WriteAllText($tempHtmlPath, $content, $utf8NoBOM)

Write-Host "Running Vite Build via npm..." -ForegroundColor Cyan
cmd.exe /c "npm run build"
$buildExitCode = $LASTEXITCODE

# Clean up temp file
if (Test-Path $tempHtmlPath) { Remove-Item -Force $tempHtmlPath }

if ($buildExitCode -ne 0) {
    Write-Host "Build failed! Aborting." -ForegroundColor Red
    exit 1
}

# The vite output directory
$viteOutDir = "dist"

# Rename vite-index.html to index.html in the dist folder
if (Test-Path "$viteOutDir\$tempHtmlName") {
    $finalHtmlContent = Get-Content "$viteOutDir\$tempHtmlName" -Raw -Encoding UTF8
    $finalHtmlContent = $finalHtmlContent -replace ' crossorigin', ''
    [System.IO.File]::WriteAllText("$PSScriptRoot\$viteOutDir\index.html", $finalHtmlContent, $utf8NoBOM)
    Remove-Item -Path "$viteOutDir\$tempHtmlName"
  
    Write-Host "Manually deploying concatenated bundle to dist/js..." -ForegroundColor Cyan
    if (!(Test-Path "$viteOutDir\js")) { New-Item -ItemType Directory -Force -Path "$viteOutDir\js" | Out-Null }
    Copy-Item -Path "$PSScriptRoot\js\bundle.js" -Destination "$viteOutDir\js\bundle.js" -Force
}

Write-Host "Gathering files for deployment..." -ForegroundColor Cyan

# Copy vite build output (minified/bundled html, js, css)
if (Test-Path $viteOutDir) {
    Copy-Item -Path "$viteOutDir\*" -Destination $destDir -Recurse -Force
    Write-Host "  Copied Vite build output" -ForegroundColor Green
}
else {
    Write-Host "  Error: Vite output folder not found." -ForegroundColor Red
    exit 1
}

# Copy manifest and icons
$includeItems = @(
    "manifest.json",
    "icons",
    "background.js"
)

foreach ($item in $includeItems) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $destDir -Recurse -Force
        Write-Host "  Copied: $item" -ForegroundColor Green
    }
    else {
        Write-Host "  Warning: $item could not be found, skipping." -ForegroundColor Yellow
    }
}

Write-Host "Creating zip archive..." -ForegroundColor Cyan

# Remove previous zip file if it exists
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}

# Compress distribution directory into a zip file
Compress-Archive -Path "$destDir\*" -DestinationPath $zipFile -Force

Write-Host "Done! Deployment archive created: $zipFile" -ForegroundColor Green
Write-Host "You can now upload $zipFile to the Chrome Developer Dashboard." -ForegroundColor DarkGray
