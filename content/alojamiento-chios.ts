import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";

const heroImage =
  "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

export const alojamientoChiosPageEs: ChiosAccommodationPageData = {
  seo: {
    canonicalPath: "/es/alojamiento-chios/",
    title: "Alojamiento en Chios | Habitaciones y apartamentos",
    description:
      "Alójese en Voulamandis House, Kambos: habitaciones tranquilas y apartamentos familiares cerca de Chios, el aeropuerto y las playas. Consulte disponibilidad.",
    ogImage: heroImage,
    ogImageAlt:
      "Alojamiento en Voulamandis House entre los jardines de cítricos de Kambos, Chios",
  },
  hero: {
    kicker: "ALOJAMIENTO FAMILIAR • KAMBOS CHIOS",
    title: "Alojamiento en Chios con la tranquilidad y el carácter histórico de Kambos",
    description:
      "Voulamandis House ofrece habitaciones tranquilas y apartamentos familiares en la histórica zona de cítricos de Kambos. Alójese cerca de la ciudad de Chios, el aeropuerto y el puerto, con jardín, atención personal y opciones prácticas para parejas y familias.",
    image: heroImage,
    imageAlt:
      "Habitaciones y apartamentos de Voulamandis House en Kambos, isla de Chios",
    primaryCta: {
      label: "Ver habitaciones y apartamentos",
      href: "/es/habitaciones-en-chios/",
    },
    secondaryCta: {
      label: "Consultar disponibilidad",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
    aiCta: {
      label: "Encontrar habitación con IA",
      href: "/ai-assistant/?lang=es",
    },
  },
  highlights: [
    { label: "Zona", value: "Kambos histórico" },
    { label: "Aeropuerto", value: "3 km" },
    { label: "Puerto de Chios", value: "6 km" },
    { label: "Opciones", value: "Habitaciones y apartamentos" },
    { label: "Ideal para", value: "Parejas y familias" },
    { label: "Ambiente", value: "Jardín y cítricos" },
  ],
  intro: {
    kicker: "UNA ESTANCIA MÁS PERSONAL",
    title: "Una opción tranquila y auténtica para alojarse en Chios",
    paragraphs: [
      "Elegir alojamiento en Chios no consiste únicamente en encontrar una habitación para dormir. La zona donde se aloje influye en el ritmo del viaje, los desplazamientos diarios y la forma de conocer la isla. Voulamandis House se encuentra en Kambos, un barrio histórico de altos muros de piedra, antiguas mansiones y jardines de cítricos, a pocos minutos de la ciudad de Chios.",
      "Voulamandis House es un pequeño alojamiento familiar, no un gran complejo hotelero. Ofrece habitaciones dobles económicas, habitaciones en la planta baja, habitaciones en la planta superior y apartamentos familiares. Así puede elegir según el presupuesto, el número de huéspedes, la planta preferida, la necesidad de evitar escaleras y el deseo de disponer de cocina o de una zona de estar más amplia.",
      "La atención es directa y personal. Puede hablar con personas que conocen realmente las habitaciones, su distribución y la isla. Antes de reservar puede preguntar qué categoría se adapta mejor a su estancia, consultar la disponibilidad, solicitar desayuno y recibir recomendaciones locales sobre playas, pueblos, museos y rutas por Chios.",
    ],
    factsTitle: "Voulamandis House de un vistazo",
    facts: [
      "Habitaciones y apartamentos familiares en Kambos, Chios",
      "Opciones económicas, en planta baja y en planta superior",
      "Apartamentos familiares con cocina completa y zona de estar",
      "Wi-Fi gratuito, aire acondicionado, baño privado, TV y frigorífico",
      "Jardín, terrazas y aparcamiento para los huéspedes",
      "Desayuno en el jardín bajo petición",
      "Contacto directo por teléfono, WhatsApp o correo electrónico",
    ],
  },
  rooms: {
    kicker: "HABITACIONES Y APARTAMENTOS",
    title: "Encuentre el alojamiento en Chios que mejor encaje con su viaje",
    description:
      "Las categorías se organizan por espacio, planta, acceso y equipamiento para facilitar la comparación antes de consultar disponibilidad y precios. Las páginas de las habitaciones incluyen más fotografías y detalles concretos.",
    cards: [
      {
        id: "economy-double",
        eyebrow: "OPCIÓN ECONÓMICA PARA DOS",
        title: "Habitaciones dobles económicas",
        description:
          "Una opción práctica para dos huéspedes que buscan una base cómoda en Kambos dentro de la categoría más asequible. Las habitaciones renovadas tienen unos 16 m² e incluyen aire acondicionado, Wi-Fi, baño privado, televisión y frigorífico.",
        href: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
        image: "/images/rooms/received_1753964631359257.webp",
        imageAlt:
          "Habitación doble económica en Voulamandis House, Chios",
        facts: ["2 huéspedes", "Aprox. 16 m²", "Cama doble", "Opción económica"],
      },
      {
        id: "ground-floor",
        eyebrow: "ACCESO FÁCIL Y JARDÍN",
        title: "Habitaciones dobles y triples en planta baja",
        description:
          "Adecuadas para parejas, amigos o familias pequeñas que prefieren evitar escaleras y disfrutar de acceso directo al patio y al jardín. Según la habitación, pueden alojarse dos o tres personas.",
        href: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
        image: "/images/rooms/double-triple-room.jpg",
        imageAlt:
          "Habitación en planta baja con acceso al jardín en Voulamandis House",
        facts: ["2–3 huéspedes", "Sin escaleras", "Acceso al jardín", "Frigorífico y A/C"],
      },
      {
        id: "first-floor",
        eyebrow: "LUZ, TERRAZA Y VISTAS",
        title: "Habitaciones dobles y triples en la planta superior",
        description:
          "Una buena elección para quienes prefieren una habitación luminosa en la planta superior y acceso a la terraza compartida con vistas a la finca de cítricos. Algunas habitaciones cuentan además con una pequeña zona de cocina.",
        href: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
        image: "/images/rooms/DSC07776-2-e1675109942622.webp",
        imageAlt:
          "Habitación en la planta superior con vistas a los jardines de cítricos de Kambos",
        facts: ["2–4 huéspedes", "Planta superior", "Terraza compartida", "Algunas con cocina"],
      },
      {
        id: "family-apartments",
        eyebrow: "MÁS ESPACIO PARA FAMILIAS",
        title: "Apartamentos familiares en Chios",
        description:
          "Los apartamentos de 40–45 m² son la opción más amplia de Voulamandis House. Un dormitorio separado, la zona de estar y la cocina completa ofrecen a familias y grupos pequeños mayor comodidad y autonomía durante estancias de varias noches.",
        href: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
        image: "/images/rooms/chios-apartments-voulamandis.webp",
        imageAlt:
          "Apartamento familiar con cocina en Voulamandis House, Chios",
        facts: ["Hasta 4 huéspedes", "40–45 m²", "Cocina completa", "Zona de estar"],
      },
    ],
  },
  location: {
    kicker: "POR QUÉ ALOJARSE EN KAMBOS",
    title: "Alojamiento tranquilo cerca de la ciudad de Chios y del aeropuerto",
    paragraphs: [
      "Kambos, escrito también Kampos, es una de las zonas más características de Chios. Tras los altos muros de piedra se encuentran jardines de cítricos, patios, pozos y mansiones históricas. Alojarse aquí ofrece una atmósfera diferente a la de una calle concurrida del centro o un núcleo turístico aislado.",
      "Voulamandis House combina este entorno especial con una ubicación práctica. El aeropuerto de Chios está a unos 3 km y el puerto a unos 6 km. La ciudad de Chios, con restaurantes, tiendas, paseo marítimo y conexiones de ferry, se alcanza fácilmente, mientras que las carreteras desde Kambos conducen hacia las playas del sur y los pueblos medievales de la masilla.",
      "La ubicación resulta especialmente adecuada para quienes desean explorar distintas partes de la isla. Puede comenzar el día en el jardín, visitar una playa o un pueblo y regresar por la tarde a un ambiente más tranquilo.",
    ],
    image: "/images/beaches/voulamandis-house-courtyard-chios.webp",
    imageAlt:
      "Patio y jardín de Voulamandis House en Kambos, isla de Chios",
    distances: [
      {
        label: "Aeropuerto de Chios",
        value: "3 km",
        note: "Práctico para llegadas en avión y estancias cortas.",
      },
      {
        label: "Puerto de Chios",
        value: "6 km",
        note: "Acceso sencillo a los ferris y a la ciudad de Chios.",
      },
      {
        label: "Playa cercana",
        value: "1,5 km",
        note: "Una opción próxima antes de explorar otras zonas de costa.",
      },
    ],
    mapCta: {
      label: "Abrir Voulamandis House en Google Maps",
      href: "https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios",
    },
    guideCta: {
      label: "Descubrir Kambos en Chios",
      href: "/es/chios/kampos-chios/",
    },
  },
  reasons: {
    kicker: "QUÉ OFRECE LA ESTANCIA",
    title: "Comodidad práctica sin perder el carácter de Kambos",
    description:
      "Voulamandis House combina el entorno histórico de Kambos, servicios útiles y una hospitalidad local directa. Es una opción para viajeros que valoran la tranquilidad, la limpieza y una base auténtica desde la que descubrir Chios.",
    items: [
      {
        icon: "🌿",
        title: "Jardín y ambiente de cítricos",
        text: "La vegetación, el patio y el entorno histórico de Kambos crean un espacio tranquilo antes o después de un día recorriendo la isla.",
      },
      {
        icon: "🛏️",
        title: "Distintas configuraciones de habitación",
        text: "Elija entre categoría económica, acceso en planta baja, planta superior con terraza o apartamento familiar con más espacio.",
      },
      {
        icon: "❄️",
        title: "Servicios esenciales en la habitación",
        text: "Wi-Fi, aire acondicionado, baño privado, TV y frigorífico están incluidos; algunas opciones disponen además de cocina o zona de cocina.",
      },
      {
        icon: "🥐",
        title: "Desayuno bajo petición",
        text: "Los huéspedes pueden solicitar desayuno y disfrutarlo en el jardín para comenzar el día de una forma sencilla y agradable.",
      },
      {
        icon: "🚗",
        title: "Aparcamiento y ubicación práctica",
        text: "Hay aparcamiento disponible y la ubicación facilita los desplazamientos hacia la ciudad, las playas y los pueblos del sur.",
      },
      {
        icon: "💬",
        title: "Ayuda directa para elegir",
        text: "Puede consultar la planta, las camas, la capacidad, la cocina y la opción más adecuada antes de reservar.",
      },
    ],
  },
  travelerTypes: {
    kicker: "PARA QUIÉN ES ADECUADO",
    title: "Una base flexible para diferentes tipos de viaje a Chios",
    items: [
      {
        title: "Parejas que buscan tranquilidad",
        text: "Las habitaciones económicas y estándar ofrecen una base relajada para recorrer la isla y volver a una zona más tranquila que el centro.",
      },
      {
        title: "Familias que necesitan más espacio",
        text: "Los apartamentos familiares cuentan con dormitorio, zona de estar y cocina completa; algunas habitaciones triples son adecuadas para familias pequeñas.",
      },
      {
        title: "Viajeros independientes",
        text: "La ubicación cerca de la ciudad y de las carreteras hacia el sur permite visitar cada día una playa, un pueblo o un museo diferente.",
      },
      {
        title: "Huéspedes que llegan en avión o ferry",
        text: "La distancia aproximada de 3 km al aeropuerto y 6 km al puerto reduce los desplazamientos al principio y al final de las vacaciones.",
      },
    ],
  },
  directBooking: {
    kicker: "DISPONIBILIDAD DIRECTA",
    title: "Compruebe qué habitación le conviene antes de reservar",
    paragraphs: [
      "La reserva directa debe facilitar la elección. Las páginas de Voulamandis House muestran las categorías y la disponibilidad, mientras que el AI Room Finder puede filtrar las opciones según las fechas y el número de huéspedes.",
      "Como las habitaciones varían en planta, capacidad y disponibilidad de cocina, el contacto directo puede ser útil. Puede confirmar la necesidad de planta baja, apartamento, una distribución concreta de camas o la opción más económica disponible.",
    ],
    benefits: [
      "Disponibilidad actual y tarifas directas",
      "Ayuda para adaptar la habitación a sus necesidades",
      "Comunicación directa con Voulamandis House",
      "Acceso a las ofertas directas disponibles para sus fechas",
    ],
    primaryCta: {
      label: "Consultar precios directos",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
    secondaryCta: {
      label: "Usar el AI Room Finder",
      href: "/ai-assistant/?lang=es",
    },
    whatsappCta: {
      label: "Preguntar por WhatsApp",
      href: "https://wa.me/306944474226",
    },
  },
  explore: {
    kicker: "ORGANICE EL RESTO DEL VIAJE",
    title: "Utilice Kambos como punto de partida para descubrir Chios",
    description:
      "Chios recompensa a quienes exploran más de una zona. Estas guías ayudan a organizar días entre playas, pueblos, historia local y el paisaje que rodea el alojamiento.",
    links: [
      {
        title: "Descubrir la isla de Chios",
        text: "Empiece por la guía principal y elija las experiencias que mejor encajen con su viaje.",
        href: "/es/chios-en-grecia/",
      },
      {
        title: "Explorar las playas de Chios",
        text: "Compare playas organizadas, calas tranquilas y costas adecuadas para familias.",
        href: "/es/playas-chios/",
      },
      {
        title: "Visitar los pueblos de Chios",
        text: "Organice rutas por pueblos medievales de la masilla, localidades costeras y comunidades de montaña.",
        href: "/es/pueblos-chios/",
      },
      {
        title: "Conocer mejor Kambos",
        text: "Descubra jardines de cítricos, mansiones históricas y el paisaje de piedra alrededor de Voulamandis House.",
        href: "/es/chios/kampos-chios/",
      },
    ],
  },
  faq: {
    kicker: "PREGUNTAS FRECUENTES",
    title: "Qué saber antes de elegir alojamiento en Chios",
    items: [
      {
        question: "¿Voulamandis House es un hotel?",
        answer:
          "Voulamandis House es un alojamiento familiar con habitaciones y apartamentos en Kambos, Chios. Es una alternativa más pequeña y personal que un gran hotel o complejo turístico.",
      },
      {
        question: "¿Dónde se encuentra Voulamandis House?",
        answer:
          "Se encuentra en Dimarchou Kalvokoressi 117, Kambos, Chios. Kambos es la histórica zona de jardines de cítricos situada cerca de la ciudad y del aeropuerto.",
      },
      {
        question: "¿A qué distancia están el aeropuerto y el puerto de Chios?",
        answer:
          "Voulamandis House está aproximadamente a 3 km del aeropuerto de Chios y a 6 km del puerto, por lo que resulta práctico tanto para quienes llegan en avión como para quienes viajan en ferry.",
      },
      {
        question: "¿Cuál es la mejor opción para una familia?",
        answer:
          "Los apartamentos familiares son la opción más amplia: alojan hasta cuatro personas y disponen de dormitorio separado, zona de estar y cocina completa. Algunas habitaciones estándar pueden alojar a tres o cuatro personas.",
      },
      {
        question: "¿Hay habitaciones en planta baja sin escaleras?",
        answer:
          "Sí. Voulamandis House dispone de habitaciones económicas y estándar en planta baja. Las páginas de las habitaciones indican qué opciones no requieren escaleras y tienen acceso directo al patio o al jardín.",
      },
      {
        question: "¿Las habitaciones tienen cocina?",
        answer:
          "Los apartamentos familiares tienen cocina completa y algunas habitaciones de la planta superior disponen de una pequeña zona de cocina. Todas las opciones incluyen frigorífico.",
      },
      {
        question: "¿Está disponible el desayuno?",
        answer:
          "El desayuno está disponible bajo petición y puede servirse en el jardín. Contacte con el alojamiento para conocer los detalles actualizados para sus fechas.",
      },
      {
        question: "¿Cómo puedo consultar la disponibilidad directa?",
        answer:
          "Utilice la página de tarifas directas, el AI Room Finder o contacte con Voulamandis House por WhatsApp, teléfono o correo electrónico indicando las fechas y el número de huéspedes.",
      },
    ],
  },
  finalCta: {
    kicker: "SU ESTANCIA EN CHIOS EMPIEZA AQUÍ",
    title: "Encuentre una habitación o apartamento tranquilo en Kambos",
    text: "Compare las categorías, introduzca las fechas y elija la opción adecuada según el número de huéspedes, la planta preferida y la necesidad de cocina.",
    primaryCta: {
      label: "Consultar disponibilidad",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
    secondaryCta: {
      label: "Ver todas las habitaciones",
      href: "/es/habitaciones-en-chios/",
    },
  },
};