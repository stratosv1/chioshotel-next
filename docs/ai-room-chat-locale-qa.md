# AI Room Finder locale QA

Validated on the Vercel preview for the seven supported languages only:

- Greek (`el`)
- English (`en`)
- German (`de`)
- French (`fr`)
- Italian (`it`)
- Spanish (`es`)
- Turkish (`tr`)

Polish is intentionally not included.

## Results

- Next.js application build: passed
- TypeScript locale completeness: passed through `satisfies Record<Language, Copy>`
- Multilingual AI human-journey QA: 22/22 scenarios passed
- Full booking flow: passed in all seven languages
- Correction flow: passed in all seven languages
- General-answer language check: passed in all seven languages
- Unsafe booking scenario: correctly blocked

The frontend uses localized singular/plural labels for rooms, guests and nights, localized error and unavailable states, localized breakfast and summary labels, and localized accessibility labels.
