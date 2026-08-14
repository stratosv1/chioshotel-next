---
name: ai-room-finder-engineer
description: Diagnose, design, and implement the AI Room Finder conversation and UI flow in chioshotel-next. Use for natural-language interpretation, dates, nights, guests, room count, clarification questions, conversation state, delays, repeated messages, search transitions, room-card presentation, breakfast flow, or multilingual assistant behavior. Do not own room inventory or price calculation when the defect is in Neon/SQL; coordinate with booking-engine-integrity or chioshotel-data-debugger instead.
---

# AI Room Finder Engineer

Own the end-to-end conversational layer of the AI Room Finder while keeping inventory and pricing truth outside the UI.

## Read first

Always read `/AGENTS.md` and then inspect the current versions of the relevant files, including where applicable:

- `components/ai/use-room-finder.ts`
- `components/ai/room-finder-booking-flow.ts`
- `components/ai/RoomFinderProduction.tsx`
- `components/ai/AIRoomFinder.tsx`
- `app/api/ai-assistant/interpret/route.ts`
- `app/api/ai-room-finder/availability/route.ts`
- `lib/ai-assistant/*`
- existing Room Finder QA scripts under `scripts/`

Treat these paths as orientation, not permission to assume their implementation is unchanged.

## Architecture rule

Preserve this separation:

`user utterance -> interpreter -> normalized command/actions -> deterministic booking state -> availability API -> database booking functions -> localized presentation`

The model/interpreter may understand language and ambiguity. Deterministic code must validate and apply booking state. Database-backed booking functions remain authoritative for availability and price.

Never let free-form model text directly mutate booking state without validation.

## Conversation behavior

- Every meaningful customer utterance should be interpreted in context rather than matched only by brittle hardcoded phrases.
- Accept natural expressions for dates, nights, room counts, and guests when the interpreter can resolve them confidently.
- If a value is ambiguous or missing, ask one precise clarification question about the smallest unresolved field.
- A clarification must explain what is needed so the customer's next input can succeed.
- Do not re-ask a field that has already been validly supplied in the same or earlier turn unless it was explicitly changed.
- If one utterance supplies multiple fields, apply all valid fields in one turn.
- Validate check-out after check-in and prevent impossible or reversed stays.
- Preserve state when an unrelated or partial answer is received.
- Avoid duplicate bot messages, duplicate searches, stale async responses, and race conditions.
- Delays/typing indicators are presentation only; they must not control business state.

## State-machine discipline

When changing conversation flow:

1. Trace current `FinderStep` transitions.
2. Identify whether the bug originates in interpretation, command application, reducer/state, async orchestration, or rendering.
3. Fix the owning layer rather than adding a downstream exception.
4. Keep search invocation idempotent for a completed booking draft.
5. Guard against stale promises updating a newer conversation state.
6. Restart/reset behavior must clear only the intended session state.

## Availability boundary

Do not calculate room availability or booking prices in UI components. Query the existing availability endpoint/database contract. If the endpoint result is wrong, hand off the root cause to `booking-engine-integrity` or `chioshotel-data-debugger`.

## Multilingual behavior

Verify `en`, `el`, `de`, `fr`, `it`, `es`, `tr` for:

- welcome and prompts,
- clarification questions,
- validation errors,
- room-card labels,
- split-stay copy,
- breakfast and completion messages,
- layout overflow.

Do not silently replace missing localized copy with unrelated English text unless the existing fallback contract requires English.

## QA scenarios

For every flow change, test at least the affected variants of:

- explicit ISO/local date,
- natural-language date,
- `N nights` input,
- multiple fields in one sentence,
- correction of a previously entered date/guest count,
- ambiguous date requiring clarification,
- invalid checkout,
- 1 room and multi-room guest allocation,
- unsupported/edge guest count,
- no availability,
- split-stay path when applicable,
- language-specific conversation,
- rapid consecutive user inputs to expose races.

Prefer and extend existing QA scripts instead of creating redundant test frameworks.

## Completion

Report the root layer, state transition before/after, files changed, scenarios tested, and whether inventory/pricing was independently verified or left untouched.
