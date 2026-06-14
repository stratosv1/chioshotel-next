import type { NextConfig } from "next";

const legacyRedirects = [
  {
    source: "/el/chios-el/chios-villages-el/chios-armolia-village",
    destination: "/el/xoria-xios/armolia-xios/",
    permanent: true,
  },
    {
        "source": "/el/kalyteres-paralies-xiou",
        "destination": "/el/paralies-xios/",
        "permanent": true
    },{
        "source": "/el/exerevnisi-chiou",
        "destination": "/el/exerevnisi-xiou/",
        "permanent": true
    },{
        "source": "/it/esplorare-chio",
        "destination": "/it/esplora-chios/",
        "permanent": true
    },
    {
        "source": "/it/esplorare-chio/",
        "destination": "/it/esplora-chios/",
        "permanent": true
    },
{
        "source":  "/it/stanze-a-chios",
        "destination":  "/it/camere-a-chios",
        "permanent":  true
    },
    {
        "source":  "/tr/chiosta-odalar",
        "destination":  "/tr/sakiz-adasi-odalari",
        "permanent":  true
    },
    {
        "source":  "/es/habitaciones-en-chios/habitaciones-dobles-en-la-isla-de-chios",
        "destination":  "/es/habitaciones-en-chios/habitaciones-dobles-estandar",
        "permanent":  true
    },
    {
        "source":  "/tr/chios-odalari/standart-cift-kisilik-odalar-sakiz-adasi",
        "destination":  "/tr/chios-odalari/standart-cift-kisilik-odalar",
        "permanent":  true
    },
    {
        "source":  "/el/vre-to-domatio-pou-sou-tairiazei",
        "destination":  "/el/vres-to-domatio-sou",
        "permanent":  true
    },
    {
        "source":  "/el/voulamandis-room-finder-gr",
        "destination":  "/el/vres-to-domatio-sou",
        "permanent":  true
    },
    {
        "source":  "/it/trova-la-stanza-che-fa-per-te",
        "destination":  "/it/trova-la-tua-camera",
        "permanent":  true
    },
    {
        "source":  "/de/zimmer-suchassistent",
        "destination":  "/de/finde-dein-zimmer",
        "permanent":  true
    },
    {
        "source":  "/tr/en-uygun-oda",
        "destination":  "/tr/odani-bul",
        "permanent":  true
    },
    {
        "source":  "/mike-2",
        "destination":  "/find-your-room",
        "permanent":  true
    },
    {
        "source":  "/es/mike",
        "destination":  "/es/encuentra-tu-habitacion",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/paralies-chios",
        "destination":  "/el/paralies-xios",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/les-plages-de-chios",
        "destination":  "/fr/plages-de-chios",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/die-beste-10-chios-strande",
        "destination":  "/de/straende-chios",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiagge-di-chios",
        "destination":  "/it/spiagge-chios",
        "permanent":  true
    },
    {
        "source":  "/es/habitaciones-en-chios/playas-de-chios-2",
        "destination":  "/es/playas-chios",
        "permanent":  true
    },
    {
        "source":  "/tr/chios-odalari/sakiz-adasi-plajlari",
        "destination":  "/tr/sakiz-adasi-plajlari",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-beaches/agia-dynami-beach",
        "destination":  "/chios/chios-beaches/agia-dynami-beach-chios",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-beaches/avlonia-beach",
        "destination":  "/chios/chios-beaches/avlonia-beach2",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-beaches/mavra-volia",
        "destination":  "/chios/chios-beaches/emporios-beach",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/agia-dynami-beach-2",
        "destination":  "/el/paralies-xios/paralia-agia-dynami",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/chios-beach-agia-fotia",
        "destination":  "/el/paralies-xios/paralia-agia-fotia",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/komi-beach-2",
        "destination":  "/el/paralies-xios/paralia-komi",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/chios-beach-salagona",
        "destination":  "/el/paralies-xios/paralia-salagona",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/mavra-volia-2",
        "destination":  "/el/paralies-xios/paralia-mavra-volia",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/chios-beach-nagos",
        "destination":  "/el/paralies-xios/paralia-nagos",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/avlonia",
        "destination":  "/el/paralies-xios/paralia-avlonia",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/chios-beach-lithi",
        "destination":  "/el/paralies-xios/paralia-lithi",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-beaches-el/paralia-xios-lefkathia",
        "destination":  "/el/paralies-xios/paralia-lefkathia",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-dagia-dynami-chios",
        "destination":  "/fr/plages-de-chios/plage-agia-dynami",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-dagia-fotia-chios",
        "destination":  "/fr/plages-de-chios/plage-agia-fotia",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-de-komi-chios",
        "destination":  "/fr/plages-de-chios/plage-komi",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-de-salagona-chios",
        "destination":  "/fr/plages-de-chios/plage-salagona",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-demporios-chios",
        "destination":  "/fr/plages-de-chios/plage-mavra-volia",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-de-nagos-chios",
        "destination":  "/fr/plages-de-chios/plage-nagos",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-davlonia-chios",
        "destination":  "/fr/plages-de-chios/plage-avlonia",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/les-plages-de-chios/plage-de-lithi-chios",
        "destination":  "/fr/plages-de-chios/plage-lithi",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/plage-de-lefkathia-chios",
        "destination":  "/fr/plages-de-chios/plage-lefkathia",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/straende-chios/agia-dynami-strand",
        "destination":  "/de/straende-chios/agia-dynami-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/straende-chios/agia-fotia-strand",
        "destination":  "/de/straende-chios/agia-fotia-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/komi-strand",
        "destination":  "/de/straende-chios/komi-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/salagona-strand",
        "destination":  "/de/straende-chios/salagona-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/emporios-strand",
        "destination":  "/de/straende-chios/mavra-volia-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/nagos-strand",
        "destination":  "/de/straende-chios/nagos-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/straende-chios/avlonia-strand",
        "destination":  "/de/straende-chios/avlonia-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/lithi-strand",
        "destination":  "/de/straende-chios/lithi-strand",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/lefkathia-strand",
        "destination":  "/de/straende-chios/lefkathia-strand",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-agia-dynami-chios",
        "destination":  "/it/spiagge-chios/spiaggia-agia-dynami",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-di-agia-fotia-a-chios-mare-limpido-e-atmosfera-vivace-vicino-alla-citta",
        "destination":  "/it/spiagge-chios/spiaggia-agia-fotia",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-komi-chios",
        "destination":  "/it/spiagge-chios/spiaggia-komi",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-salagona-chios",
        "destination":  "/it/spiagge-chios/spiaggia-salagona",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-emporios-chios",
        "destination":  "/it/spiagge-chios/spiaggia-mavra-volia",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-nagos-chios",
        "destination":  "/it/spiagge-chios/spiaggia-nagos",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-avlonia-chios",
        "destination":  "/it/spiagge-chios/spiaggia-avlonia",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/lithi-beach-un-rifugio-sereno-di-sabbia-morbida-e-acque-cristalline",
        "destination":  "/it/spiagge-chios/spiaggia-lithi",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-di-lithi-un-rifugio-sereno-di-sabbia-morbida-e-acque-cristalline",
        "destination":  "/it/spiagge-chios/spiaggia-lithi",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/spiaggia-lefkathia-chios",
        "destination":  "/it/spiagge-chios/spiaggia-lefkathia",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-agia-dynami-el-tesoro-escondido-de-la-isla-de-quios",
        "destination":  "/es/playas-chios/playa-agia-dynami",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-agia-fotia-la-fascinante-playa-de-quios",
        "destination":  "/es/playas-chios/playa-agia-fotia",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-komi-un-oasis-de-arena-con-bares-de-playa-y-restaurantes",
        "destination":  "/es/playas-chios/playa-komi",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-salagona-explora-esta-belleza-cerca-del-pueblo-de-olympi",
        "destination":  "/es/playas-chios/playa-salagona",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-emporios-la-belleza-de-la-majestuosa-playa-de-piedras-negras",
        "destination":  "/es/playas-chios/playa-mavra-volia",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-nagos-descubre-la-serena-belleza-del-noreste-de-quios",
        "destination":  "/es/playas-chios/playa-nagos",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-avlonia-descubre-su-serena-belleza",
        "destination":  "/es/playas-chios/playa-avlonia",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-lithi-un-refugio-sereno-de-arena-fina-y-aguas-cristalinas",
        "destination":  "/es/playas-chios/playa-lithi",
        "permanent":  true
    },
    {
        "source":  "/es/playas-de-chios/playa-de-lefkathia-descubre-la-magia-de-una-joya-oculta",
        "destination":  "/es/playas-chios/playa-lefkathia",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/agia-dynami-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/agia-dynami-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/agia-fotia-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/agia-fotia-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/komi-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/komi-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/salagona-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/salagona-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/mavra-volia-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/mavra-volia-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/nagos-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/nagos-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/avlonia-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/avlonia-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/lithi-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/lithi-plaji",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-plajlari/lefkathia-plaji-sakiz-adasi",
        "destination":  "/tr/sakiz-adasi-plajlari/lefkathia-plaji",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/ta-10-top-xoria-xios",
        "destination":  "/el/xoria-xios",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/les-villages-de-chios",
        "destination":  "/fr/villages-de-chios",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/dorfer-von-chios",
        "destination":  "/de/doerfer-chios",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/di-villaggi-di-chios",
        "destination":  "/it/villaggi-chios",
        "permanent":  true
    },
    {
        "source":  "/es/habitaciones-en-chios/pueblos-de-chios",
        "destination":  "/es/pueblos-chios",
        "permanent":  true
    },
    {
        "source":  "/tr/chios-odalari/sakiz-adasi-koylerini",
        "destination":  "/tr/sakiz-adasi-koyleri",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-villages/olympi-chios",
        "destination":  "/chios/chios-villages/olympoi-chios",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-villages/lagada-chios-2",
        "destination":  "/chios/chios-villages/lagada-chios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-villages-el/chios-pyrgi-village",
        "destination":  "/el/xoria-xios/pyrgi-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-villages-el/chios-mesta-village",
        "destination":  "/el/xoria-xios/mesta-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-villages-el/chios-vessa-village",
        "destination":  "/el/xoria-xios/vessa-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-villages-el/chios-olympoi-village",
        "destination":  "/el/xoria-xios/olympoi-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-villages-el/chios-volissos",
        "destination":  "/el/xoria-xios/volissos-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-villages-el/lagada-chios",
        "destination":  "/el/xoria-xios/lagada-xios",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/fr-pyrgi-chios",
        "destination":  "/fr/villages-de-chios/village-pyrgi",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/mesta-chios-3",
        "destination":  "/fr/villages-de-chios/village-mesta",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/vessa-chios-3",
        "destination":  "/fr/villages-de-chios/village-vessa",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/village-dolympi-chios",
        "destination":  "/fr/villages-de-chios/village-olympoi",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/fr-chios-villages-de-chios-volissos-chios",
        "destination":  "/fr/villages-de-chios/village-volissos",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/village-darmolia-chios",
        "destination":  "/fr/villages-de-chios/village-armolia",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/fr-chios-villages-de-chios-lagada-chios",
        "destination":  "/fr/villages-de-chios/village-lagada",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/pyrgi-chios",
        "destination":  "/de/doerfer-chios/pyrgi-dorf",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/mesta-chios-2",
        "destination":  "/de/doerfer-chios/mesta-dorf",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/vessa-chios-2",
        "destination":  "/de/doerfer-chios/vessa-dorf",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/olympi-chios-2",
        "destination":  "/de/doerfer-chios/olympoi-dorf",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/volissos-chios-2",
        "destination":  "/de/doerfer-chios/volissos-dorf",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/armolia-chios-2",
        "destination":  "/de/doerfer-chios/armolia-dorf",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/doerfer-von-chios/lagada-chios-3",
        "destination":  "/de/doerfer-chios/lagada-dorf",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/pyrgi-chios-villaggio",
        "destination":  "/it/villaggi-chios/villaggio-pyrgi",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/mesta-chios-villaggio",
        "destination":  "/it/villaggi-chios/villaggio-mesta",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/vessa-chios-villaggio",
        "destination":  "/it/villaggi-chios/villaggio-vessa",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/olympi-chios-villaggio",
        "destination":  "/it/villaggi-chios/villaggio-olympoi",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/volissos-chios-villaggio",
        "destination":  "/it/villaggi-chios/villaggio-volissos",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/armolia-chios-ceramica",
        "destination":  "/it/villaggi-chios/villaggio-armolia",
        "permanent":  true
    },
    {
        "source":  "/it/villaggi-di-chios/lagada-chios-villaggio-con-taverne-di-pesce",
        "destination":  "/it/villaggi-chios/villaggio-lagada",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/pueblo-de-pyrgi-quios-vive-su-singular-estilo-arquitectonico",
        "destination":  "/es/pueblos-chios/pueblo-pyrgi",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/mesta-quios-explora-el-encantador-pueblo-medieval",
        "destination":  "/es/pueblos-chios/pueblo-mesta",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/vessa-quios-explora-el-cautivador-pueblo-de-encanto-e-historia-medieval",
        "destination":  "/es/pueblos-chios/pueblo-vessa",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/olympi-quios",
        "destination":  "/es/pueblos-chios/pueblo-olympoi",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/pueblo-de-volissos-quios-descubre-la-magia-de-quios",
        "destination":  "/es/pueblos-chios/pueblo-volissos",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/pueblo-de-armolia-en-quios-el-principal-taller-de-artesania-en-ceramica-de-quios",
        "destination":  "/es/pueblos-chios/pueblo-armolia",
        "permanent":  true
    },
    {
        "source":  "/es/pueblos-de-chios/lagada-quios-un-pueblo-pintoresco-con-tabernas-de-pescado",
        "destination":  "/es/pueblos-chios/pueblo-lagada",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/pyrgi-sakiz-adasi-koyu",
        "destination":  "/tr/sakiz-adasi-koyleri/pyrgi-koyu",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/mesta-koyu-chios",
        "destination":  "/tr/sakiz-adasi-koyleri/mesta-koyu",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/vessa-koyu-chios",
        "destination":  "/tr/sakiz-adasi-koyleri/vessa-koyu",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/olympoi-koyu-chios",
        "destination":  "/tr/sakiz-adasi-koyleri/olympoi-koyu",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/volissos-koyu-chios",
        "destination":  "/tr/sakiz-adasi-koyleri/volissos-koyu",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/armolia-koyu-chios",
        "destination":  "/tr/sakiz-adasi-koyleri/armolia-koyu",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-koyleri/lagada-koyu-chios",
        "destination":  "/tr/sakiz-adasi-koyleri/lagada-koyu",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-2",
        "destination":  "/el/mouseia-xios",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/les-musees-de-chios",
        "destination":  "/fr/musees-de-chios",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/museen-von-chios",
        "destination":  "/de/museen-chios",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/musei-di-chios",
        "destination":  "/it/musei-chios",
        "permanent":  true
    },
    {
        "source":  "/es/habitaciones-en-chios/museos-en-la-isla-de-chios",
        "destination":  "/es/museos-chios",
        "permanent":  true
    },
    {
        "source":  "/tr/chios-odalari/heyecan-verici-sakiz-adasi-muzeleri",
        "destination":  "/tr/sakiz-adasi-muzeleri",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-museums/koraes-library",
        "destination":  "/chios/chios-museums/koraes-library-chios",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-museums/the-kallimasia-folklore-museum",
        "destination":  "/chios/chios-museums/kallimasia-folklore-museum",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-el/chios-mastic-museum-2",
        "destination":  "/el/mouseia-xios/mouseio-mastichas-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-el/chios-archaeological",
        "destination":  "/el/mouseia-xios/arxaiologiko-mouseio-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-el/chios-nautical-museum",
        "destination":  "/el/mouseia-xios/naftiko-mouseio-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-el/chios-byzantine",
        "destination":  "/el/mouseia-xios/vyzantino-mouseio-xios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-el/chios-folklore-museum",
        "destination":  "/el/mouseia-xios/laografiko-mouseio-kallimasias",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-museums-el/chios-korais-library",
        "destination":  "/el/mouseia-xios/vivliothiki-korai-xios",
        "permanent":  true
    },
    {
        "source":  "/chios-rooms/what-can-you-do-in-chios",
        "destination":  "/chios-activities",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-kambos-2",
        "destination":  "/el/ti-na-do-sti-xio",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/fr-chios-kambos",
        "destination":  "/fr/chios-en-grece",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/kambos-auf-chios",
        "destination":  "/de/chios-insel",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/la-regione-storica-di-kambos-a-chios",
        "destination":  "/it/chios-lisola-in-grecia",
        "permanent":  true
    },
    {
        "source":  "/es/habitaciones-en-chios/kambos-en-chios",
        "destination":  "/es/chios-en-grecia",
        "permanent":  true
    },
    {
        "source":  "/tr/chios-odalari/sakiz-adasi-kambos-bolgesi",
        "destination":  "/tr/sakiz-adasi",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-activities/mostra-carnival-fiesta-chios",
        "destination":  "/chios-festival-mostra",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-activities/greek-language",
        "destination":  "/greek-language-courses-chios",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-activities/the-ignitable-chios-hiking",
        "destination":  "/chios-hiking",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-activities/the-chios-thermal-baths",
        "destination":  "/chios-thermal-baths",
        "permanent":  true
    },
    {
        "source":  "/chios/rocket-war-of-chios",
        "destination":  "/rocket-war-chios",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/rouketopolemos-chios",
        "destination":  "/el/rouketopolemos-xios",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-aktiviteleri/sakiz-adasi-roket-savasi",
        "destination":  "/tr/sakiz-adasi-roket-savasi",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-aktiviteleri/sakiz-adasi-aktiviteleri",
        "destination":  "/tr/sakiz-adasi-aktiviteleri",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-aktiviteleri/sakiz-adasi-mostra-karnavali",
        "destination":  "/tr/sakiz-adasi-mostra-festivali",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-activities-el/greek-language-2",
        "destination":  "/el/mathimata-ellinikon-sti-xio",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-activities-el/chios-hiking-2",
        "destination":  "/el/pezoporia-sti-xio",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-activities-el/chios-springs",
        "destination":  "/el/iamatika-loutra-xiou",
        "permanent":  true
    },
    {
        "source":  "/el/chios-el/chios-activities-el/chios-orchids-2",
        "destination":  "/el/orchidees-xiou",
        "permanent":  true
    },
    {
        "source":  "/chios/chios-orchids",
        "destination":  "/chios-orchids",
        "permanent":  true
    },
    {
        "source":  "/fr/ile-de-chios/orchidees-de-chios",
        "destination":  "/fr/orchidees-de-chios",
        "permanent":  true
    },
    {
        "source":  "/de/chios-insel/orchideen-von-chios",
        "destination":  "/de/orchideen-auf-chios",
        "permanent":  true
    },
    {
        "source":  "/it/stanze-a-chios/la-bellezza-delle-orchidee-di-chios",
        "destination":  "/it/orchidee-di-chios",
        "permanent":  true
    },
    {
        "source":  "/es/habitaciones-en-chios/las-orquideas-de-chios",
        "destination":  "/es/orquideas-de-quios",
        "permanent":  true
    },
    {
        "source":  "/tr/chios-odalari/chiosun-orkidelerinin-guzelligi",
        "destination":  "/tr/sakiz-adasi-orkideleri",
        "permanent":  true
    },
    {
        "source":  "/tr/offer",
        "destination":  "/tr/sakiz-adasi-otel-firsatlari",
        "permanent":  true
    },
    {
        "source":  "/photos",
        "destination":  "/",
        "permanent":  true
    },
    {
        "source":  "/el/voulamandis-house-photos",
        "destination":  "/el",
        "permanent":  true
    },
    {
        "source":  "/chios-videos",
        "destination":  "/chios-island",
        "permanent":  true
    },
    {
        "source":  "/el/chios-videos-2",
        "destination":  "/el/ti-na-do-sti-xio",
        "permanent":  true
    },
    {
        "source":  "/de/videos-uber-chios",
        "destination":  "/de/chios-insel",
        "permanent":  true
    },
    {
        "source":  "/tr/sakiz-adasi-videolari",
        "destination":  "/tr/sakiz-adasi",
        "permanent":  true
    },
    {
        "source":  "/chios-ai-chatbox",
        "destination":  "/chios-island",
        "permanent":  true
    },
    {
        "source":  "/el/gr-ai-for-chios",
        "destination":  "/el/ti-na-do-sti-xio",
        "permanent":  true
    },
    {
        "source":  "/fr/fr-chatbox-ia-chios",
        "destination":  "/fr/chios-en-grece",
        "permanent":  true
    },
    {
        "source":  "/de/chios-ki-chat-box",
        "destination":  "/de/chios-insel",
        "permanent":  true
    },
    {
        "source":  "/vh-photos/voulamandis-house-garden-voulamandis-house-chios-hotels",
        "destination":  "/",
        "permanent":  true
    },
    {
        "source":  "/vh-photos/voulamandis-house-seating-area-voulamandis-house-chios-hotels",
        "destination":  "/",
        "permanent":  true
    },
    {
        "source":  "/vh-photos/voulamandis-house-citrus-farm-voulamandis-house-chios-hotels",
        "destination":  "/",
        "permanent":  true
    },
    {
        "source":  "/best-beaches-in-chios",
        "destination":  "/chios-beach-lovers",
        "permanent":  true
    },
    {
        "source":  "/10-best-tips-to-explore-chiosvoulamandis-house",
        "destination":  "/chios-explorer",
        "permanent":  true
    }
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 62, 75],
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
