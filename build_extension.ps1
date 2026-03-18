param(
    [switch]$EnforceVersionConsistency
)

$ErrorActionPreference = "Stop"
$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

function Sync-VersionMetadata {
    param(
        [string]$RootDir,
        [switch]$EnforceVersionConsistency
    )

    $packagePath = Join-Path $RootDir "package.json"
    $manifestPath = Join-Path $RootDir "manifest.json"
    $appConfigPath = Join-Path $RootDir "js\modules\app-config.js"

    if (!(Test-Path $packagePath) -or !(Test-Path $manifestPath) -or !(Test-Path $appConfigPath)) {
        throw "Version sync failed: required files are missing."
    }

    $pkg = Get-Content $packagePath -Raw -Encoding UTF8 | ConvertFrom-Json
    $version = [string]$pkg.version
    if ([string]::IsNullOrWhiteSpace($version)) {
        throw "Version sync failed: package.json version is empty."
    }

    $manifestContent = Get-Content $manifestPath -Raw -Encoding UTF8
    $appConfigContent = Get-Content $appConfigPath -Raw -Encoding UTF8

    $manifestVersionMatch = [regex]::Match($manifestContent, '"version"\s*:\s*"([^"]+)"')
    $manifestVersionNameMatch = [regex]::Match($manifestContent, '"version_name"\s*:\s*"([^"]+)"')
    $appConfigVersionMatch = [regex]::Match($appConfigContent, 'VERSION:\s*"([^"]+)"')
    if (!$manifestVersionMatch.Success -or !$manifestVersionNameMatch.Success -or !$appConfigVersionMatch.Success) {
        throw "Version sync failed: could not parse one or more version fields."
    }

    $manifestVersion = [string]$manifestVersionMatch.Groups[1].Value
    $manifestVersionName = [string]$manifestVersionNameMatch.Groups[1].Value
    $appConfigVersion = [string]$appConfigVersionMatch.Groups[1].Value
    $mismatches = @()
    if ($manifestVersion -ne $version) { $mismatches += "manifest.json version=$manifestVersion" }
    if ($manifestVersionName -ne $version) { $mismatches += "manifest.json version_name=$manifestVersionName" }
    if ($appConfigVersion -ne $version) { $mismatches += "js/modules/app-config.js VERSION=$appConfigVersion" }
    if ($EnforceVersionConsistency -and $mismatches.Count -gt 0) {
        $joined = [string]::Join("; ", $mismatches)
        throw "Version consistency check failed. package.json version=$version; mismatches: $joined"
    }

    $nextManifest = [regex]::Replace($manifestContent, '"version"\s*:\s*"[^"]+"', "`"version`": `"$version`"")
    $nextManifest = [regex]::Replace($nextManifest, '"version_name"\s*:\s*"[^"]+"', "`"version_name`": `"$version`"")
    if ($nextManifest -ne $manifestContent) {
        [System.IO.File]::WriteAllText($manifestPath, $nextManifest, $utf8NoBOM)
        Write-Host "Synced manifest version to $version" -ForegroundColor DarkGray
    }

    $nextAppConfig = [regex]::Replace($appConfigContent, 'VERSION:\s*"[^"]+"', "VERSION: `"$version`"")
    if ($nextAppConfig -ne $appConfigContent) {
        [System.IO.File]::WriteAllText($appConfigPath, $nextAppConfig, $utf8NoBOM)
        Write-Host "Synced app-config version to $version" -ForegroundColor DarkGray
    }
}

Push-Location $PSScriptRoot
try {
    if ($EnforceVersionConsistency) {
        Write-Host "Strict version consistency mode enabled." -ForegroundColor DarkGray
    }
    Sync-VersionMetadata -RootDir $PSScriptRoot -EnforceVersionConsistency:$EnforceVersionConsistency

    $destDir = "dist_extension"
    $zipFile = "GlobalTimeViewer_extension.zip"

    # Reset destination directory if it exists
    if (Test-Path $destDir) {
        Remove-Item -Recurse -Force $destDir
    }
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null

    Write-Host "Creating temporary Vite entry file..." -ForegroundColor Cyan
    $indexPath = "$PSScriptRoot\index.html"
    $originalIndexContent = Get-Content $indexPath -Raw -Encoding UTF8

    Write-Host "Creating concatenated bundle..." -ForegroundColor Cyan
    $scriptMatches = [regex]::Matches($originalIndexContent, '<script\s+src="([^"]+)"[^>]*></script>')
    $jsFiles = @()
    foreach ($match in $scriptMatches) {
        $src = $match.Groups[1].Value
        if ([string]::IsNullOrWhiteSpace($src)) { continue }
        if ($src -match '^(https?:)?//') { continue }
        $normalized = $src.Split('?')[0].Trim()
        if ([string]::IsNullOrWhiteSpace($normalized)) { continue }
        if ($normalized -ieq "js/bundle.js") { continue }
        if ($jsFiles -notcontains $normalized) {
            $jsFiles += $normalized
        }
    }

    if ($jsFiles.Count -eq 0) {
        Write-Host "No script files were discovered from index.html. Aborting." -ForegroundColor Red
        exit 1
    }

    $bundleContent = ""
    $missingFiles = @()
    foreach ($file in $jsFiles) {
        if (Test-Path $file) {
            $bundleContent += "`n// --- File: $file ---`n"
            $bundleContent += Get-Content $file -Raw -Encoding UTF8
        }
        else {
            Write-Warning "File not found: $file"
            $missingFiles += $file
        }
    }
    if ($missingFiles.Count -gt 0) {
        Write-Host "Bundle source contains missing files. Aborting." -ForegroundColor Red
        exit 1
    }
    if (!(Test-Path "$PSScriptRoot\js")) { New-Item -ItemType Directory -Path "$PSScriptRoot\js" | Out-Null }
    $bundlePath = "$PSScriptRoot\js\bundle.js"
    [System.IO.File]::WriteAllText($bundlePath, $bundleContent, $utf8NoBOM)

    $tempHtmlName = "vite-index.html"
    $tempHtmlPath = "$PSScriptRoot\$tempHtmlName"

    Write-Host "Creating temporary Vite entry file at $tempHtmlPath..." -ForegroundColor Cyan
    $content = $originalIndexContent
    # Remove all individual script tags
    $content = $content -replace '<script\s+src="[^"]+".*?></script>\s*', ""
    # Inject single bundle script in body
    $content = $content -replace '</body>', "    <script src=""js/bundle.js""></script>`n</body>"
    # Remove cache-busting from CSS for Vite
    $content = $content -replace 'href="style\.css\?v=\d+"', 'href="style.css"'

    [System.IO.File]::WriteAllText($tempHtmlPath, $content, $utf8NoBOM)

    $buildExitCode = 1
    $indexSwapped = $false
    try {
        Write-Host "Swapping index.html with temporary Vite entry..." -ForegroundColor Cyan
        if (Test-Path "$PSScriptRoot\index.html.bak") { Remove-Item -Force "$PSScriptRoot\index.html.bak" }
        Rename-Item -Path "$PSScriptRoot\index.html" -NewName "index.html.bak"
        Move-Item -Path $tempHtmlPath -Destination "$PSScriptRoot\index.html"
        $indexSwapped = $true

        Write-Host "Running Vite Build via npm..." -ForegroundColor Cyan
        cmd.exe /c "npm run build:vite"
        $buildExitCode = $LASTEXITCODE
    }
    finally {
        if ($indexSwapped) {
            Write-Host "Restoring original index.html..." -ForegroundColor Cyan
            if (Test-Path "$PSScriptRoot\index.html.bak") {
                if (Test-Path "$PSScriptRoot\index.html") { Remove-Item -Force "$PSScriptRoot\index.html" }
                Rename-Item -Path "$PSScriptRoot\index.html.bak" -NewName "index.html"
            }
            else {
                Write-Warning "index.html.bak not found during restore step. index.html may have been modified."
            }
        }
    }
    if ($buildExitCode -ne 0) {
        Write-Host "Build failed! Aborting." -ForegroundColor Red
        exit 1
    }

    # The vite output directory
    $viteOutDir = "dist"

    # No longer need to rename since we used index.html as input
    if (Test-Path "$viteOutDir\index.html") {
        $finalHtmlContent = Get-Content "$viteOutDir\index.html" -Raw -Encoding UTF8
        $finalHtmlContent = $finalHtmlContent -replace ' crossorigin', ''
        [System.IO.File]::WriteAllText("$PSScriptRoot\$viteOutDir\index.html", $finalHtmlContent, $utf8NoBOM)

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

    Write-Host "Validating artifacts..." -ForegroundColor Cyan
    $distIndex = Join-Path $destDir "index.html"
    if (Test-Path $distIndex) {
        $html = Get-Content $distIndex -Raw -Encoding UTF8
        $scripts = [regex]::Matches($html, '<script\s+src="([^"]+)"')
        foreach ($m in $scripts) {
            $src = $m.Groups[1].Value
            $fullPath = Join-Path $destDir $src
            if (!(Test-Path $fullPath)) {
                Write-Host "  Error: Script target file not found: $src" -ForegroundColor Red
                exit 1
            }
            Write-Host "  Verified: $src exists" -ForegroundColor Gray
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
}
finally {
    Pop-Location
}
