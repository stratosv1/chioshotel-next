$ErrorActionPreference = "Stop"

$urlsFile = "reports\site-urls.txt"
$outCsv = "reports\schema-type-inventory.csv"
$outTxt = "reports\schema-type-inventory-summary.txt"

if (!(Test-Path $urlsFile)) {
  throw "Missing $urlsFile"
}

$urls = Get-Content $urlsFile | Where-Object { $_ -and $_.Trim() -ne "" }

function Get-PageKind($url) {
  $path = ([uri]$url).AbsolutePath.TrimEnd("/")
  $path = $path -replace "^/(el|de|fr|it|es|tr)(?=/)", ""

  if ($path -eq "") { return "home" }
  if ($path -match '^/(el|de|fr|it|es|tr)$') { return "home" }

  if ($path -match '/chios-rooms/(economy-double-rooms|family-chios-apartments|standard-double-room)$') { return "room-detail" }
  if ($path -match '/chios-rooms$') { return "rooms-list" }

  if ($path -match '/find-your-room$') { return "find-your-room" }
  if ($path -match '/chios-hotels-rates$') { return "rates" }
  if ($path -match '/best-chios-travel-deals-for-chios-hotels$') { return "deals" }
  if ($path -match '/voulamandis-house-contact-us-form-fill-in-the-form$') { return "contact" }

  if ($path -match '/chios/chios-beaches/[^/]+$') { return "beach-detail" }
  if ($path -match '/chios/chios-beaches$') { return "beaches-list" }

  if ($path -match '/chios/chios-villages/[^/]+$') { return "village-detail" }
  if ($path -match '/chios/chios-villages$') { return "villages-list" }

  if ($path -match '/chios/chios-museums/[^/]+$') { return "museum-detail" }
  if ($path -match '/chios/chios-museums$') { return "museums-list" }

  if ($path -match '/chios/kampos-chios$') { return "kampos-chios" }
  if ($path -match '/chios-island$') { return "chios-island" }

  return "other-guide-or-landing"
}

function Get-Locale($url) {
  $path = ([uri]$url).AbsolutePath
  if ($path -match '^/(el|de|fr|it|es|tr)(/|$)') {
    return $Matches[1]
  }
  return "en"
}

function Extract-JsonLdBlocks($html) {
  $pattern = '<script[^>]+type=["'']application/ld\+json["''][^>]*>(.*?)</script>'
  return [regex]::Matches($html, $pattern, "Singleline,IgnoreCase") | ForEach-Object {
    [System.Net.WebUtility]::HtmlDecode($_.Groups[1].Value.Trim())
  }
}

function Collect-Types($node, [System.Collections.Generic.List[string]]$types) {
  if ($null -eq $node) { return }

  if ($node -is [System.Array]) {
    foreach ($item in $node) { Collect-Types $item $types }
    return
  }

  if ($node.PSObject.Properties.Name -contains "@type") {
    $t = $node."@type"
    if ($t -is [System.Array]) {
      foreach ($x in $t) { if ($x) { $types.Add([string]$x) } }
    } elseif ($t) {
      $types.Add([string]$t)
    }
  }

  if ($node.PSObject.Properties.Name -contains "@graph") {
    Collect-Types $node."@graph" $types
  }

  foreach ($prop in $node.PSObject.Properties) {
    if ($prop.Name -in @("@context","@id","@type","url","name","description","image")) {
      continue
    }

    $val = $prop.Value
    if ($val -is [System.Array] -or ($val -and $val.PSObject.Properties.Count -gt 0)) {
      Collect-Types $val $types
    }
  }
}

$rows = New-Object System.Collections.Generic.List[object]

$i = 0
foreach ($url in $urls) {
  $i++
  Write-Host "[$i/$($urls.Count)] $url"

  try {
    $html = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 | Select-Object -ExpandProperty Content
    $blocks = Extract-JsonLdBlocks $html

    $types = New-Object System.Collections.Generic.List[string]

    foreach ($block in $blocks) {
      $json = $block | ConvertFrom-Json
      Collect-Types $json $types
    }

    $uniqueTypes = $types | Sort-Object -Unique

    $rows.Add([pscustomobject]@{
      Url = $url
      Locale = Get-Locale $url
      PageKind = Get-PageKind $url
      JsonLdBlocks = $blocks.Count
      Types = ($uniqueTypes -join " | ")
      TypeCount = $uniqueTypes.Count
    })
  }
  catch {
    $rows.Add([pscustomobject]@{
      Url = $url
      Locale = Get-Locale $url
      PageKind = Get-PageKind $url
      JsonLdBlocks = 0
      Types = "ERROR: $($_.Exception.Message)"
      TypeCount = 0
    })
  }
}

$rows | Export-Csv -NoTypeInformation -Encoding UTF8 $outCsv

$summary = $rows |
  Group-Object PageKind |
  Sort-Object Name |
  ForEach-Object {
    ""
    "## $($_.Name) — $($_.Count) URLs"
    $_.Group |
      Group-Object Types |
      Sort-Object Count -Descending |
      ForEach-Object {
        "- $($_.Count)x $($_.Name)"
      }
  }

$summary | Set-Content -Encoding UTF8 $outTxt

Write-Host ""
Write-Host "Created:"
Write-Host $outCsv
Write-Host $outTxt

