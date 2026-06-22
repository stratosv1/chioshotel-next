$inCsv = "reports\schema-type-inventory.csv"
$outTxt = "reports\schema-type-quality-summary.txt"

$rows = Import-Csv $inCsv

function Get-QualityKind($row) {
  $types = " $($row.Types) "
  $url = $row.Url

  if ($row.PageKind -eq "home") { return "home" }

  if ($types -match 'ContactPage') { return "contact" }
  if ($types -match 'SearchResultsPage') { return "find-your-room" }
  if ($types -match 'FAQPage' -and $types -match 'Accommodation' -and $types -match 'Room') { return "room-detail" }
  if ($types -match 'OfferCatalog') { return "deals" }
  if ($types -match 'Offer' -and $types -notmatch 'OfferCatalog') { return "rates-or-booking" }

  if ($types -match 'CollectionPage' -and $types -match 'Accommodation') { return "rooms-list" }

  if ($types -match 'CollectionPage' -and $types -match 'Beach') { return "beaches-list" }
  if ($types -match 'Beach') { return "beach-detail" }

  if ($types -match 'CollectionPage' -and $types -match 'Museum') { return "museums-list" }
  if ($types -match 'Museum') { return "museum-detail" }

  if ($types -match 'CollectionPage' -and $types -match 'Place') { return "villages-list" }
  if ($types -match 'Place') { return "village-detail" }

  if ($types -match 'TouristDestination') { return "chios-island-or-destination" }
  if ($types -match 'TouristTrip') { return "tourist-guide-or-trip" }
  if ($types -match 'ImageGallery') { return "gallery-guide" }

  return "other-guide-or-landing"
}

$qualityRows = $rows | ForEach-Object {
  [pscustomobject]@{
    Url = $_.Url
    Locale = $_.Locale
    OldPageKind = $_.PageKind
    QualityKind = Get-QualityKind $_
    Types = $_.Types
  }
}

$summary = $qualityRows |
  Group-Object QualityKind |
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

$qualityRows | Export-Csv -NoTypeInformation -Encoding UTF8 "reports\schema-type-quality-inventory.csv"

Write-Host "Created:"
Write-Host "reports\schema-type-quality-inventory.csv"
Write-Host $outTxt
