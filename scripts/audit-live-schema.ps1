$ErrorActionPreference = "Continue"

$urls = Get-Content reports/site-urls.txt -ErrorAction SilentlyContinue

if (-not $urls) {
  Write-Host "Δεν βρέθηκε reports/site-urls.txt. Βάλε εκεί τα URLs από το sitemap."
  exit 1
}

$out = @()

foreach ($url in $urls) {
  Write-Host "Checking $url"

  try {
    $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30).Content

    $schemaMatches = [regex]::Matches(
      $html,
      '<script[^>]+type=["'']application/ld\+json["''][^>]*>(.*?)</script>',
      [System.Text.RegularExpressions.RegexOptions]::Singleline -bor
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    $types = @()
    $hasHotel = $false
    $hasHotelRoom = $false
    $hasLodgingBusiness = $false
    $hasLanguage = $false

    foreach ($m in $schemaMatches) {
      $json = $m.Groups[1].Value.Trim()

      if ($json -match '"@type"\s*:\s*"Hotel"') { $hasHotel = $true }
      if ($json -match '"@type"\s*:\s*"HotelRoom"') { $hasHotelRoom = $true }
      if ($json -match '"@type"\s*:\s*"LodgingBusiness"') { $hasLodgingBusiness = $true }
      if ($json -match '"inLanguage"\s*:') { $hasLanguage = $true }

      try {
        $obj = $json | ConvertFrom-Json

        if ($obj.'@graph') {
          foreach ($g in $obj.'@graph') {
            if ($g.'@type') {
              if ($g.'@type' -is [array]) {
                $types += ($g.'@type' -join "|")
              } else {
                $types += $g.'@type'
              }
            }
          }
        } elseif ($obj.'@type') {
          if ($obj.'@type' -is [array]) {
            $types += ($obj.'@type' -join "|")
          } else {
            $types += $obj.'@type'
          }
        }
      } catch {
        $types += "INVALID_JSON_LD"
      }
    }

    $out += [pscustomobject]@{
      Url = $url
      SchemaCount = $schemaMatches.Count
      SchemaTypes = (($types | Sort-Object -Unique) -join ", ")
      HasSchema = $schemaMatches.Count -gt 0
      HasHotelType = $hasHotel
      HasHotelRoomType = $hasHotelRoom
      HasLodgingBusiness = $hasLodgingBusiness
      HasInLanguage = $hasLanguage
      HasInvalidJsonLd = $types -contains "INVALID_JSON_LD"
    }
  } catch {
    $out += [pscustomobject]@{
      Url = $url
      SchemaCount = 0
      SchemaTypes = "FETCH_ERROR"
      HasSchema = $false
      HasHotelType = $false
      HasHotelRoomType = $false
      HasLodgingBusiness = $false
      HasInLanguage = $false
      HasInvalidJsonLd = $false
    }
  }
}

$out | Export-Csv -NoTypeInformation -Encoding UTF8 reports/live-schema-audit.csv

$summary = @()
$summary += "Live schema audit"
$summary += "Total URLs: $($out.Count)"
$summary += "Without schema: $(($out | Where-Object { -not $_.HasSchema }).Count)"
$summary += "With Hotel type: $(($out | Where-Object { $_.HasHotelType }).Count)"
$summary += "With HotelRoom type: $(($out | Where-Object { $_.HasHotelRoomType }).Count)"
$summary += "Without inLanguage: $(($out | Where-Object { -not $_.HasInLanguage }).Count)"
$summary += "Invalid JSON-LD: $(($out | Where-Object { $_.HasInvalidJsonLd }).Count)"

$summary | Set-Content -Encoding UTF8 reports/live-schema-summary.txt

Get-Content reports/live-schema-summary.txt

