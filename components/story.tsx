import Image from "next/image";
import { Reveal } from "./reveal";

export function Story() {
  return (
    <section id="story" aria-label="Our story" className="relative py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
                01 — Story
              </p>
              <h2 className="font-display mt-4 text-4xl leading-[1.02] font-medium tracking-tight text-balance sm:text-5xl">
                A flower, studied like{" "}
                <span className="italic text-primary">couture.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="mt-8">
              <figure className="group relative overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-35px_rgba(0,0,0,0.5)]">
                <Image
                  src="/roses/story-pink.jpg"
                  alt="Single blush-pink rose stem in a glass vase against soft daylight"
                  width={900}
                  height={1200}
                  loading="lazy"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <figcaption className="glass absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-xs leading-6 text-white backdrop-blur">
                  Blush No. 02 — photographed at first light, unretouched
                  petals.
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="font-display text-2xl leading-snug text-foreground/90 sm:text-[1.7rem]">
                For centuries the rose has carried what words cannot — devotion,
                desire, restraint. We photographed real specimens at dawn and
                midnight, then staged them with drifting petals and cinematic
                light — a daytime garden by light, a night garden by dark.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                {
                  t: "Real specimens",
                  d: "Six garden roses shot as macros — dew, thorns, veining intact. No illustration stands in for the flower.",
                },
                {
                  t: "Cinematic light",
                  d: "Warm ivory studio by day. Burgundy night-garden by night. Grade, glow and pollen adapt when you toggle theme.",
                },
                {
                  t: "Editorial restraint",
                  d: "Serif display + quiet sans. Generous whitespace. One idea per screen. Glass only where it adds softness.",
                },
                {
                  t: "Motion with manners",
                  d: "Falling petals, parallax portraits, magnetic buttons — all disabled instantly when you prefer reduced motion.",
                },
              ].map((c, i) => (
                <Reveal key={c.t} delay={0.05 * i}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
                    <h3 className="text-sm font-semibold tracking-[0.14em] uppercase">
                      {c.t}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {c.d}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15} className="mt-8">
              <figure className="group relative overflow-hidden rounded-[2rem] border border-border">
                <Image
                  src="/roses/garden-mix.jpg"
                  alt="Bouquet of cream, blush and pink garden roses"
                  width={1200}
                  height={800}
                  loading="lazy"
                  sizes="(max-width: 1024px) 90vw, 640px"
                  className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
