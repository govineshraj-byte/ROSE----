import Image from "next/image";
import { Reveal } from "./reveal";

const ROSES = [
  {
    name: "Red Rose",
    latin: "Rosa damascena",
    desc: "Devotion, distilled.",
    src: "/roses/hero-red.jpg",
    alt: "Dew-covered red rose in full bloom",
    pos: "object-center",
  },
  {
    name: "White Rose",
    latin: "Rosa alba",
    desc: "Silence, kept pure.",
    src: "/roses/garden-mix.jpg",
    alt: "Cream and ivory garden roses",
    pos: "object-top",
  },
  {
    name: "Pink Rose",
    latin: "Rosa centifolia",
    desc: "Tenderness, first light.",
    src: "/roses/story-pink.jpg",
    alt: "Blush pink rose in a glass vase",
    pos: "object-center",
  },
  {
    name: "Yellow Rose",
    latin: "Rosa foetida",
    desc: "Joy, without apology.",
    src: "/roses/coral.jpg",
    alt: "Golden coral garden roses glowing in daylight",
    pos: "object-center",
  },
  {
    name: "Deep Burgundy",
    latin: "Rosa ‘Nuit’",
    desc: "Mystery after dark.",
    src: "/roses/rose-bed.jpg",
    alt: "Bed of deep red roses in shadow",
    pos: "object-bottom",
  },
];

export function Gallery() {
  return (
    <section id="gallery" aria-label="Rose gallery" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
              03 — Collection
            </p>
            <h2 className="font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
              The <span className="italic text-primary">Gallery.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Real specimens, photographed — not rendered. Swipe on mobile,
            hover for depth on desktop.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ROSES.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <article
                tabIndex={0}
                aria-label={`${r.name}, ${r.desc}`}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_30px_70px_-30px_var(--primary)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={r.src}
                    alt={r.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 90vw, (max-width: 1280px) 30vw, 20vw"
                    className={`object-cover ${r.pos} transition duration-700 group-hover:scale-105`}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80"
                  />
                  <span className="glass absolute top-3 left-3 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-white uppercase">
                    0{i + 1}
                  </span>
                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="font-display text-2xl text-white">{r.name}</h3>
                    <p className="text-[11px] tracking-[0.18em] text-white/75 uppercase italic">
                      {r.latin}
                    </p>
                  </div>
                </div>
                <p className="px-5 py-4 text-sm text-muted-foreground">
                  {r.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
