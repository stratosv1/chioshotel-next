import Image from "next/image";
import type { KamposChiosPageData } from "@/content/kampos-chios";

type KamposChiosPageProps = {
  data: KamposChiosPageData;
};

export function KamposChiosPage({ data }: KamposChiosPageProps) {
  return (
    <main className="kc-page">
      <section className="kc-hero">
        <div className="kc-hero__content">
          <p className="kc-kicker">{data.hero.kicker}</p>
          <h1>{data.hero.title}</h1>
          <p>{data.hero.description}</p>

          <div className="kc-actions">
            <a className="kc-btn kc-btn--primary" href={data.hero.primaryCta.href}>
              {data.hero.primaryCta.label}
            </a>
            <a className="kc-btn kc-btn--secondary" href={data.hero.secondaryCta.href}>
              {data.hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="kc-hero__image">
          <Image
            src={data.hero.image}
            alt={data.hero.imageAlt}
            width={1200}
            height={800}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="kc-intro">
        <div>
          <p className="kc-kicker">{data.language === "el" ? "Γιατί αξίζει" : "Why it matters"}</p>
          <h2>{data.intro.title}</h2>
        </div>

        <div className="kc-intro__text">
          {data.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="kc-highlights" aria-label="Kampos highlights">
        {data.highlights.map((item) => (
          <article key={`${item.label}-${item.value}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="kc-sections">
        {data.sections.map((section, index) => (
          <article className="kc-feature" key={section.title}>
            <div className="kc-feature__image">
              <Image
                src={section.image}
                alt={section.imageAlt}
                width={900}
                height={650}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>

            <div className="kc-feature__content">
              <span className="kc-number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="kc-gallery" aria-label="Kampos Chios gallery">
        {data.gallery.map((item) => (
          <figure key={item.image}>
            <Image
              src={item.image}
              alt={item.imageAlt}
              width={700}
              height={520}
              sizes="(max-width: 900px) 50vw, 25vw"
            />
          </figure>
        ))}
      </section>

      <section className="kc-stay">
        <p className="kc-kicker">{data.stay.kicker}</p>
        <h2>{data.stay.title}</h2>
        <p>{data.stay.text}</p>

        <div className="kc-actions">
          <a className="kc-btn kc-btn--primary" href={data.stay.primaryCta.href}>
            {data.stay.primaryCta.label}
          </a>
          <a className="kc-btn kc-btn--secondary" href={data.stay.secondaryCta.href}>
            {data.stay.secondaryCta.label}
          </a>
        </div>
      </section>
    </main>
  );
}
