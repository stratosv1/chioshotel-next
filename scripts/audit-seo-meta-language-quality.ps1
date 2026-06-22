$ErrorActionPreference = "Stop"

$BaseUrl = "https://chioshotel.gr"
$OutCsv = "reports\seo-meta-language-quality-audit.csv"
$OutSummary = "reports\seo-meta-language-quality-summary.txt"

function Get-ExpectedLocale {
  param([string]$Url)

  if ($Url -match "https://chioshotel\.gr/(el)(/|$)") { return "el" }
  if ($Url -match "https://chioshotel\.gr/(de)(/|$)") { return "de" }
  if ($Url -match "https://chioshotel\.gr/(fr)(/|$)") { return "fr" }
  if ($Url -match "https://chioshotel\.gr/(it)(/|$)") { return "it" }
  if ($Url -match "https://chioshotel\.gr/(es)(/|$)") { return "es" }
  if ($Url -match "https://chioshotel\.gr/(tr)(/|$)") { return "tr" }
  return "en"
}

function Get-LocaleName {
  param([string]$Locale)
  switch ($Locale) {
    "en" { "English" }
    "el" { "Greek" }
    "de" { "German" }
    "fr" { "French" }
    "it" { "Italian" }
    "es" { "Spanish" }
    "tr" { "Turkish" }
    default { $Locale }
  }
}

function Get-HtmlMeta {
  param([string]$Html, [string]$Name)

  $pattern1 = '<meta\s+[^>]*name=["'']' + [regex]::Escape($Name) + '["''][^>]*content=["'']([^"'']*)["''][^>]*>'
  $pattern2 = '<meta\s+[^>]*content=["'']([^"'']*)["''][^>]*name=["'']' + [regex]::Escape($Name) + '["''][^>]*>'

  $m = [regex]::Match($Html, $pattern1, "IgnoreCase")
  if ($m.Success) { return [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value.Trim()) }

  $m = [regex]::Match($Html, $pattern2, "IgnoreCase")
  if ($m.Success) { return [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value.Trim()) }

  return ""
}

function Get-HtmlTitle {
  param([string]$Html)

  $m = [regex]::Match($Html, "<title[^>]*>(.*?)</title>", "IgnoreCase,Singleline")
  if ($m.Success) {
    return [System.Net.WebUtility]::HtmlDecode(($m.Groups[1].Value -replace "\s+", " ").Trim())
  }

  return ""
}

function Get-HtmlLang {
  param([string]$Html)

  $m = [regex]::Match($Html, '<html[^>]*lang=["'']([^"'']+)["'']', "IgnoreCase")
  if ($m.Success) { return $m.Groups[1].Value.Trim().ToLowerInvariant() }

  return ""
}

function Get-LanguageWarning {
  param(
    [string]$Locale,
    [string]$Title,
    [string]$Description
  )

  $text = (($Title + " " + $Description).ToLowerInvariant())

  $signals = @{
    en = @("rooms", "apartments", "chios", "beach", "village", "museum", "family", "travel", "contact", "rates")
    el = @("χίος", "χίου", "δωμάτια", "διαμερίσματα", "παραλία", "χωριά", "μουσεία", "επικοινωνία", "κρατηση", "κράτηση")
    de = @("zimmer", "chios", "strand", "dorf", "museen", "kontakt", "angebote", "insel")
    fr = @("chambres", "chios", "plage", "village", "musee", "musée", "contact", "offres")
    it = @("camere", "chios", "spiaggia", "villaggio", "museo", "contattaci", "offerte")
    es = @("habitaciones", "quios", "chios", "playa", "pueblo", "museo", "contacta", "ofertas")
    tr = @("sakiz", "sakız", "odalar", "plaj", "koy", "köy", "muzesi", "müzesi", "iletisim", "iletişim")
  }

  $hits = 0
  foreach ($word in $signals[$Locale]) {
    if ($text.Contains($word)) { $hits++ }
  }

  if ($hits -eq 0) {
    return "Possible wrong language or too generic"
  }

  return ""
}

