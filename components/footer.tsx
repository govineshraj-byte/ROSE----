import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-10" aria-label="Footer">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-display text-xl tracking-[0.2em]">
          ROS<span className="text-primary">É</span>
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-6 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {["Home", "Story", "Symbolism", "Gallery", "Experience"].map((l) => (
              <li key={l}>
                <Link
                  href={`#${l.toLowerCase() === "home" ? "home" : l.toLowerCase()}`}
                  className="transition hover:text-foreground"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="max-w-md text-center text-[11px] leading-5 text-muted-foreground sm:text-left">
          Photography: real garden specimens via Unsplash (free license).
          Full sources in <code>public/roses/CREDITS.txt</code>.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ROSÉ · Day Bloom / Night Bloom
        </p>
      </div>
    </footer>
  );
}
