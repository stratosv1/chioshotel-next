import type { FindYourRoomPageData } from "@/content/find-your-room";
import { FindYourRoomEngine } from "@/components/booking/FindYourRoomEngine";
import "@/components/booking/FindYourRoomEngine.css";

type FindYourRoomPageProps = {
  data: FindYourRoomPageData;
};

export default function FindYourRoomPage({ data }: FindYourRoomPageProps) {
  return (
    <main className="find-room-page">
      <section className="find-room-hero" aria-labelledby="find-room-title">
        <div className="find-room-hero__inner">
          <p className="find-room-hero__eyebrow">{data.hero.eyebrow}</p>
          <h1 id="find-room-title" className="find-room-hero__title">
            {data.hero.title}
          </h1>
          <p className="find-room-hero__description">
            {data.hero.description}
          </p>
        </div>
      </section>

      <section className="find-room-engine-section">
        <div className="find-room-engine-section__inner">
          <FindYourRoomEngine data={data} />
        </div>
      </section>
    </main>
  );
}
