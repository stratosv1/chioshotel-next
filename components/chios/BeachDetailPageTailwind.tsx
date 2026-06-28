import type { BeachDetailData } from "@/content/beach-details";
import {
  chiosBeachesPageDe,
  chiosBeachesPageEl,
  chiosBeachesPageEn,
  chiosBeachesPageEs,
  chiosBeachesPageFr,
  chiosBeachesPageIt,
  chiosBeachesPageTr,
  type ChiosBeachesPageData,
} from "@/content/chios-beaches";

type BeachDetailPageProps = {
  beach: BeachDetailData;
};

const beachUiCopy = {
  en: {
    tagsLabel: "Beach tags",
    detailsLabel: "Beach details",
    mediaLabel: "Beach video and route",
    videoTitle: "Video",
    routeMapTitle: "Route map",
    distance: "Distance",
    time: "Time",
    openGps: "Open in GPS",
    localTipLabel: "Voulamandis House local tip",
    relatedKicker: "Chios beach guide",
    exploreBeach: "Explore beach",
    watchVideo: "Watch video",
    viewRooms: "View rooms",
    checkRates: "Check rates",
    stayKicker: "Stay at Voulamandis House",
    stayTitle: "Your beach base in Kambos",
    routeFrom: "Route from Voulamandis House",
  },
  el: {
    tagsLabel: "Χαρακτηριστικά παραλίας",
    detailsLabel: "Πληροφορίες παραλίας",
    mediaLabel: "Βίντεο και διαδρομή παραλίας",
    videoTitle: "Βίντεο",
    routeMapTitle: "Χάρτης διαδρομής",
    distance: "Απόσταση",
    time: "Χρόνος",
    openGps: "Άνοιγμα στο GPS",
    localTipLabel: "Τοπική συμβουλή Voulamandis House",
    relatedKicker: "Οδηγός παραλιών Χίου",
    exploreBeach: "Δείτε την παραλία",
    watchVideo: "Δείτε βίντεο",
    viewRooms: "Δείτε δωμάτια",
    checkRates: "Δείτε τιμές",
    stayKicker: "Διαμονή στο Voulamandis House",
    stayTitle: "Η βάση σας στον Κάμπο",
    routeFrom: "Διαδρομή από το Voulamandis House",
  },
  fr: {
    tagsLabel: "Caractéristiques de la plage",
    detailsLabel: "Détails de la plage",
    mediaLabel: "Vidéo et itinéraire",
    videoTitle: "Vidéo",
    routeMapTitle: "Carte d’itinéraire",
    distance: "Distance",
    time: "Temps",
    openGps: "Ouvrir dans le GPS",
    localTipLabel: "Conseil local de Voulamandis House",
    relatedKicker: "Guide des plages de Chios",
    exploreBeach: "Explorer la plage",
    watchVideo: "Voir la vidéo",
    viewRooms: "Voir les chambres",
    checkRates: "Voir les tarifs",
    stayKicker: "Séjourner à Voulamandis House",
    stayTitle: "Votre base à Kambos",
    routeFrom: "Itinéraire depuis Voulamandis House",
  },
  de: {
    tagsLabel: "Strandmerkmale",
    detailsLabel: "Stranddetails",
    mediaLabel: "Strandvideo und Route",
    videoTitle: "Video",
    routeMapTitle: "Routenkarte",
    distance: "Entfernung",
    time: "Zeit",
    openGps: "Im GPS öffnen",
    localTipLabel: "Lokaler Tipp von Voulamandis House",
    relatedKicker: "Strandführer für Chios",
    exploreBeach: "Strand ansehen",
    watchVideo: "Video ansehen",
    viewRooms: "Zimmer ansehen",
    checkRates: "Preise ansehen",
    stayKicker: "Aufenthalt im Voulamandis House",
    stayTitle: "Ihre Basis in Kambos",
    routeFrom: "Route vom Voulamandis House",
  },
  it: {
    tagsLabel: "Caratteristiche della spiaggia",
    detailsLabel: "Dettagli della spiaggia",
    mediaLabel: "Video e percorso",
    videoTitle: "Video",
    routeMapTitle: "Mappa del percorso",
    distance: "Distanza",
    time: "Tempo",
    openGps: "Apri nel GPS",
    localTipLabel: "Consiglio locale di Voulamandis House",
    relatedKicker: "Guida alle spiagge di Chios",
    exploreBeach: "Esplora la spiaggia",
    watchVideo: "Guarda il video",
    viewRooms: "Vedi camere",
    checkRates: "Vedi tariffe",
    stayKicker: "Soggiorna al Voulamandis House",
    stayTitle: "La tua base a Kambos",
    routeFrom: "Percorso da Voulamandis House",
  },
  es: {
    tagsLabel: "Características de la playa",
    detailsLabel: "Detalles de la playa",
    mediaLabel: "Vídeo y ruta",
    videoTitle: "Vídeo",
    routeMapTitle: "Mapa de ruta",
    distance: "Distancia",
    time: "Tiempo",
    openGps: "Abrir en GPS",
    localTipLabel: "Consejo local de Voulamandis House",
    relatedKicker: "Guía de playas de Chios",
    exploreBeach: "Explorar playa",
    watchVideo: "Ver vídeo",
    viewRooms: "Ver habitaciones",
    checkRates: "Ver tarifas",
    stayKicker: "Estancia en Voulamandis House",
    stayTitle: "Tu base en Kambos",
    routeFrom: "Ruta desde Voulamandis House",
  },
  tr: {
    tagsLabel: "Plaj özellikleri",
    detailsLabel: "Plaj detayları",
    mediaLabel: "Plaj videosu ve rota",
    videoTitle: "Video",
    routeMapTitle: "Rota haritası",
    distance: "Mesafe",
    time: "Süre",
    openGps: "GPS’te aç",
    localTipLabel: "Voulamandis House yerel tavsiyesi",
    relatedKicker: "Sakız Adası plaj rehberi",
    exploreBeach: "Plajı keşfet",
    watchVideo: "Videoyu izle",
    viewRooms: "Odaları gör",
    checkRates: "Fiyatları gör",
    stayKicker: "Voulamandis House’ta konaklayın",
    stayTitle: "Kambos’taki üssünüz",
    routeFrom: "Voulamandis House’tan rota",
  },
} as const;