function Get-HotelWarning {
  param(
    [string]$Title,
    [string]$Description
  )

  $text = (($Title + " " + $Description).ToLowerInvariant())

  $badTerms = @(
    "hotelroom",
    "hotel room",
    "hotel rooms",
    "large hotel",
    "hotel chain",
    "resort",
    "ξενοδοχειακή μονάδα",
    "ξενοδοχειακο συγκροτημα",
    "ξενοδοχειακό συγκρότημα",
    "ξενοδοχείο 5",
    "5-star hotel",
    "five star hotel"
  )

  foreach ($term in $badTerms) {
    if ($text.Contains($term)) {
      return "Review hotel/resort wording: $term"
    }
  }

  # Ήπια ένδειξη: δεν είναι απαραίτητα λάθος, αλλά θέλει έλεγχο.
  $softTerms = @("hotel", "hotels", "ξενοδοχείο", "ξενοδοχεία", "otel", "otelleri", "hôtel", "hoteles", "albergo")
  foreach ($term in $softTerms) {
    if ($text.Contains($term)) {
      return "Soft review: contains generic hotel term: $term"
    }
  }

  return ""
}

function Get-LengthWarning {
  param(
    [string]$Title,
    [string]$Description
  )

  $warnings = @()

  if ([string]::IsNullOrWhiteSpace($Title)) {
    $warnings += "Missing title"
  } elseif ($Title.Length -lt 25) {
    $warnings += "Title too short"
  } elseif ($Title.Length -gt 65) {
    $warnings += "Title too long"
  }

  if ([string]::IsNullOrWhiteSpace($Description)) {
    $warnings += "Missing description"
  } elseif ($Description.Length -lt 70) {
    $warnings += "Description too short"
  } elseif ($Description.Length -gt 170) {
    $warnings += "Description too long"
  }

  return ($warnings -join "; ")
}

# URLs από το schema inventory, αλλιώς από sitemap.
$urls = @()

if (Test-Path "reports\schema-type-quality-inventory.csv") {
  $urls = Import-Csv "reports\schema-type-quality-inventory.csv" |
    Where-Object { $_.Url -match "^https://chioshotel\.gr/" } |
    Select-Object -ExpandProperty Url -Unique
}

if (-not $urls -or $urls.Count -eq 0) {
  $sitemap = Invoke-WebRequest "$BaseUrl/sitemap.xml" -UseBasicParsing
  $urls = [regex]::Matches($sitemap.Content, "<loc>(.*?)</loc>") |
    ForEach-Object { $_.Groups[1].Value.Trim() } |
    Where-Object { $_ -match "^https://chioshotel\.gr/" } |
    Select-Object -Unique
}

$results = New-Object System.Collections.Generic.List[object]
$total = $urls.Count
$i = 0

foreach ($url in $urls) {
  $i++
  Write-Host "[$i/$total] $url"

  $locale = Get-ExpectedLocale $url
  $status = ""
  $title = ""
  $description = ""
  $htmlLang = ""
  $errorMessage = ""

  try {
    $response = Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 30
    $status = [int]$response.StatusCode
    $html = $response.Content

    $title = Get-HtmlTitle $html
    $description = Get-HtmlMeta $html "description"
    $htmlLang = Get-HtmlLang $html
  } catch {
    $status = "ERROR"
    $errorMessage = $_.Exception.Message
  }

  $lengthWarning = Get-LengthWarning $title $description
  $languageWarning = Get-LanguageWarning $locale $title $description
  $hotelWarning = Get-HotelWarning $title $description

  $htmlLangWarning = ""
  if ($htmlLang -and $htmlLang -notlike "$locale*") {
    $htmlLangWarning = "html lang mismatch: expected $locale, found $htmlLang"
  }

  $results.Add([pscustomobject]@{
    Url = $url
    ExpectedLocale = $locale
    ExpectedLanguage = Get-LocaleName $locale
    Status = $status
    HtmlLang = $htmlLang
    Title = $title
    TitleLength = $title.Length
    Description = $description
    DescriptionLength = $description.Length
    LengthWarning = $lengthWarning
    LanguageWarning = $languageWarning
    HotelWarning = $hotelWarning
    HtmlLangWarning = $htmlLangWarning
    Error = $errorMessage
  })
}

# Duplicate checks
$titleGroups = $results |
  Where-Object { -not [string]::IsNullOrWhiteSpace($_.Title) } |
  Group-Object Title |
  Where-Object { $_.Count -gt 1 }

