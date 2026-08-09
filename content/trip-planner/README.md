# Chios Trip Planner

Canonical static content and routing metadata for the Trip Planner.

- `beaches.ts` and `beach-routing.ts`: beach planning data
- `villages.ts` and `village-routing.ts`: village planning data
- `marine-exposure.ts`: manually reviewed directional coastal-exposure metadata
- `marine-comfort.ts`: deterministic marine-comfort scoring and ranking
- `marine-forecast.ts`: Open-Meteo marine/weather forecast adapter
- UI consumes these files through `content/trip-planner/index.ts`

Planning distances and drive times are rounded estimates and are not live navigation data.

## Marine forecast diagnostic

`GET /api/trip-planner/marine` fetches hourly Open-Meteo marine and wind data for all active beaches and returns a ranked diagnostic result. Optional query parameters are `date=YYYY-MM-DD`, `start=0..23`, `end=0..23`, and `beaches=id1,id2`.

The adapter batches all beach coordinates into one Marine API request and one Weather API request. Marine data uses `cell_selection=sea`; weather wind data uses `cell_selection=nearest`. Forecast responses are cached for 15 minutes.

Default endpoints are the Open-Meteo free/evaluation endpoints. Production commercial use should configure the paid customer endpoints supplied by Open-Meteo using `OPEN_METEO_MARINE_ENDPOINT`, `OPEN_METEO_WEATHER_ENDPOINT`, and `OPEN_METEO_API_KEY`. Never expose the API key to client-side code.

Marine scores are recommendation heuristics only. They combine forecast data with mapped beach exposure and must not be described as live shoreline measurements or bathing-safety guarantees.
