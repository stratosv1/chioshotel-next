# Booking emails -> Beds24 notes and the staff CRM

The confirmation, pre-arrival and island emails carry the booking number in the
subject (`✅ 92640049 - Name`). When a guest replies, a short summary is added
to the **Notes** field of the booking in Beds24 and the whole message appears in
the guest's conversation in `/staff/crm`. Our own replies appear only in the CRM.
The Notes field is internal and never sent to the guest.

Flow:

1. `docs/gmail-arrival-notes.gs`: a Google Apps Script in
   vhouse.reservations@gmail.com. It runs every 10 minutes, finds new messages
   in those threads and reads the booking id(s) from the subject.
2. `app/api/gmail/arrival-notes/route.ts`: removes the quoted original email,
   stores the message for the CRM, summarises it with OpenAI (only pleasantries
   means nothing is written) and appends one line to the booking's Notes, e.g.
   `Email πελάτη 23/09: 2/10 17:20 αεροπλάνο από Αθήνα, ταξί`.
   Existing notes are kept, and the same note is not added twice.

Booking.com and Expedia guests have no real email, so the same 10-minute run
calls `app/api/gmail/booking-messages/route.ts`, which reads their messages from
Beds24. A real email found in a message is saved to the CRM (marked
`ota_message`: for the stay only, never for campaigns) and to the booking Notes.

## Setup (once)

1. **Vercel**: add the environment variable `ARRIVAL_NOTES_SECRET` (a long
   random string) to Production and redeploy. The endpoint also uses the
   existing `OPENAI_API_KEY`, `BEDS24_API_TOKEN` and `BEDS24_REFRESH_TOKEN`.
2. **Apps Script**: signed in as vhouse.reservations@gmail.com, open
   https://script.google.com, create a new project and paste the contents of
   `docs/gmail-arrival-notes.gs`.
3. Project Settings -> Script properties: add `ARRIVAL_NOTES_SECRET` with the
   same value as in Vercel.
4. Select `installTrigger` and click Run once. Google asks for permission to
   read Gmail and connect to external services: approve it.

From then on it runs on its own. Errors show under Executions in Apps Script.
A failed reply is retried on the next run.
