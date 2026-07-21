import { localizedBeachDetails, type BeachDetailData } from "../content/beach-details";
import { chiosBeachesPageTr } from "../content/chios-beaches";
import { beachLoversPages } from "../content/beach-lovers";
import { contactPageTr } from "../content/contact";
import { localizedMuseumDetails, type MuseumDetailData } from "../content/museum-details";
import { ratesPageTr } from "../content/rates";
import {
  economyDoubleRoomsTr,
  familyChiosApartmentsTr,
  standardDoubleRoomTr,
  type RoomDetailData,
} from "../content/room-details";
import { roomsCategoryTr } from "../content/rooms";
import { localizedVillageDetails, type VillageDetailData } from "../content/village-details";
import { seoSnippetOverrides } from "./seo-snippet-overrides";

type SeoCorrection = {
  title: string;
  description: string;
};

type DetailCorrection = SeoCorrection & {
  heroTitle: string;
  heroDescription: string;
};

type MuseumCorrection = DetailCorrection & {
  details: MuseumDetailData["details"];
  highlights: MuseumDetailData["highlights"];
  experience: MuseumDetailData["experience"];
};

const turkishPageSeoCorrections = new Map<string, SeoCorrection>([
  [
    "/tr/",
    {
      title: "Sakız Adası’nda oda ve daireler | Voulamandis House",
      description:
        "Sakız Adası’nın tarihi Kambos bölgesinde sakin odalar ve aile daireleri. Şehre, havalimanına ve plajlara yakın, doğrudan rezervasyon imkânı.",
    },
  ],
  [
    roomsCategoryTr.seo.canonicalPath,
    {
      title: "Sakız Adası’nda odalar ve daireler | Kambos",
      description:
        "Voulamandis House’ta ekonomik çift kişilik odaları, standart odaları ve mutfaklı aile dairelerini karşılaştırın.",
    },
  ],
  [
    contactPageTr.seo.canonicalPath,
    {
      title: "Voulamandis House iletişim | Oda ve müsaitlik talebi",
      description:
        "Sakız Adası Kambos’taki Voulamandis House ile WhatsApp veya e-posta üzerinden iletişime geçin; müsaitlik, fiyat ve oda seçeneklerini sorun.",
    },
  ],
  [
    ratesPageTr.seo.canonicalPath,
    {
      title: "Sakız Adası’nda direkt rezervasyon | Fiyat ve müsaitlik",
      description:
        "Canlı müsaitliği kontrol edin, odanızı veya dairenizi seçin ve Voulamandis House’ta güvenli şekilde doğrudan rezervasyon yapın.",
    },
  ],
  [
    "/tr/odani-bul/",
    {
      title: "Sakız Adası’nda oda bul | Canlı müsaitlik",
      description:
        "Tarihleri ve kişi sayısını girin, müsait oda ve daireleri karşılaştırın, direkt fiyatı görün ve Voulamandis House’a talebinizi gönderin.",
    },
  ],
  [
    chiosBeachesPageTr.seo.canonicalPath,
    {
      title: "Sakız Adası plajları | Ulaşım, özellikler ve yerel öneriler",
      description:
        "Mavra Volia, Komi, Lithi, Agia Dynami, Nagos ve diğer Sakız Adası plajlarını konum, ulaşım, deniz yapısı ve olanaklara göre karşılaştırın.",
    },
  ],
  [
    "/tr/sakiz-adasi-koyleri/",
    {
      title: "Sakız Adası köyleri | Orta Çağ, mastik ve sahil rotaları",
      description:
        "Pyrgi, Mesta, Olympoi, Armolia, Vessa, Volissos ve Lagada’yı keşfedin; Orta Çağ sokakları, mastik kültürü, limanlar ve yerel rotalar.",
    },
  ],
  [
    "/tr/sakiz-adasi-muzeleri/",
    {
      title: "Sakız Adası müzeleri | Tarih, kültür ve mastik",
      description:
        "Arkeoloji, Bizans sanatı, denizcilik, nadir kitaplar, folklor ve mastik kültürünü anlatan Sakız Adası müzelerini keşfedin.",
    },
  ],
  [
    "/tr/sakiz-adasi-orta-cag-koyleri/",
    {
      title: "Sakız Adası Orta Çağ köyleri | Mesta, Pyrgi ve Olympoi",
      description:
        "Mesta, Pyrgi, Olympoi, Vessa ve Volissos’un taş sokaklarını, kale dokusunu ve mastik köyü kültürünü keşfedin.",
    },
  ],
  [
    "/tr/cocuklar-icin-sakiz-adasi-plajlari/",
    {
      title: "Çocuklar için Sakız Adası plajları | Aile rehberi",
      description:
        "Komi, Karfas, Lithi ve Agia Dynami gibi aile dostu Sakız Adası plajlarını; kolay ulaşım, sığ su ve yakın yemek seçenekleriyle karşılaştırın.",
    },
  ],
  [
    beachLoversPages.tr.seo.canonicalPath,
    {
      title: "Plaj severler için Sakız Adası | Güney plajları rehberi",
      description:
        "Kambos’ta konaklayın; Mavra Volia, Komi, Agia Fotia, Vroulidia, Salagona ve Kato Fana için yerel bir plaj rotası planlayın.",
    },
  ],
  [
    "/tr/sakiz-adasi-tatil-testi/",
    {
      title: "Sakız Adası tatil testi | Size uygun rotayı bulun",
      description:
        "Sakız Adası tatil testini yapın; size uygun plajları, köyleri ve deneyimleri keşfedin ve konaklamanız için özel indirim kodu alın.",
    },
  ],
]);

