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

## Νέα έκδοση του κώδικα: `proposed/Code.js`

Καθαρή, βελτιστοποιημένη έκδοση του script (Beds24 → φύλλα → Neon). Βρίσκεται
έξω από το `src/` επίτηδες: το `clasp push --force` αντικαθιστά **όλα** τα αρχεία
του project, οπότε πρώτα τρέχει το `pull` και μετά μπαίνει ο νέος κώδικας στη θέση του παλιού.

Έλεγχος τοπικά (ψεύτικες υπηρεσίες Google, χωρίς δίκτυο):

    node apps-script/test/test.js

Μετά το deploy, μία φορά στον editor:
1. `setupTriggers()` — σβήνει παλιά/διπλά triggers, φτιάχνει `refreshSystem` κάθε 2 ώρες
   (δίχτυ ασφαλείας· οι αλλαγές του Beds24 έρχονται με webhook σε ~1 λεπτό).
2. Deploy → Manage deployments → ✏️ → Version: New version → Deploy
   (χωρίς νέα έκδοση το web app τρέχει ακόμα τον παλιό κώδικα).
3. `?action=booking_core_health` → πρέπει να δείχνει `ok: true`, `refreshTriggerInstalled: true`.

Το `booking_core_snapshot` δέχεται `since=<dataUpdatedAt>`: αν η Neon έχει ήδη τα τρέχοντα
δεδομένα, απαντά `notModified: true` χωρίς γραμμές και χωρίς να διαβάσει το φύλλο.

Προαιρετικά Script Properties:
- `BOOKING_CORE_SNAPSHOT_SECRET` — αν οριστεί, το `booking_core_snapshot` θέλει `?secret=`
  (ίδια τιμή με το `OCCUPANCY_SCRIPT_SECRET` στο Vercel).
- `STAFF_API_KEY` — με `?key=` το `action=bookings` δίνει και στοιχεία επισκεπτών.
