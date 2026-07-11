import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BeachCardExample = {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  region: string;
  mood: string;
  badges: string[];
};

export function BeachesCardComparison({ beach }: { beach: BeachCardExample }) {
  return (
    <section className="bg-[#eaf5f3] px-4 py-12 md:px-6" aria-labelledby="beach-card-comparison-title">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">UI comparison</span>
          <h2 id="beach-card-comparison-title" className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#102b2d] md:text-5xl">
            Tailwind card vs shadcn/ui card
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            The same beach content shown with the current custom Tailwind style and with reusable shadcn-style components.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5 ring-1 ring-teal-900/10">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={beach.image} alt={beach.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-black text-white">{beach.region}</span>
              <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-emerald-700">{beach.mood}</span>
            </div>
            <div className="p-6">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-700">Custom Tailwind card</span>
              <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-teal-800">{beach.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{beach.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {beach.badges.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-800">{item}</span>
                ))}
              </div>
              <a href={beach.href} className="mt-5 inline-flex rounded-full border border-teal-800/20 px-4 py-2 text-xs font-black uppercase text-teal-800">
                Explore beach →
              </a>
            </div>
          </article>

          <Card className="overflow-hidden rounded-[2rem] border-teal-900/10 shadow-xl shadow-stone-900/5">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={beach.image} alt={beach.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute left-3 top-3 flex gap-2">
                <Badge>{beach.region}</Badge>
                <Badge variant="outline">{beach.mood}</Badge>
              </div>
            </div>
            <CardHeader>
              <Badge variant="secondary" className="w-fit uppercase tracking-[0.12em]">shadcn/ui card</Badge>
              <CardTitle className="font-serif text-3xl leading-tight text-teal-900">{beach.title}</CardTitle>
              <CardDescription className="text-sm leading-7 text-stone-600">{beach.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {beach.badges.slice(0, 3).map((item) => (
                  <Badge key={item} variant="secondary">{item}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <a href={beach.href} className="w-full">
                <Button className="w-full rounded-full bg-teal-800 hover:bg-teal-900">Explore beach</Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
