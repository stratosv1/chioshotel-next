$ErrorActionPreference = "Stop"

$urls = Get-ChildItem -Path app,components,content,lib,schema -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.json,*.cjs,*.mjs |
  Select-String -Pattern 'https://chioshotel\.gr/wp-content/uploads/[^"'' )]+?\.(webp|jpg|jpeg|png|gif|svg)' -AllMatches |
  ForEach-Object { $_.Matches.Value } |
  Sort-Object -Unique

foreach ($url in $urls) {
  $uri = [Uri]$url
  $fileName = [System.IO.Path]::GetFileName($uri.AbsolutePath)

  $folder = "misc"
  if ($url -match "room|DSC|IMG_") { $folder = "rooms" }
  if ($url -match "beach|paralia|mavra|agia|komi|lithi|nagos|salagona|avlonia|lefkathia") { $folder = "beaches" }
  if ($url -match "mesta|pyrgi|vessa|olympoi|volissos|armolia|lagada|village") { $folder = "villages" }
  if ($url -match "mousio|museum|mastic|archaeological|byzantine|korai|maritime|folklore") { $folder = "museums" }
  if ($url -match "mostra|rocket|rouket|orchid|hiking|thermal|bath|activity") { $folder = "activities" }

  $outDir = Join-Path "public\images" $folder
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null

  $outPath = Join-Path $outDir $fileName

  if (Test-Path $outPath) {
    Write-Host "SKIP $outPath"
  } else {
    Write-Host "GET  $url"
    Invoke-WebRequest -Uri $url -OutFile $outPath
  }
}

Write-Host ""
Write-Host "Done. Downloaded images to public\images\..."
