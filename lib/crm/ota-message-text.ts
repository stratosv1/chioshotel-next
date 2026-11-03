import type { EmailLanguage } from "@/lib/crm/email-design";

// Plain text only: Booking.com and Expedia reject HTML and strip unknown links.
export function buildOtaMessage(language: EmailLanguage, firstName: string) {
  const name = firstName.trim();
  return {
    el: `Γεια σας${name ? ` ${name}` : ""}, σας ευχαριστούμε θερμά για την κράτησή σας στο Voulamandis House!

Θα θέλαμε να μας στείλετε το προσωπικό σας email, απαντώντας σε αυτό το μήνυμα. Όσο πλησιάζει η άφιξή σας, θα σας στείλουμε:

- Πώς θα φτάσετε στο κατάλυμα, με τη διαδρομή και οδηγίες από το Google Maps
- Χρήσιμες πληροφορίες για το νησί
- Τις προτάσεις μας ως ντόπιοι, για να εξερευνήσετε τη Χίο και να δείτε όλες τις ομορφιές της

Θα χρησιμοποιήσουμε το email σας μόνο για τη διαμονή σας.

Αγγελική, Στράτος & Μιχάλης`,
    en: `Hello${name ? ` ${name}` : ""}, thank you so much for your booking at Voulamandis House!

We would love to have your personal email address, so please reply to this message with it. As your arrival gets closer, we will send you:

- How to reach the property, with the route and Google Maps directions
- Useful information about the island
- Our tips as locals, so you can explore Chios and discover all its beauty

We will only use your email for your stay.

Angeliki, Stratos & Mike`,
    tr: `Merhaba${name ? ` ${name}` : ""}, Voulamandis House rezervasyonunuz için çok teşekkür ederiz!

Lütfen bu mesajı yanıtlayarak kişisel e-posta adresinizi bize iletin. Varışınız yaklaştıkça size şunları göndereceğiz:

- Konaklama yerine nasıl ulaşacağınız, güzergâh ve Google Maps yol tarifi
- Ada hakkında faydalı bilgiler
- Sakız Adası’nı keşfedip tüm güzelliklerini görebilmeniz için yerel olarak önerilerimiz

E-postanızı yalnızca konaklamanız için kullanacağız.

Angeliki, Stratos & Mike`,
  }[language];
}
