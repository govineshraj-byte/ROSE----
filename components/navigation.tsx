"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#story", label: "Story" },
  { href: "#symbolism", label: "Symbolism" },
  { href: "#gallery", label: "Gallery" },
  { href: "#experience", label: "Experience" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-border/70 bg-background/70 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="#home"
          className="font-display text-2xl font-semibold tracking-[0.22em] text-foreground"
          aria-label="ROSÉ home"
        >
          ROS<span className="text-primary">É</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="nav-link text-[13px] font-medium tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card/70 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-lg leading-none">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass border-t border-border/70 bg-background/90 md:hidden">
          <ul className="space-y-1 px-4 py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium tracking-[0.14em] uppercase hover:bg-muted"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
