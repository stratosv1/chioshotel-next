# Apps Script — Voulamandis Wizard API

Ο κώδικας του Google Apps Script (Beds24 → Booking Core → Neon) ζει εδώ, στο `src/`.
Το workflow `.github/workflows/apps-script.yml` τον συγχρονίζει με το script.google.com.

- **pull** (χειροκίνητα, Actions → Apps Script sync → Run workflow → `pull`):
  φέρνει τον τρέχοντα κώδικα από το script.google.com και τον κάνει commit στο main.
- **push** (αυτόματα σε κάθε αλλαγή του `apps-script/src/**` στο main, ή χειροκίνητα):
  ανεβάζει το `src/` στο script.google.com.

Κανόνας: αλλαγές μόνο από εδώ. Αν αλλάξει κάτι απευθείας στον editor της Google,
τρέξε πρώτα `pull`, αλλιώς το επόμενο push θα το σβήσει.

Secrets (Settings → Secrets and variables → Actions):
- `APPS_SCRIPT_ID` — Script ID (Apps Script → Project Settings ⚙️).
- `CLASPRC_JSON` — όλο το περιεχόμενο του `~/.clasprc.json` μετά από `npx @google/clasp@2 login`.
