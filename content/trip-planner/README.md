# Chios Trip Planner

Canonical static content, routing metadata, media overrides and marine-ranking logic for the current Trip Planner.

- `beaches.ts` and `beach-routing.ts`: active beach planning data and coordinates
- `villages.ts` and `village-routing.ts`: village planning data
- `extra-places.ts`: sights, food and drink choices used by the current flow
- `media.ts`: curated place-to-image overrides
- `marine-exposure.ts`: manually reviewed directional coastal-exposure metadata
- `marine-comfort.ts`: deterministic marine-comfort scoring and ranking
- `marine-forecast.ts`: Open-Meteo marine/weather forecast adapter
- `index.ts`: public content exports consumed by the planner UI

The active UI is `components/trip-planner/TripPlannerStartV2.tsx` and the active page is `/trip-planner/`.

Planning distances and drive times are rounded estimates and are not live navigation data.

## Marine forecast and ranking

`GET /api/trip-planner/marine` fetches hourly Open-Meteo marine and wind data for all active beaches and returns the ranked result used by the region tip and beach cards. Optional query parameters are `date=YYYY-MM-DD`, `start=0..23`, `end=0..23`, and `beaches=id1,id2`.

The adapter batches beach coordinates into one Marine API request and one Weather API request. Marine data uses `cell_selection=sea`; weather wind data uses `cell_selection=nearest`. Forecast responses are cached for 15 minutes.

The default configuration uses the public Open-Meteo endpoints. Endpoint and API-key overrides are supported through `OPEN_METEO_MARINE_ENDPOINT`, `OPEN_METEO_WEATHER_ENDPOINT`, and `OPEN_METEO_API_KEY`; API keys must never be exposed to client-side code.

Marine scores are recommendation heuristics only. They combine forecast data with mapped beach exposure and must not be described as live shoreline measurements or bathing-safety guarantees.

## Validation

`.github/workflows/trip-planner-marine-diagnostic.yml` validates that all 26 active beaches have routing data and receive a marine score before Trip Planner changes are merged into `main`. Temporary visual-QA and one-off image-import tooling is intentionally not kept in production.
