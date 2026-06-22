$ErrorActionPreference = "Stop"

$InventoryPath = "reports\schema-type-quality-inventory.csv"
$OutCsv = "reports\internal-linking-audit.csv"
$OutSummary = "reports\internal-linking-summary.txt"

if (-not (Test-Path $InventoryPath)) {
  throw "Missing $InventoryPath. Run the schema quality inventory first."
}

function Get-Locale {
  param([string]$Url)

  if ($Url -match "https://chioshotel\.gr/(el)(/|$)") { return "el" }
  if ($Url -match "https://chioshotel\.gr/(de)(/|$)") { return "de" }
  if ($Url -match "https://chioshotel\.gr/(fr)(/|$)") { return "fr" }
  if ($Url -match "https://chioshotel\.gr/(it)(/|$)") { return "it" }
  if ($Url -match "https://chioshotel\.gr/(es)(/|$)") { return "es" }
  if ($Url -match "https://chioshotel\.gr/(tr)(/|$)") { return "tr" }

  return "en"
}

function Normalize-Url {
  param([string]$Href)

  if ([string]::IsNullOrWhiteSpace($Href)) { return "" }

  $h = [System.Net.WebUtility]::HtmlDecode($Href.Trim())

  if ($h.StartsWith("#")) { return "" }
  if ($h.StartsWith("mailto:")) { return "" }
  if ($h.StartsWith("tel:")) { return "" }
  if ($h.StartsWith("javascript:")) { return "" }

  if ($h.StartsWith("/")) {
    $h = "https://chioshotel.gr$h"
  }

  if ($h -notmatch "^https://chioshotel\.gr") { return "" }

  $h = ($h -split "#")[0]
  $h = ($h -split "\?")[0]

  if (-not $h.EndsWith("/")) { $h = "$h/" }

  return $h
}

function Get-LinksFromHtml {
  param([string]$Html)

  $matches = [regex]::Matches($Html, '<a\s+[^>]*href=["'']([^"'']+)["'']', "IgnoreCase")

  $links = foreach ($m in $matches) {
    $u = Normalize-Url $m.Groups[1].Value
    if ($u) { $u }
  }

  return $links | Select-Object -Unique
}

$inventory = Import-Csv $InventoryPath |
  Where-Object { $_.Url -match "^https://chioshotel\.gr/" }

$commercialKinds = @(
  "rooms-list",
  "room-detail",
  "find-your-room",
  "rates-or-booking",
  "contact",
  "deals"
)

$guideKinds = @(
  "beach-detail",
  "beaches-list",
  "village-detail",
  "villages-list",
  "museum-detail",
  "museums-list",
  "tourist-guide-or-trip",
  "other-guide-or-landing",
  "chios-island-or-destination",
  "gallery-guide"
)

$commercialTargets = $inventory |
  Where-Object { $commercialKinds -contains $_.QualityKind } |
  ForEach-Object {
    [pscustomobject]@{
      Url = $_.Url
      Locale = Get-Locale $_.Url
      QualityKind = $_.QualityKind
    }
  }

$sourcePages = $inventory |
  Where-Object { $guideKinds -contains $_.QualityKind } |
  ForEach-Object {
    [pscustomobject]@{
      Url = $_.Url
      Locale = Get-Locale $_.Url
      QualityKind = $_.QualityKind
    }
  }

$results = New-Object System.Collections.Generic.List[object]

$total = $sourcePages.Count
$i = 0

foreach ($page in $sourcePages) {
  $i++
  Write-Host "[$i/$total] $($page.Url)"

  $status = ""
  $errorMessage = ""
  $links = @()

  try {
    $response = Invoke-WebRequest $page.Url -UseBasicParsing -TimeoutSec 30
    $status = [int]$response.StatusCode
    $links = Get-LinksFromHtml $response.Content
  } catch {
    $status = "ERROR"
    $errorMessage = $_.Exception.Message
  }

  $sameLocaleTargets = $commercialTargets | Where-Object { $_.Locale -eq $page.Locale }

  $linkedTargets = foreach ($target in $sameLocaleTargets) {
    if ($links -contains $target.Url) { $target }
  }

  $linkedKinds = $linkedTargets | Select-Object -ExpandProperty QualityKind -Unique

  $hasRoomsList = $linkedKinds -contains "rooms-list"
  $hasFindRoom = $linkedKinds -contains "find-your-room"
  $hasRates = $linkedKinds -contains "rates-or-booking"
  $hasContact = $linkedKinds -contains "contact"

  if (($linkedTargets | Measure-Object).Count -eq 0) {
    $recommendation = "Needs commercial internal link"
  } elseif (-not $hasRoomsList -and -not $hasFindRoom) {
    $recommendation = "Add link to rooms or find-your-room"
  } else {
    $recommendation = "OK"
  }

  $results.Add([pscustomobject]@{
    Url = $page.Url
    Locale = $page.Locale
    QualityKind = $page.QualityKind
    Status = $status
    InternalLinksFound = ($links | Measure-Object).Count
    LinkedCommercialCount = ($linkedTargets | Measure-Object).Count
    HasRoomsListLink = $hasRoomsList
    HasFindYourRoomLink = $hasFindRoom
    HasRatesLink = $hasRates
    HasContactLink = $hasContact
    Recommendation = $recommendation
    LinkedCommercialUrls = (($linkedTargets | Select-Object -ExpandProperty Url -Unique) -join " | ")
    Error = $errorMessage
  })
}

$results |
  Sort-Object Locale, QualityKind, Url |
  Export-Csv $OutCsv -NoTypeInformation -Encoding UTF8

$needsLinks = $results | Where-Object { $_.Recommendation -ne "OK" }
$errors = $results | Where-Object { $_.Error }

$summary = @()
$summary += "# Internal Linking Audit"
$summary += ""
$summary += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$summary += "Guide/source pages checked: $($results.Count)"
$summary += "Commercial target pages found: $($commercialTargets.Count)"
$summary += ""
$summary += "## Main counts"
$summary += ""
$summary += "Pages OK: $(($results | Where-Object { $_.Recommendation -eq 'OK' }).Count)"
$summary += "Pages needing internal links: $($needsLinks.Count)"
$summary += "Fetch errors: $($errors.Count)"
$summary += ""
$summary += "## By language"
$summary += ""

$results |
  Group-Object Locale |
  Sort-Object Name |
  ForEach-Object {
    $items = $_.Group
    $summary += "$($_.Name): $($items.Count) checked, $(($items | Where-Object { $_.Recommendation -ne 'OK' }).Count) need links"
  }

$summary += ""
$summary += "## By page type"
$summary += ""

$results |
  Group-Object QualityKind |
  Sort-Object Name |
  ForEach-Object {
    $items = $_.Group
    $summary += "$($_.Name): $($items.Count) checked, $(($items | Where-Object { $_.Recommendation -ne 'OK' }).Count) need links"
  }

$summary += ""
$summary += "## Pages needing review"
$summary += ""

if ($needsLinks.Count -eq 0) {
  $summary += "No internal linking problems found."
} else {
  foreach ($p in ($needsLinks | Sort-Object Locale, QualityKind, Url)) {
    $summary += "- $($p.Url)"
    $summary += "  - Locale: $($p.Locale)"
    $summary += "  - Type: $($p.QualityKind)"
    $summary += "  - Recommendation: $($p.Recommendation)"
  }
}

$summary | Set-Content -Encoding UTF8 $OutSummary

Write-Host ""
Write-Host "DONE"
Write-Host "CSV: $OutCsv"
Write-Host "Summary: $OutSummary"
