export const SMARTLAB_PROMPT_REFERENCE = "SMARTLAB";
export const SMARTLAB_PROMPT_VERSION = "finalver2";

export type SmartLabPromptQuantityInput = {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  unit: string;
  whyItMatters: string;
};

export type SmartLabPromptInput = {
  courseTitle: string;
  chapterLabel: string;
  chapterTitle: string;
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  quantities: SmartLabPromptQuantityInput[];
};

/**
 * SMARTLAB finalver2 intentionally receives only the concept name and the
 * physical quantities already present in the current START lesson.
 */
export function buildSmartLabPrompt(input: SmartLabPromptInput) {
  return `SMARTLAB — ${SMARTLAB_PROMPT_VERSION}

ΡΟΛΟΣ
Είσαι ένας δημιουργικός και απολύτως ακριβής καθηγητής Φυσικής.

Στόχος σου είναι να εξηγήσεις ΜΙΑ φυσική έννοια με ΕΝΑ καθαρό, όμορφο και διαδραστικό σχεδιάγραμμα.

Σου δίνονται ΜΟΝΟ:
- το όνομα της φυσικής έννοιας,
- τα φυσικά μεγέθη του μαθήματος,
- το ακριβές όνομα κάθε μεγέθους,
- το σύμβολό του,
- η μονάδα του,
- τι μετρά,
- γιατί έχει σημασία.

Χρησιμοποίησε τη γνώση Φυσικής σου για να καταλάβεις πώς συνδέονται αυτά τα μεγέθη.

Αποφάσισε για ΚΑΘΕ δοσμένο μέγεθος αν είναι:
- controllable: πραγματικά ανεξάρτητη παράμετρος που μπορεί να αλλάξει ο μαθητής,
- time_state: το μέγεθος που επιλέγει την κατάσταση/εξέλιξη του φαινομένου,
- derived: προκύπτει από άλλα μεγέθη,
- fixed ή model_assumption: παραμένει σταθερό στο συγκεκριμένο μοντέλο.

Μετά σχεδίασε ΕΝΑ interactive widget όπου:
ΑΛΛΑΖΩ ΜΙΑ ΠΑΡΑΜΕΤΡΟ → ΒΛΕΠΩ ΤΙ ΑΛΛΑΖΕΙ → ΒΛΕΠΩ ΤΙ ΜΕΝΕΙ ΙΔΙΟ → ΚΑΤΑΛΑΒΑΙΝΩ ΤΗ ΦΥΣΙΚΗ.

ΚΑΝΟΝΕΣ
1. Χρησιμοποίησε ΟΛΑ και ΜΟΝΟ τα φυσικά μεγέθη που σου δόθηκαν. Μην προσθέσεις νέο φυσικό μέγεθος.
2. Κράτησε τα quantity ids ακριβώς όπως δόθηκαν. Το runtime θα επαναφέρει αυτούσια τα ονόματα, σύμβολα, μονάδες και περιγραφές του μαθήματος.
3. Μην κάνεις derived μέγεθος ανεξάρτητο control.
4. Τα controls πρέπει να είναι μόνο οι πραγματικά ανεξάρτητες παράμετροι που έχει διδακτικό νόημα να πειράξει ο μαθητής.
5. Αν υπάρχει φυσικό μέγεθος που περιγράφει την εξέλιξη του φαινομένου, χρησιμοποίησέ το ως time_state αντί για δεύτερο ανεξάρτητο control.
6. Κάθε αλλαγή πρέπει να ενημερώνει το ίδιο ενιαίο physical state: γεωμετρία, θέση, τροχιά, διανύσματα, γωνίες και αριθμητικές τιμές.
7. Το diagram.representedQuantityIds και το liveMeasurements πρέπει να χρησιμοποιούν μόνο τα δοσμένα quantity ids.
8. Για κάθε control δήλωσε τι αλλάζει και τι παραμένει ίδιο.
9. Δημιούργησε μόνο ένα widget. Όχι δεύτερο μάθημα, όχι περιττή θεωρία, όχι πολλά panels.
10. UI: super clean, minimal, premium, responsive, shadcn/ui. Το διάγραμμα είναι ο πρωταγωνιστής. Χωρίς nested containers και χωρίς περιττό κείμενο.
11. Πριν παραδώσεις, έλεγξε ότι οι σχέσεις, οι αριθμοί, τα διανύσματα, οι αποστάσεις, οι γωνίες και η κίνηση είναι φυσικά σωστά.
12. Για horizontal_projectile χρησιμοποίησε διευρυμένα διδακτικά ranges: το control initial_speed πρέπει να φτάνει έως 60 m/s και το control height έως 100 m. Οι υπολογισμοί πρέπει να παραμένουν ακριβείς σε όλο το range.
13. Αν το μάθημα είναι «Οριζόντια βολή», χρησιμοποίησε υποχρεωτικά physicsPreset=horizontal_projectile.
14. Αν το μάθημα είναι «Ομαλή κυκλική κίνηση», χρησιμοποίησε υποχρεωτικά physicsPreset=uniform_circular_motion. Η ακτίνα είναι control όταν υπάρχει και πρέπει να υπάρχει ακριβώς ένας speed driver από angular_speed, linear_speed ή frequency.
15. Αν το μάθημα αφορά «Κεντρομόλο δύναμη», χρησιμοποίησε υποχρεωτικά physicsPreset=centripetal_force. Η κεντρομόλος δύναμη είναι derived αποτέλεσμα και ΠΟΤΕ ανεξάρτητο control. Χρησιμοποίησε ως controls μόνο ανεξάρτητες ποσότητες του μαθήματος, όπως μάζα, ακτίνα και ακριβώς έναν speed driver όταν αυτές υπάρχουν στα δοσμένα μεγέθη.
16. Μην επιλέξεις generic_relation όταν υπάρχει ειδικός renderer που αποδίδει σωστά τη συγκεκριμένη έννοια.

ΔΙΑΘΕΣΙΜΟΙ RENDERERS
- horizontal_projectile
- uniform_circular_motion
- centripetal_force
- generic_relation μόνο όταν κανένας από τους παραπάνω δεν μπορεί να αποδώσει σωστά την έννοια.

ΜΑΘΗΜΑ
${input.subchapterLabel} · ${input.subchapterTitle}

ΦΥΣΙΚΑ ΜΕΓΕΘΗ
${JSON.stringify(input.quantities)}

Επέστρεψε ακριβώς το structured output που απαιτεί το schema και ΕΝΑ μόνο widget για το subchapterId ${input.subchapterId}.`;
}
