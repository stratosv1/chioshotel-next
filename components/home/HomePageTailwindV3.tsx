import type { HomePageData } from "@/content/home";
import { HomePageTailwind } from "@/components/home/HomePageTailwind";

type HomePageTailwindV3Props = {
  data: HomePageData;
};

export function HomePageTailwindV3({ data }: HomePageTailwindV3Props) {
  return (
    <>
      <style>{`
        main > section:first-child a[href*="chios-rooms"],
        main > section:first-child a[href*="domatia-xios"],
        main > section:first-child a[href*="chambres-chios"],
        main > section:first-child a[href*="zimmer-chios"],
        main > section:first-child a[href*="camere-chios"],
        main > section:first-child a[href*="habitaciones-chios"],
        main > section:first-child a[href*="sakiz-odalari"],
        main > section:first-child a[href*="chios-rooms"] *,
        main > section:first-child a[href*="domatia-xios"] *,
        main > section:first-child a[href*="chambres-chios"] *,
        main > section:first-child a[href*="zimmer-chios"] *,
        main > section:first-child a[href*="camere-chios"] *,
        main > section:first-child a[href*="habitaciones-chios"] *,
        main > section:first-child a[href*="sakiz-odalari"] * {
          color: #fff !important;
        }

        main a[href="/chios-hotels-rates/"],
        main a[href="/el/amesi-kratisi-voulamandis-house/"],
        main a[href="/fr/tarifs-des-hotels-a-chios/"],
        main a[href="/de/hotelpreise-auf-der-insel-chios/"],
        main a[href="/it/prezzi-hotel-chios/"],
        main a[href="/es/los-mejores-precios-de-hotel-en-la-isla-chios/"],
        main a[href="/tr/sakiz-adasi-rezervasyon/"],
        main a[href="/chios-hotels-rates/"] *,
        main a[href="/el/amesi-kratisi-voulamandis-house/"] *,
        main a[href="/fr/tarifs-des-hotels-a-chios/"] *,
        main a[href="/de/hotelpreise-auf-der-insel-chios/"] *,
        main a[href="/it/prezzi-hotel-chios/"] *,
        main a[href="/es/los-mejores-precios-de-hotel-en-la-isla-chios/"] *,
        main a[href="/tr/sakiz-adasi-rezervasyon/"] * {
          color: #fff !important;
        }

        @media (min-width: 768px) {
          main > section:first-child > div:nth-of-type(1) {
            background: rgba(0,0,0,0.08) !important;
          }

          main > section:first-child > div:nth-of-type(2) {
            background-image: linear-gradient(to left, rgba(0,0,0,0.46), rgba(0,0,0,0.16), rgba(0,0,0,0.02)) !important;
          }

          main > section:first-child > div:nth-of-type(3) {
            justify-content: flex-end !important;
            padding-right: clamp(2rem, 7vw, 6rem) !important;
          }

          main > section:first-child > div:nth-of-type(3) > div {
            max-width: 46rem !important;
          }

          main > section:first-child > div:nth-of-type(3) > div > div:last-child {
            background: linear-gradient(135deg, rgba(18,13,10,0.54), rgba(67,43,26,0.34)) !important;
            border-color: rgba(255,255,255,0.20) !important;
            box-shadow: 0 26px 80px rgba(0,0,0,0.22) !important;
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
          }
        }
      `}</style>
      <HomePageTailwind data={data} />
    </>
  );
}
