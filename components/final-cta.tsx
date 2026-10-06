"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { MagneticButton } from "./magnetic-button";

export function FinalCta() {
  return (
    <section aria-label="Final call to action" className="relative py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border px-6 py-16 text-center sm:px-12 sm:py-24">
            <Image
              src="/roses/rose-bed.jpg"
              alt=""
              aria-hidden
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-background/72 backdrop-blur-[1px] dark:bg-black/62"
            />
            <div aria-hidden className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-3 w-2 rounded-[60%_40%_60%_40%] bg-primary/30 blur-[0.3px]"
                  style={{
                    left: `${8 + i * 9}%`,
                    top: `-12px`,
                    animation: `drift ${7 + (i % 4)}s ease-in-out ${i * 0.7}s infinite`,
                    transform: `rotate(${(i * 37) % 90}deg)`,
                  }}
                />
              ))}
              <style>{`@keyframes drift{0%{transform:translateY(-10px) rotate(0)}50%{transform:translateY(220px) translateX(18px) rotate(140deg)}100%{transform:translateY(460px) translateX(-10px) rotate(260deg)}}@media (prefers-reduced-motion: reduce){span{animation:none!important}}`}</style>
            </div>
            <div className="relative">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-primary uppercase">
                Finale
              </p>
              <h2 className="font-display mx-auto mt-4 max-w-3xl text-5xl leading-[1.02] font-medium tracking-tight text-balance sm:text-6xl">
                Every Rose Tells <span className="italic text-primary">a Story.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-8 text-muted-foreground">
                Some are meant to be seen. Some are meant to be remembered.
              </p>
              <div className="mt-9">
                <MagneticButton>
                  <a
                    href="#home"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_20px_45px_-18px_var(--primary)] transition hover:brightness-110"
                  >
                    Experience the Bloom
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