const turkishRoomCorrections = new Map<string, DetailCorrection>([
  [
    economyDoubleRoomsTr.seo.canonicalPath,
    {
      title: "Ekonomik çift kişilik oda | Sakız Adası, Kambos",
      description:
        "Kambos’ta iki kişilik ekonomik oda: klima, Wi‑Fi, buzdolabı ve özel banyo ile sade, rahat ve uygun fiyatlı konaklama.",
      heroTitle: "Sakız Adası’nda ekonomik çift kişilik oda",
      heroDescription:
        "Adanın gün boyu keşfi için sakin ve pratik bir üs arayan iki kişi için sade, rahat ve uygun fiyatlı oda seçeneği.",
    },
  ],
  [
    standardDoubleRoomTr.seo.canonicalPath,
    {
      title: "Standart çift ve üç kişilik odalar | Sakız Adası",
      description:
        "Kambos’ta bahçe erişimli zemin kat veya terasa yakın üst kat seçenekleriyle 2–4 kişilik standart çift ve üç kişilik odalar.",
      heroTitle: "Sakız Adası’nda çift ve üç kişilik odalar",
      heroDescription:
        "Çiftler, arkadaşlar ve küçük aileler için bahçe erişimli zemin kat ya da daha aydınlık üst kat seçenekleri sunan rahat odalar.",
    },
  ],
  [
    familyChiosApartmentsTr.seo.canonicalPath,
    {
      title: "Sakız Adası aile daireleri | Mutfak ve geniş alan",
      description:
        "Kambos’ta 40–45 m² aile daireleri: tam mutfak, ayrı yatak odası, oturma alanı ve dört kişiye kadar konaklama.",
      heroTitle: "Sakız Adası’nda mutfaklı aile daireleri",
      heroDescription:
        "Ayrı yatak odası, tam mutfak ve oturma alanıyla aileler ve daha uzun konaklamalar için geniş, bağımsız daireler.",
    },
  ],
]);

