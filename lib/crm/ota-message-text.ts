import type { EmailLanguage } from "@/lib/crm/email-design";

const CONTACT_EMAIL = "vhouse.reservations@gmail.com";
const WHATSAPP = "+30 694 447 4226";

// Plain text only: Booking.com and Expedia reject HTML and strip unknown links.
export function buildOtaMessage(language: EmailLanguage, firstName: string, lastMinute = false) {
  const name = firstName.trim();
  if (lastMinute) {
    return {
      el: `Γεια σας${name ? ` ${name}` : ""}, σας ευχαριστούμε για την κράτησή σας στο Voulamandis House!

Επειδή έρχεστε σύντομα, απαντήστε σε αυτό το μήνυμα με:
1. Την ώρα άφιξής σας
2. Το προσωπικό σας email, για να σας στείλουμε τη διαδρομή και τις οδηγίες από το Google Maps

Θα χρησιμοποιήσουμε το email σας μόνο για τη διαμονή σας.

Αγγελική, Στράτος & Μιχάλης`,
      en: `Hello${name ? ` ${name}` : ""}, thank you for your booking at Voulamandis House!

As you are arriving soon, please reply to this message with:
1. Your arrival time
2. Your personal email address, so we can send you the route and Google Maps directions

We will only use your email for your stay.

Angeliki, Stratos & Mike`,
      tr: `Merhaba${name ? ` ${name}` : ""}, Voulamandis House rezervasyonunuz için teşekkür ederiz!

Yakında geleceğiniz için lütfen bu mesajı şu bilgilerle yanıtlayın:
1. Varış saatiniz
2. Güzergâhı ve Google Maps yol tarifini gönderebilmemiz için kişisel e-posta adresiniz

E-postanızı yalnızca konaklamanız için kullanacağız.

Angeliki, Stratos & Mike`,
    }[language];
  }
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

export function buildOtaReminder(language: EmailLanguage, firstName: string) {
  const name = firstName.trim();
  return {
    el: `Γεια σας${name ? ` ${name}` : ""}, η άφιξή σας στο Voulamandis House πλησιάζει!

Δεν έχουμε ακόμα το προσωπικό σας email. Απαντήστε σε αυτό το μήνυμα με το email σας και την ώρα άφιξής σας, για να σας στείλουμε τη διαδρομή και τις οδηγίες.

Αγγελική, Στράτος & Μιχάλης`,
    en: `Hello${name ? ` ${name}` : ""}, your arrival at Voulamandis House is getting closer!

We still do not have your personal email. Please reply to this message with your email and your arrival time, so we can send you the route and directions.

Angeliki, Stratos & Mike`,
    tr: `Merhaba${name ? ` ${name}` : ""}, Voulamandis House varışınız yaklaşıyor!

Kişisel e-posta adresiniz henüz bizde yok. Size güzergâhı ve yol tarifini gönderebilmemiz için lütfen bu mesajı e-postanız ve varış saatinizle yanıtlayın.

Angeliki, Stratos & Mike`,
  }[language];
}

export function buildGuestSms(language: EmailLanguage, firstName: string) {
  const name = firstName.trim();
  return {
    el: `Γεια σας${name ? ` ${name}` : ""}, από το Voulamandis House. Στείλτε μας το email σας και την ώρα άφιξης στο ${CONTACT_EMAIL} ή στο WhatsApp ${WHATSAPP}, ή απαντήστε μας από το Booking/Expedia, για να σας στείλουμε τις οδηγίες.`,
    en: `Hello${name ? ` ${name}` : ""}, this is Voulamandis House. Please send us your email and arrival time at ${CONTACT_EMAIL} or WhatsApp ${WHATSAPP}, or reply on Booking/Expedia, so we can send you directions.`,
    tr: `Merhaba${name ? ` ${name}` : ""}, biz Voulamandis House. Yol tarifini gönderebilmemiz için e-postanızı ve varış saatinizi ${CONTACT_EMAIL} adresine veya WhatsApp ${WHATSAPP} numarasına iletin ya da Booking/Expedia üzerinden yanıtlayın.`,
  }[language];
}
