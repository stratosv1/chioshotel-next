---
name: whatsapp-ai-receptionist
description: Design, audit, and implement WhatsApp Business/Meta AI receptionist flows for Voulamandis House, including webhooks, inbound messages, conversation context, OpenAI interpretation, Room Finder integration, approved templates, interactive replies/cards where supported, opt-in rules, escalation to a human, and delivery/error handling. Use for WhatsApp automation or AI reception work. Do not assume Meta features, template approval, or message-type support without verifying the current API and existing project implementation.
---

# WhatsApp AI Receptionist

Build WhatsApp as a channel over the same booking truth used by the website, not as a separate booking engine.

## Target architecture

Prefer a clear separation such as:

`WhatsApp/Meta webhook -> verified inbound event -> conversation/session layer -> intent/interpreter -> deterministic booking flow -> existing availability/pricing service -> response adapter -> WhatsApp API`

Reuse authoritative Room Finder and booking logic instead of duplicating it for WhatsApp.

## Mandatory startup

1. Read `/AGENTS.md`.
2. Inspect the repository for existing Meta/WhatsApp code, environment-variable usage, webhooks, messaging providers, and AI Room Finder contracts.
3. Verify current Meta WhatsApp Cloud API behavior/documentation when API capabilities or policy could have changed.
4. Never expose access tokens, app secrets, verify tokens, phone-number IDs, or customer data.

## Inbound webhook rules

- Verify webhook setup/signatures according to the current Meta contract.
- Treat webhook delivery as at-least-once: duplicate events must not cause duplicate customer replies or duplicate booking actions.
- Persist or derive a stable message/event idempotency key.
- Ignore or safely handle unsupported event types.
- Return webhook acknowledgements quickly; do not tie correctness to a long-running HTTP request when the architecture provides a safer queue/job path.

## Conversation rules

- Maintain conversation state by the correct WhatsApp contact identity and session boundary.
- Route customer text through the same interpretation principles as the AI Room Finder.
- Ask one precise clarification when required.
- Never invent availability, rates, policies, or booking confirmation.
- Use the existing booking/availability engine for dates, guests, rooms, totals, and split stays.
- Keep language consistent with the customer's language when supported.
- Provide a clear human-handoff path for unresolved requests, complaints, exceptional cases, or explicit requests for a person.

## Outbound messaging

Before implementing a message type, distinguish:

- active customer-service conversation messages,
- template messages outside the service window,
- approved interactive/template capabilities,
- unsupported rich-card concepts that may need adaptation.

Do not assume a website Room Finder card can be rendered identically in WhatsApp. Map it to currently supported WhatsApp message/template primitives.

## Opt-in and templates

- Respect current WhatsApp Business opt-in and template requirements.
- Do not send promotional/broadcast messages to arbitrary numbers.
- Treat template status as external state; do not assume pending templates are approved.
- Separate transactional guest-service messaging from marketing use cases.

## Reliability

Audit for:

- duplicate webhook delivery,
- retries and backoff,
- rate limits,
- provider/API errors,
- expired tokens,
- stale conversation state,
- ordering of fast consecutive customer messages,
- human/AI collision where both respond,
- logging without leaking personal data or secrets.

## Testing

Test at least:

- webhook verification,
- one normal inbound text,
- duplicate same message id,
- rapid consecutive messages,
- ambiguous booking request,
- complete booking request in one sentence,
- no availability,
- API failure,
- unsupported input type,
- human handoff,
- supported-language response.

## Completion

Report the exact channel architecture, reused booking components, new state/persistence introduced, Meta-policy assumptions verified, failure handling, and whether the flow was tested only in sandbox/test-number mode or against production messaging.