const turkishBeachCorrections = new Map<string, DetailCorrection>([
  [
    "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/",
    {
      title: "Agia Dynami Plajı | Turkuaz koy ve ulaşım",
      description:
        "Güney Sakız’daki Agia Dynami Plajı’nı keşfedin: turkuaz su, küçük doğal koy, erişim bilgileri ve sakin bir deniz günü için yerel öneriler.",
      heroTitle: "Agia Dynami Plajı: Güneyde turkuaz bir koy",
      heroDescription:
        "Mastik köylerine yakın, turkuaz renkli berrak suyu ve doğal atmosferiyle güney Sakız’ın küçük ve etkileyici koylarından biri.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
    {
      title: "Agia Fotia Plajı | Berrak su, tavernalar ve ulaşım",
      description:
        "Kambos yakınındaki Agia Fotia Plajı’nı keşfedin: berrak çakıl kıyısı, şezlonglar, kafeler, tavernalar ve kolay ulaşım.",
      heroTitle: "Agia Fotia Plajı: Berrak su ve canlı sahil atmosferi",
      heroDescription:
        "Kambos’a yakın, berrak suyu, çakıl kıyısı, şezlongları, kafeleri ve tavernalarıyla sevilen organize bir plaj.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/avlonia-plaji/",
    {
      title: "Avlonia Plajı | Güney Sakız’da sakin koy",
      description:
        "Pyrgi yakınındaki Avlonia Plajı’nı keşfedin: doğal kıyı, berrak su, sakin atmosfer ve kalabalıktan uzak bir yüzme molası.",
      heroTitle: "Avlonia Plajı: Güney Sakız’da saklı bir koy",
      heroDescription:
        "Pyrgi yakınında, doğal kıyısı ve sakin atmosferiyle daha tenha bir deniz günü arayanlara uygun küçük bir koy.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/kato-fana-plaji/",
    {
      title: "Kato Fana Plajı | Güneyde sakin bir kaçış",
      description:
        "Tarihi Fana bölgesi yakınındaki Kato Fana Plajı’nı keşfedin: açık deniz manzarası, doğal çevre ve huzurlu bir yüzme molası.",
      heroTitle: "Kato Fana Plajı: Güneyde sakin bir kaçış",
      heroDescription:
        "Tarihi Fana bölgesi yakınında, açık ufukları ve doğal çevresiyle sakinlik arayanlara uygun huzurlu bir plaj.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/komi-plaji/",
    {
      title: "Komi Plajı | Kum, sığ su ve restoranlar",
      description:
        "Güneydoğu Sakız’daki Komi Plajı’nı keşfedin: kum, sığ su, şezlonglar, restoranlar, kafeler ve aileler için kolay ulaşım.",
      heroTitle: "Komi Plajı: Kum, sığ su ve yaz atmosferi",
      heroDescription:
        "Sığ suyu, kumlu kıyısı, şezlongları, restoranları ve kolay ulaşımıyla güney Sakız’ın en popüler organize plajlarından biri.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/lefkathia-plaji/",
    {
      title: "Lefkathia Plajı | Volissos yakınında berrak su",
      description:
        "Volissos ve Limnia yakınındaki Lefkathia Plajı’nı keşfedin: berrak su, organize olanaklar, ılgın gölgesi ve güzel gün batımları.",
      heroTitle: "Lefkathia Plajı: Volissos yakınında berrak su",
      heroDescription:
        "Volissos yakınında, berrak suyu, ılgın ağaçları, organize olanakları ve gün batımı manzarasıyla sevilen bir kuzeybatı plajı.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/lithi-plaji/",
    {
      title: "Lithi Plajı | Kum, aileler ve balık tavernaları",
      description:
        "Batı Sakız’daki Lithi Plajı’nı keşfedin: korunaklı kum kıyısı, sığ su, aile dostu atmosfer ve deniz kenarında balık tavernaları.",
      heroTitle: "Lithi Plajı: Kum, sığ su ve balık tavernaları",
      heroDescription:
        "Batı Sakız’da sığ suyu, korunaklı kum kıyısı ve deniz kenarındaki balık tavernalarıyla aileler için rahat bir seçenek.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
    {
      title: "Mavra Volia Plajı | Siyah volkanik çakıllar",
      description:
        "Emporios yakınındaki Mavra Volia’yı keşfedin: siyah volkanik çakıllar, derin mavi su, üç koy ve Sakız Adası’nın en etkileyici kıyı manzaralarından biri.",
      heroTitle: "Mavra Volia: Siyah volkanik çakıllar ve derin mavi su",
      heroDescription:
        "Emporios yakınında siyah volkanik çakılları, derin serin suyu ve vahşi kayalıklarıyla Sakız Adası’nın simge plajı.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/nagos-plaji/",
    {
      title: "Nagos Plajı | Kaynaklar, ağaçlar ve çakıllar",
      description:
        "Kardamyla yakınındaki Nagos Plajı’nı keşfedin: kaynak suları, çınar ağaçları, renkli çakıllar ve kuzey Sakız’ın serin yeşil kıyı manzarası.",
      heroTitle: "Nagos Plajı: Kuzey Sakız’ın yeşil kıyısı",
      heroDescription:
        "Kaynakların, çınar ağaçlarının, renkli çakılların ve berrak denizin buluştuğu Kardamyla yakınında serin ve yeşil bir plaj.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/salagona-plaji/",
    {
      title: "Salagona Plajı | Sakin turkuaz koy",
      description:
        "Güneybatı Sakız’daki Salagona’yı keşfedin: turkuaz su, ince çakıllar, doğal çevre ve Orta Çağ köylerine yakın sakin bir koy.",
      heroTitle: "Salagona Plajı: Saklı turkuaz koy",
      heroDescription:
        "Güneybatı Sakız’da turkuaz suyu, ince çakılları ve doğal çevresiyle sakin yüzme ve şnorkel için güzel bir koy.",
    },
  ],
  [
    "/tr/sakiz-adasi-plajlari/vroulidia-plaji/",
    {
      title: "Vroulidia Plajı | Güneyde küçük turkuaz koy",
      description:
        "Emporios yakınındaki Vroulidia Plajı’nı keşfedin: turkuaz su, açık deniz manzarası ve sakin yüzme için doğal küçük bir koy.",
      heroTitle: "Vroulidia Plajı: Güneyde küçük turkuaz koy",
      heroDescription:
        "Emporios yakınında turkuaz suyu, açık deniz manzarası ve sakin atmosferiyle doğal küçük bir güney plajı.",
    },
  ],
]);

const turkishVillageCorrections: ReadonlyArray<
  readonly [string, DetailCorrection]
> = [
  [
    "pyrgi",
    {
      title: "Pyrgi, Sakız Adası | Xysta desenleri ve Orta Çağ sokakları",
      description:
        "Pyrgi’yi keşfedin: siyah-beyaz xysta desenli cepheler, dar Orta Çağ sokakları, canlı köy meydanı ve mastik kültürü.",
      heroTitle: "Pyrgi: Xysta desenleriyle Sakız’ın boyalı köyü",
      heroDescription:
        "Siyah-beyaz xysta desenli evleri, dar Orta Çağ sokakları ve güçlü mastik geleneğiyle Sakız Adası’nın en özgün köylerinden biri.",
    },
  ],
  [
    "mesta",
    {
      title: "Mesta, Sakız Adası | Orta Çağ kale köyü",
      description:
        "Mesta’yı keşfedin: taş sokakları, kemerli geçitleri ve kapalı kale düzeniyle Sakız Adası’nın en iyi korunmuş Orta Çağ köylerinden biri.",
      heroTitle: "Mesta: Taş sokaklı Orta Çağ kale köyü",
      heroDescription:
        "Dar taş sokakları, kemerleri ve kapalı savunma düzeniyle Sakız Adası’nın en etkileyici ve iyi korunmuş Orta Çağ köylerinden biri.",
    },
  ],
  [
    "olympoi",
    {
      title: "Olympoi, Sakız Adası | Mesta yakınında mastik köyü",
      description:
        "Olympoi’yi keşfedin: surlu dokusu, taş sokakları, geleneksel mimarisi ve Mesta’ya uzanan rotasıyla sakin bir Orta Çağ mastik köyü.",
      heroTitle: "Olympoi: Sakin Orta Çağ mastik köyü",
      heroDescription:
        "Geleneksel taş mimarisi, dar sokakları ve Mesta’ya yakınlığıyla güney Sakız’da sakin ve otantik bir mastik köyü.",
    },
  ],
  [
    "armolia",
    {
      title: "Armolia, Sakız Adası | Seramik ve yerel zanaat",
      description:
        "Armolia’yı keşfedin: seramik atölyeleri, el yapımı çömlekler, yerel dükkânlar ve mastik köyleri rotasındaki elverişli konumu.",
      heroTitle: "Armolia: Seramik ve yerel zanaat köyü",
      heroDescription:
        "Seramik geleneği, çömlek atölyeleri ve mastik köyleri rotasındaki konumuyla güney Sakız’ın zanaat köyü.",
    },
  ],
  [
    "lagada",
    {
      title: "Lagada, Sakız Adası | Liman ve balık tavernaları",
      description:
        "Lagada’yı keşfedin: küçük liman, balıkçı tekneleri, deniz manzarası ve su kenarında balık tavernalarıyla rahat bir sahil köyü.",
      heroTitle: "Lagada: Liman ve balık tavernaları",
      heroDescription:
        "Küçük limanı, balıkçı tekneleri ve deniz kenarındaki tavernalarıyla sakin bir yürüyüş ve yemek için keyifli bir sahil köyü.",
    },
  ],
  [
    "vessa",
    {
      title: "Vessa, Sakız Adası | Sakin Orta Çağ mastik köyü",
      description:
        "Vessa’yı keşfedin: taş sokakları, geleneksel mimarisi, otantik atmosferi ve Lithi rotasına yakınlığıyla sakin bir mastik köyü.",
      heroTitle: "Vessa: Sakin Orta Çağ mastik köyü",
      heroDescription:
        "Dar taş sokakları, geleneksel mimarisi ve yavaş yerel ritmiyle güney Sakız’da huzurlu bir mastik köyü.",
    },
  ],
  [
    "volissos",
    {
      title: "Volissos, Sakız Adası | Kale, Amani ve kuzeybatı",
      description:
        "Volissos’u keşfedin: kale, geleneksel sokaklar, Amani manzaraları ve kuzeybatı Sakız plajlarına kolay ulaşım.",
      heroTitle: "Volissos: Kale, Amani ve kuzeybatı Sakız",
      heroDescription:
        "Kalesi, geleneksel sokakları, Amani manzarası ve kuzey plajlarına bağlantısıyla kuzeybatı Sakız’ın başlıca köyü.",
    },
  ],
];

const turkishMuseumCorrections: ReadonlyArray<
  readonly [string, MuseumCorrection]
> = [
  [
    "mastik",
    {
      title: "Sakız Mastik Müzesi | Üretim, tarih ve kültür",
      description:
        "Sakız Mastik Müzesi’ni ziyaret edin; mastik ağacını, yetiştirme, hasat ve işleme süreçlerini ve güney köylerinin kültürünü keşfedin.",
      heroTitle: "Sakız Mastik Müzesi",
      heroDescription:
        "Mastiğin yetiştirilmesini, hasadını, işlenmesini ve güney Sakız köylerinin yaşamındaki kültürel önemini anlatan kapsamlı bir müze.",
      details: [
        {
          icon: "📍",
          title: "Konum ve ulaşım",
          text: "Müze güney Sakız’da mastik köyleri bölgesindedir; Pyrgi, Mesta ve Olympoi ile aynı günlük rotada kolayca ziyaret edilebilir.",
        },
        {
          icon: "🌿",
          title: "Müzenin konusu",
          text: "Sergiler mastik ağacını, toprağın hazırlanmasını, hasadı, temizleme ve işleme aşamalarını, ticareti ve yerel ekonomiyi açıklar.",
        },
        {
          icon: "💡",
          title: "Yerel öneri",
          text: "Mastik köylerini gezmeden önce müzeyi ziyaret edin; böylece bölgenin peyzajını, mimarisini ve günlük yaşamını daha iyi anlayabilirsiniz.",
        },
      ],
      highlights: {
        title: "Mastik Müzesinde neler görebilirsiniz?",
        items: [
          "Mastik ağacının yetiştirilmesi ve hasadı",
          "Temizleme, işleme ve üretim araçları",
          "Mastiğin ticari ve kültürel tarihi",
          "Mastik ile güney Sakız köyleri arasındaki bağ",
        ],
      },
      experience: {
        title: "Mastik Müzesi neden ziyaret edilmeli?",
        paragraphs: [
          "Mastik yalnızca yerel bir ürün değildir; güney Sakız’ın köylerini, çalışma düzenini, ticaretini ve kimliğini biçimlendirmiştir.",
          "Müze, Pyrgi, Mesta veya Olympoi ziyaretinden önce bölgeyi anlamak için en yararlı kültür duraklarından biridir.",
        ],
      },
    },
  ],
  [
    "arkeoloji",
    {
      title: "Sakız Arkeoloji Müzesi | Antik tarih ve eserler",
      description:
        "Sakız Arkeoloji Müzesi’ni ziyaret edin; adanın antik tarihini anlatan seramik, heykel, takı ve arkeolojik buluntuları keşfedin.",
      heroTitle: "Sakız Arkeoloji Müzesi",
      heroDescription:
        "Seramikler, heykeller, takılar ve çeşitli arkeolojik buluntularla Sakız Adası’nın antik dönemlerini anlatan önemli bir şehir müzesi.",
      details: [
        {
          icon: "📍",
          title: "Konum ve ulaşım",
          text: "Müze Sakız şehrindedir ve liman, Bizans Müzesi, Korais Kütüphanesi ve şehir merkezindeki diğer duraklarla birleştirilebilir.",
        },
        {
          icon: "🏺",
          title: "Müzenin konusu",
          text: "Koleksiyonlar antik Sakız’a ait seramikler, heykeller, figürinler, takılar ve farklı kazılardan arkeolojik eserler içerir.",
        },
        {
          icon: "💡",
          title: "Yerel öneri",
          text: "Adayı gezmeden önce ziyaret ederek Sakız’ın antik ticaret, sanat ve Ege dünyasındaki yeri hakkında temel bir çerçeve edinin.",
        },
      ],
      highlights: {
        title: "Arkeoloji Müzesinde neler görebilirsiniz?",
        items: [
          "Antik seramikler ve günlük kullanım eşyaları",
          "Heykeller, figürinler ve takılar",
          "Sakız Adası kazılarından buluntular",
          "Adanın antik Ege dünyasıyla bağlantıları",
        ],
      },
      experience: {
        title: "Arkeoloji Müzesi neden ziyaret edilmeli?",
        paragraphs: [
          "Müze, Sakız Adası’nın plajlar ve köylerden çok daha eskiye uzanan tarihini anlaşılır bir bütün içinde sunar.",
          "Şehir merkezinde kültür ağırlıklı yarım günlük bir rota için Bizans Müzesi ve Korais Kütüphanesiyle iyi bir başlangıçtır.",
        ],
      },
    },
  ],
  [
    "bizans",
    {
      title: "Sakız Bizans Müzesi | İkonalar ve Bizans sanatı",
      description:
        "Sakız Bizans Müzesi’ni ziyaret edin; Bizans ve Bizans sonrası ikonaları, freskleri ve adanın dini sanat mirasını keşfedin.",
      heroTitle: "Sakız Bizans Müzesi",
      heroDescription:
        "İkonalar, freskler ve dini eserlerle Sakız Adası’nın Bizans ve Bizans sonrası sanatını anlatan şehir merkezindeki kültür durağı.",
      details: [
        {
          icon: "📍",
          title: "Konum ve ulaşım",
          text: "Bizans Müzesi Sakız şehrindedir ve merkezde yürüyüş, Arkeoloji Müzesi ve Korais Kütüphanesiyle kolayca birleştirilebilir.",
        },
        {
          icon: "🖼️",
          title: "Müzenin konusu",
          text: "Sergiler Bizans ve Bizans sonrası ikonaları, freskleri, dini sanat eserlerini ve adanın tarihsel katmanlarını tanıtır.",
        },
        {
          icon: "💡",
          title: "Yerel öneri",
          text: "Farklı tarih dönemlerini aynı gün görmek için ziyareti Arkeoloji Müzesi ve Korais Kütüphanesiyle planlayın.",
        },
      ],
      highlights: {
        title: "Bizans Müzesinde neler görebilirsiniz?",
        items: [
          "Bizans ve Bizans sonrası ikonalar",
          "Freskler ve dini sanat eserleri",
          "Sakız’ın manevi ve sanatsal mirası",
          "Adanın farklı tarih dönemlerinden kültürel katmanlar",
        ],
      },
      experience: {
        title: "Bizans Müzesi neden ziyaret edilmeli?",
        paragraphs: [
          "Müze, Sakız şehrindeki bir geziye adanın dini sanatı ve Bizans dönemleri üzerinden daha derin bir tarih perspektifi kazandırır.",
          "İkonalara, kiliselere ve tarihî mimariye ilgi duyan ziyaretçiler için özellikle anlamlı bir duraktır.",
        ],
      },
    },
  ],
  [
    "korais",
    {
      title: "Korais Kütüphanesi | Nadir kitaplar ve el yazmaları",
      description:
        "Korais Kütüphanesi’ni ziyaret edin; nadir kitapları, el yazmalarını, arşivleri ve Yunan düşünce tarihine ait koleksiyonları keşfedin.",
      heroTitle: "Korais Kütüphanesi",
      heroDescription:
        "Nadir kitapları, el yazmaları, arşivleri ve Adamantios Korais mirasıyla Sakız şehrinin en önemli kültür kurumlarından biri.",
      details: [
        {
          icon: "📍",
          title: "Konum ve ulaşım",
          text: "Kütüphane Sakız şehir merkezindedir; Arkeoloji ve Bizans müzeleriyle birlikte yürüyüş rotasına eklenebilir.",
        },
        {
          icon: "📚",
          title: "Koleksiyonlar",
          text: "Nadir basımlar, el yazmaları, tarihî arşivler ve Adamantios Korais ile Yunan düşünce tarihine bağlı koleksiyonlar sunar.",
        },
        {
          icon: "💡",
          title: "Yerel öneri",
          text: "Ziyaret saatlerini önceden kontrol edin ve kitapların yanı sıra binadaki tarihî koleksiyonlara da zaman ayırın.",
        },
      ],
      highlights: {
        title: "Korais Kütüphanesinde neler görebilirsiniz?",
        items: [
          "Nadir kitaplar ve tarihî basımlar",
          "El yazmaları ve arşiv belgeleri",
          "Adamantios Korais ile ilgili koleksiyonlar",
          "Yunan edebiyatı ve düşünce tarihine ait eserler",
        ],
      },
      experience: {
        title: "Korais Kütüphanesi neden ziyaret edilmeli?",
        paragraphs: [
          "Korais Kütüphanesi, Sakız Adası’nın eğitim, edebiyat ve düşünce tarihindeki güçlü yerini gösterir.",
          "Şehir merkezindeki müzelerle birlikte ziyaret edildiğinde adanın kültürel kimliğine çok yönlü bir bakış sunar.",
        ],
      },
    },
  ],
  [
    "denizcilik",
    {
      title: "Sakız Denizcilik Müzesi | Denizcilik tarihi",
      description:
        "Sakız Denizcilik Müzesi’ni ziyaret edin; gemi modelleri, navigasyon, ticaret ve adanın güçlü denizcilik geleneğini keşfedin.",
      heroTitle: "Sakız Denizcilik Müzesi",
      heroDescription:
        "Gemi modelleri, denizcilik araçları ve arşivlerle Sakız Adası’nın gemicilik, navigasyon ve ticaret tarihini anlatan müze.",
      details: [
        {
          icon: "📍",
          title: "Konum ve ulaşım",
          text: "Müze Sakız şehrindedir ve liman çevresi, Korais Kütüphanesi ve diğer şehir müzeleriyle aynı rotaya eklenebilir.",
        },
        {
          icon: "⚓",
          title: "Müzenin konusu",
          text: "Gemi modelleri, denizcilik araçları, fotoğraflar ve arşivler adanın gemicilik, navigasyon ve ticaret mirasını anlatır.",
        },
        {
          icon: "💡",
          title: "Yerel öneri",
          text: "Ziyareti liman çevresinde bir yürüyüşle birleştirerek Sakız’ın denizle kurduğu ilişkinin bugünkü izlerini de görün.",
        },
      ],
      highlights: {
        title: "Denizcilik Müzesinde neler görebilirsiniz?",
        items: [
          "Gemi modelleri ve denizcilik araçları",
          "Navigasyon ve ticaret tarihi",
          "Denizci ailelere ait fotoğraf ve arşivler",
          "Sakız Adası’nın Ege denizcilik geleneği",
        ],
      },
      experience: {
        title: "Denizcilik Müzesi neden ziyaret edilmeli?",
        paragraphs: [
          "Sakız Adası’nın kimliği yüzyıllardır denizcilik, gemicilik ve ticaretle bağlantılıdır; müze bu hikâyeyi somut eserlerle anlatır.",
          "Liman ve şehir merkezindeki diğer kültür duraklarıyla kolayca birleştirilebilen anlamlı bir ziyarettir.",
        ],
      },
    },
  ],
  [
    "folklor",
    {
      title: "Kallimasia Folklor Müzesi | Sakız’da günlük yaşam",
      description:
        "Kallimasia Folklor Müzesi’ni ziyaret edin; geleneksel araçları, kıyafetleri, meslekleri ve Sakız köylerindeki eski günlük yaşamı keşfedin.",
      heroTitle: "Kallimasia Folklor Müzesi",
      heroDescription:
        "Geleneksel araçlar, kıyafetler ve gündelik eşyalarla Sakız köylerinin eski yaşamını ve yerel hafızasını anlatan folklor müzesi.",
      details: [
        {
          icon: "📍",
          title: "Konum ve ulaşım",
          text: "Müze Kallimasia köyündedir ve doğu ile güney Sakız rotalarına, yakın köylere ve plajlara eklenebilir.",
        },
        {
          icon: "🧺",
          title: "Müzenin konusu",
          text: "Koleksiyonlar eski günlük yaşamı, yerel meslekleri, tarım araçlarını, kıyafetleri ve köy geleneklerini tanıtır.",
        },
        {
          icon: "💡",
          title: "Yerel öneri",
          text: "Ünlü anıtların ötesinde Sakız halkının gündelik hayatını anlamak için ziyarete yeterli zaman ayırın.",
        },
      ],
      highlights: {
        title: "Folklor Müzesinde neler görebilirsiniz?",
        items: [
          "Geleneksel araçlar ve ev eşyaları",
          "Yerel meslekler ve tarım yaşamı",
          "Kıyafetler, gelenekler ve köy hafızası",
          "Sakız köylerinde eski günlük yaşam",
        ],
      },
      experience: {
        title: "Folklor Müzesi neden ziyaret edilmeli?",
        paragraphs: [
          "Kallimasia Folklor Müzesi, adanın tarihini krallar ve anıtlar yerine sıradan insanların işi, evi ve gelenekleri üzerinden anlatır.",
          "Köy yaşamına ve yerel kültüre ilgi duyan ziyaretçiler için samimi ve öğretici bir duraktır.",
        ],
      },
    },
  ],
];

const turkishRoomDescriptions = new Map<string, string>([
  [
    "room-1",
    "Oda 1 üst katta yer alır ve iki ayrı uyku alanıyla dört kişiye kadar konaklama sunar.",
  ],
  [
    "room-2",
    "Oda 2 üst katta yer alır ve Kambos narenciye bahçelerine bakan ortak terasa erişim sunar.",
  ],
  [
    "room-3",
    "Oda 3, küçük mutfak ve merdiven erişimi olan üst kat çift veya üç kişilik odadır.",
  ],
  [
    "room-4",
    "Oda 4, küçük mutfak, çekyat ve üst kat manzarası sunan çift veya üç kişilik odadır.",
  ],
  [
    "room-5",
    "Oda 5, avlu ve bahçeye doğrudan erişimi olan zemin kat çift veya üç kişilik odadır.",
  ],
  [
    "room-6",
    "Oda 6 zemin kattadır ve sakin avlu ile bahçeye doğrudan açılır.",
  ],
  [
    "room-7",
    "Oda 7, bahçe erişimi ve çekyatlı zemin kat çift veya üç kişilik odadır.",
  ],
  [
    "apartment-8",
    "Daire 8, mutfaklı oturma alanı, ayrı yatak odası ve banyoya sahiptir; dört kişiye kadar uygundur.",
  ],
  [
    "apartment-9",
    "Daire 9, mutfak, oturma alanı, yatak odası ve banyodan oluşan aile dostu bir düzene sahiptir.",
  ],
  [
    "apartment-10",
    "Daire 10, mutfaklı oturma alanı, yatak odası ve çekyatlı esnek yerleşim sunar.",
  ],
]);

function normalizeTurkishTags(tags: string[]): string[] {
  return tags.map((tag) => tag.replace(/^#/, "").replaceAll("_", " ").trim());
}

function applySeoCorrection(path: string, correction: SeoCorrection): void {
  seoSnippetOverrides.set(path, {
    title: correction.title,
    description: correction.description,
  });
}

function updateDetailContent(
  detail: BeachDetailData | VillageDetailData,
  correction: DetailCorrection,
): void {
  Object.assign(detail.seo, {
    title: correction.title,
    description: correction.description,
  });
  Object.assign(detail.hero, {
    title: correction.heroTitle,
    description: correction.heroDescription,
    tags: normalizeTurkishTags(detail.hero.tags),
  });
  applySeoCorrection(detail.seo.canonicalPath, correction);
}

function updateTurkishRoom(data: RoomDetailData): void {
  const correction = turkishRoomCorrections.get(data.seo.canonicalPath);
  if (!correction) return;

  Object.assign(data.seo, {
    title: correction.title,
    description: correction.description,
  });
  Object.assign(data.hero, {
    title: correction.heroTitle,
    description: correction.heroDescription,
  });

  data.individualRooms = {
    ...data.individualRooms,
    rooms: data.individualRooms.rooms.map((room) => ({
      ...room,
      description: turkishRoomDescriptions.get(room.id) ?? room.description,
    })),
  };

  applySeoCorrection(data.seo.canonicalPath, correction);
}

function findVillageCorrection(path: string): DetailCorrection | undefined {
  return turkishVillageCorrections.find(([fragment]) => path.includes(fragment))?.[1];
}

function findMuseumCorrection(path: string): MuseumCorrection | undefined {
  return turkishMuseumCorrections.find(([fragment]) => path.includes(fragment))?.[1];
}

function updateTurkishMuseum(museum: MuseumDetailData): void {
  const correction = findMuseumCorrection(museum.seo.canonicalPath);
  if (!correction) return;

  Object.assign(museum.seo, {
    title: correction.title,
    description: correction.description,
  });
  Object.assign(museum.hero, {
    title: correction.heroTitle,
    description: correction.heroDescription,
    tags: normalizeTurkishTags(museum.hero.tags),
  });
  museum.details = correction.details;
  museum.highlights = correction.highlights;
  museum.experience = correction.experience;
  applySeoCorrection(museum.seo.canonicalPath, correction);
}

export function applyTurkishSeoCorrections(): void {
  for (const [path, correction] of turkishPageSeoCorrections) {
    applySeoCorrection(path, correction);
  }

  Object.assign(roomsCategoryTr.seo, turkishPageSeoCorrections.get(roomsCategoryTr.seo.canonicalPath));
  Object.assign(contactPageTr.seo, turkishPageSeoCorrections.get(contactPageTr.seo.canonicalPath));
  Object.assign(ratesPageTr.seo, turkishPageSeoCorrections.get(ratesPageTr.seo.canonicalPath));
  Object.assign(chiosBeachesPageTr.seo, turkishPageSeoCorrections.get(chiosBeachesPageTr.seo.canonicalPath));
  Object.assign(beachLoversPages.tr.seo, turkishPageSeoCorrections.get(beachLoversPages.tr.seo.canonicalPath));

  updateTurkishRoom(economyDoubleRoomsTr);
  updateTurkishRoom(standardDoubleRoomTr);
  updateTurkishRoom(familyChiosApartmentsTr);

  for (const beach of localizedBeachDetails) {
    if (!beach.seo.canonicalPath.startsWith("/tr/")) continue;
    const correction = turkishBeachCorrections.get(beach.seo.canonicalPath);
    if (correction) {
      updateDetailContent(beach, correction);
    } else {
      beach.hero.tags = normalizeTurkishTags(beach.hero.tags);
    }
  }

  for (const village of localizedVillageDetails) {
    if (!village.seo.canonicalPath.startsWith("/tr/")) continue;
    const correction = findVillageCorrection(village.seo.canonicalPath);
    if (correction) {
      updateDetailContent(village, correction);
    } else {
      village.hero.tags = normalizeTurkishTags(village.hero.tags);
    }
  }

  for (const museum of localizedMuseumDetails) {
    if (!museum.seo.canonicalPath.startsWith("/tr/")) continue;
    updateTurkishMuseum(museum);
  }
}