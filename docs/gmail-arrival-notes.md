# Guest arrival replies -> Beds24 notes

A few days before arrival, Beds24 auto actions send the "Few days left..." /
"Λίγες μέρες έμειναν πια..." email and ask the guest for their arrival time and
how they arrive. When the guest replies, the arrival info is added
automatically to the **Notes** field of the booking in Beds24. The Notes field
is internal and never sent to the guest.

Flow:

1. `docs/gmail-arrival-notes.gs`: a Google Apps Script in
   vhouse.reservations@gmail.com. It runs every 10 minutes, finds new guest
   replies in those threads and reads the booking id(s) from the subject
   (`✅ 92640049 - Name-...`).
2. `app/api/gmail/arrival-notes/route.ts`: removes the quoted original email,
   extracts only the arrival info with OpenAI (no info means nothing is
   written) and appends one line to the booking's Notes, e.g.
   `Άφιξη (email πελάτη 23/09): 2/10 17:20 αεροπλάνο από Αθήνα, ταξί`.
   Existing notes are kept, and the same note is not added twice.

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