type BeachUiLanguage = keyof typeof beachUiCopy;

function getBeachLanguage(beach: BeachDetailData): BeachUiLanguage {
  const path = beach.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getChiosBeachesPageForLanguage(
  language: BeachUiLanguage,
): ChiosBeachesPageData {
  switch (language) {
    case "el":
      return chiosBeachesPageEl;
    case "fr":
      return chiosBeachesPageFr;
    case "de":
      return chiosBeachesPageDe;
    case "it":
      return chiosBeachesPageIt;
    case "es":
      return chiosBeachesPageEs;
    case "tr":
      return chiosBeachesPageTr;
    case "en":
    default:
      return chiosBeachesPageEn;
  }
}

function getRelatedCardClass(size: string) {
  switch (size) {
    case "large":
      return "md:col-span-2 md:row-span-2 min-h-[420px]";
    case "wide":
      return "md:col-span-2 min-h-[320px]";
    case "tall":
      return "md:row-span-2 min-h-[420px]";
    case "normal":
    default:
      return "min-h-[320px]";
  }
}

function getYouTubeWatchUrl(embedUrl: string) {
  const match = embedUrl.match(/\/embed\/([^?&/]+)/);
  return match?.[1] ? `https://www.youtube.com/watch?v=${match[1]}` : embedUrl;
}

function getYouTubeThumbnail(embedUrl: string, fallbackImage: string) {
  const match = embedUrl.match(/\/embed\/([^?&/]+)/);
  return match?.[1]
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : fallbackImage;
}

export function BeachDetailPageTailwind({ beach }: BeachDetailPageProps) {
  const language = getBeachLanguage(beach);
  const copy = beachUiCopy[language];
  const chiosBeachesPage = getChiosBeachesPageForLanguage(language);
  const relatedBeaches = chiosBeachesPage.beaches.filter(
    (related) => related.href !== beach.seo.canonicalPath,
  );
  const videoHref = getYouTubeWatchUrl(beach.media.video.embedUrl);
  const videoImage = getYouTubeThumbnail(beach.media.video.embedUrl, beach.hero.image);
  const roomsLabel = copy.viewRooms;
  const gpsLabel = copy.openGps || "Open in GPS";

  return (
    <main className="bg-[#f7fbfc] text-slate-950">
      <section
        className="relative flex min-h-[68svh] items-end overflow-hidden text-white md:min-h-[620px]"
        aria-labelledby="bd-hero-title"
      >
        <img
          src={beach.hero.image}
          alt=""
          loading="eager"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/88 via-slate-950/35 to-transparent" />

        <div className="relative z-20 mx-auto w-full max-w-[1180px] px-4 pb-12 pt-28 md:px-5 md:pb-16">
          <div className="max-w-[820px] rounded-[36px] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-9">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              {beach.hero.kicker}
            </span>

            <h1
              id="bd-hero-title"
              className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl"
            >
              {beach.hero.title}
            </h1>

            <p className="mt-5 max-w-[680px] text-base leading-8 text-white/82 md:text-lg">
              {beach.hero.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2" aria-label={copy.tagsLabel}>
              {beach.hero.tags.map((tag) => (
                <span
                  className="rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-20" aria-label={copy.detailsLabel}>
        <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3">
          {beach.details.map((detail) => (
            <article
              className="rounded-[32px] bg-white p-6 shadow-xl ring-1 ring-slate-900/5 md:p-8"
              key={detail.title}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
                {detail.icon}
              </div>
              <h2 className="text-2xl font-black tracking-[-0.04em]">{detail.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-3 py-10 md:px-5 md:py-16" aria-label={copy.mediaLabel}>
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-2">
          <article className="overflow-hidden rounded-[34px] bg-slate-950 text-white shadow-2xl">
            <a
              className="group relative block min-h-[330px] overflow-hidden p-6 text-white md:min-h-[390px] md:p-8"
              href={videoHref}
              target="_blank"
              rel="noopener nofollow"
            >
              <img
                src={videoImage}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />

              <div className="relative z-10 flex min-h-[282px] flex-col justify-between md:min-h-[326px]">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                    {copy.videoTitle}
                  </span>
                  <h2 className="mt-3 max-w-[520px] text-3xl font-black tracking-[-0.05em] md:text-4xl">
                    {beach.media.video.title}
                  </h2>
                </div>

                <div>
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-slate-950 shadow-2xl transition group-hover:scale-105">
                    ▶
                  </div>
                  <p className="max-w-[480px] text-sm leading-7 text-white/78">
                    {beach.media.video.creditText} <strong>{beach.media.video.creditLabel}</strong>
                  </p>
                  <span className="mt-5 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black !text-slate-950 shadow-lg">
                    {copy.watchVideo}
                  </span>
                </div>
              </div>
            </a>
          </article>

          <article className="overflow-hidden rounded-[34px] bg-white shadow-2xl ring-1 ring-slate-900/5">
            <div className="relative min-h-[330px] overflow-hidden p-6 md:min-h-[390px] md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.20),transparent_34%),linear-gradient(135deg,#ffffff_0%,#ecfeff_52%,#e2e8f0_100%)]" />
              <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl" />
              <div className="absolute bottom-8 left-8 h-32 w-32 rounded-full bg-slate-900/10 blur-3xl" />

              <div className="relative z-10 flex min-h-[282px] flex-col justify-between md:min-h-[326px]">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
                    {copy.routeMapTitle}
                  </span>
                  <h2 className="mt-3 max-w-[520px] text-3xl font-black tracking-[-0.05em] text-slate-950 md:text-4xl">
                    {copy.routeFrom}
                  </h2>
                </div>

                <div className="rounded-[28px] border border-slate-900/10 bg-white/70 p-5 shadow-xl backdrop-blur">
                  <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                      <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-cyan-200">
                        {copy.distance}
                      </span>
                      <strong className="mt-1 block text-xl">{beach.media.map.distance}</strong>
                    </div>
                    <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-slate-950 ring-1 ring-cyan-900/10">
                      <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-cyan-800">
                        {copy.time}
                      </span>
                      <strong className="mt-1 block text-xl">{beach.media.map.time}</strong>
                    </div>
                  </div>

                  <a
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black !text-white shadow-lg transition hover:-translate-y-0.5 sm:w-auto"
                    href={beach.media.map.gpsHref}
                    target="_blank"
                    rel="noopener"
                  >
                    {gpsLabel}
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-3 py-10 md:px-5 md:py-16" aria-label={copy.localTipLabel}>
        <div className="mx-auto max-w-[1180px]">
          <article className="grid overflow-hidden rounded-[38px] bg-cyan-950 text-white shadow-2xl md:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-300/15 text-3xl">
                  {beach.baseTip.icon}
                </div>

                <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                  {copy.stayKicker}
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-[-0.05em] md:text-5xl">
                {copy.stayTitle}
              </h2>

              <p className="mt-4 max-w-[760px] text-base leading-8 text-white/78">
                {beach.baseTip.text}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black !text-slate-950 shadow-lg transition hover:-translate-y-0.5"
                  href={beach.baseTip.href}
                >
                  {roomsLabel}
                </a>

                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-black !text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  href="/chios-hotels-rates/"
                >
                  {copy.checkRates}
                </a>
              </div>
            </div>

            <div className="relative min-h-[280px] md:min-h-full">
              <img
                src="/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp"
                alt="Voulamandis House courtyard in Kambos Chios"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/55 via-transparent to-transparent md:bg-gradient-to-r md:from-cyan-950/35 md:via-transparent md:to-transparent" />
            </div>
          </article>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="bd-related-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[780px] md:mb-12">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {copy.relatedKicker}
            </span>
            <h2
              id="bd-related-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {beach.relatedTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{beach.relatedText}</p>
          </header>

          <div className="grid auto-rows-[minmax(300px,auto)] gap-4 md:grid-cols-4 md:gap-5">
            {relatedBeaches.slice(0, 8).map((related, index) => (
              <a
                className={`group relative overflow-hidden rounded-[32px] bg-slate-900 shadow-xl ring-1 ring-slate-900/5 transition duration-500 hover:-translate-y-1 ${getRelatedCardClass(
                  related.size,
                )}`}
                href={related.href}
                key={related.href}
                style={{
                  backgroundImage: `url(${related.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/18 to-transparent transition duration-700 group-hover:from-black/70" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] md:p-7">
                  <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.05em] text-white backdrop-blur">
                    {related.badges[0]}
                  </span>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                    {related.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/80">
                    {related.description}
                  </p>
                  <strong className="mt-4 inline-flex text-sm font-black text-cyan-100">
                    {copy.exploreBeach} →
                  </strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