$descriptionGroups = $results |
  Where-Object { -not [string]::IsNullOrWhiteSpace($_.Description) } |
  Group-Object Description |
  Where-Object { $_.Count -gt 1 }

foreach ($group in $titleGroups) {
  foreach ($item in $group.Group) {
    $item | Add-Member -NotePropertyName DuplicateTitleCount -NotePropertyValue $group.Count -Force
  }
}

foreach ($group in $descriptionGroups) {
  foreach ($item in $group.Group) {
    $item | Add-Member -NotePropertyName DuplicateDescriptionCount -NotePropertyValue $group.Count -Force
  }
}

foreach ($item in $results) {
  if (-not ($item.PSObject.Properties.Name -contains "DuplicateTitleCount")) {
    $item | Add-Member -NotePropertyName DuplicateTitleCount -NotePropertyValue 0 -Force
  }
  if (-not ($item.PSObject.Properties.Name -contains "DuplicateDescriptionCount")) {
    $item | Add-Member -NotePropertyName DuplicateDescriptionCount -NotePropertyValue 0 -Force
  }
}

$results |
  Sort-Object ExpectedLocale, Url |
  Export-Csv $OutCsv -NoTypeInformation -Encoding UTF8

$problems = $results | Where-Object {
  $_.LengthWarning -or
  $_.LanguageWarning -or
  $_.HotelWarning -or
  $_.HtmlLangWarning -or
  $_.DuplicateTitleCount -gt 0 -or
  $_.DuplicateDescriptionCount -gt 0 -or
  $_.Error
}

$summary = @()
$summary += "# SEO Meta Language Quality Audit"
$summary += ""
$summary += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$summary += "Total URLs checked: $($results.Count)"
$summary += ""
$summary += "## Main counts"
$summary += ""
$summary += "Missing titles: $(($results | Where-Object { [string]::IsNullOrWhiteSpace($_.Title) }).Count)"
$summary += "Missing descriptions: $(($results | Where-Object { [string]::IsNullOrWhiteSpace($_.Description) }).Count)"
$summary += "Duplicate title groups: $($titleGroups.Count)"
$summary += "Duplicate description groups: $($descriptionGroups.Count)"
$summary += "URLs with length warnings: $(($results | Where-Object { $_.LengthWarning }).Count)"
$summary += "URLs with possible language warnings: $(($results | Where-Object { $_.LanguageWarning }).Count)"
$summary += "URLs with hotel/resort wording warnings: $(($results | Where-Object { $_.HotelWarning }).Count)"
$summary += "URLs with html lang mismatch: $(($results | Where-Object { $_.HtmlLangWarning }).Count)"
$summary += "URLs with fetch errors: $(($results | Where-Object { $_.Error }).Count)"
$summary += ""
$summary += "## By language"
$summary += ""

$results |
  Group-Object ExpectedLocale |
  Sort-Object Name |
  ForEach-Object {
    $summary += "$($_.Name): $($_.Count) URLs"
  }

$summary += ""
$summary += "## URLs needing review"
$summary += ""

if ($problems.Count -eq 0) {
  $summary += "No problems found."
} else {
  foreach ($p in ($problems | Sort-Object ExpectedLocale, Url)) {
    $summary += "- $($p.Url)"
    if ($p.LengthWarning) { $summary += "  - Length: $($p.LengthWarning)" }
    if ($p.LanguageWarning) { $summary += "  - Language: $($p.LanguageWarning)" }
    if ($p.HotelWarning) { $summary += "  - Hotel wording: $($p.HotelWarning)" }
    if ($p.HtmlLangWarning) { $summary += "  - Html lang: $($p.HtmlLangWarning)" }
    if ($p.DuplicateTitleCount -gt 0) { $summary += "  - Duplicate title count: $($p.DuplicateTitleCount)" }
    if ($p.DuplicateDescriptionCount -gt 0) { $summary += "  - Duplicate description count: $($p.DuplicateDescriptionCount)" }
    if ($p.Error) { $summary += "  - Error: $($p.Error)" }
  }
}

$summary | Set-Content -Encoding UTF8 $OutSummary

Write-Host ""
Write-Host "DONE"
Write-Host "CSV: $OutCsv"
Write-Host "Summary: $OutSummary"
