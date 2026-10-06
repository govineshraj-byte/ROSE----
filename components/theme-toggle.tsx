"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = (resolvedTheme ?? theme) === "dark";

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-10 w-10 rounded-full border border-border bg-card",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full",
        "border border-border bg-card/70 text-foreground shadow-sm",
        "hover:border-primary/50 hover:shadow-md focus-visible:outline-2",
        className
      )}
    >
      <span
        className={cn(
          "absolute transition-all duration-500",
          isDark
            ? "-translate-y-8 rotate-90 opacity-0"
            : "translate-y-0 rotate-0 opacity-100"
        )}
      >
        <Moon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span
        className={cn(
          "absolute transition-all duration-500",
          isDark
            ? "translate-y-0 rotate-0 opacity-100"
            : "translate-y-8 -rotate-90 opacity-0"
        )}
      >
        <Sun className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="sr-only">{isDark ? "Dark" : "Light"} mode active</span>
    </button>
  );
}
