"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "sr4", label: "SR4 - Azure Neon" },
  { value: "sr5", label: "SR5 - Crimson Flux" },
  { value: "sr6", label: "SR6 - Ultraviolet" },
  { value: "darkAnarchy", label: "Dark Anarchy - Gilded Night" },
  { value: "matrix", label: "Matrix - Emerald Phreak" },
  { value: "lightAnarchy", label: "Light Anarchy - Streetlight" },
] as const;

type ThemeSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function ThemeSwitcher({ compact = false, className }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme ?? resolvedTheme ?? "sr4";

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-32 animate-pulse rounded-md border border-border/40 bg-muted/40",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "theme-switcher flex items-center gap-2 rounded-md border border-border bg-background/70 px-2 py-1 text-xs shadow-sm backdrop-blur",
        className,
      )}
    >
      {!compact && (
        <span className="tracking-[0.25em] text-[10px] uppercase text-muted-foreground">
          Theme
        </span>
      )}
      <select
        value={activeTheme}
        onChange={(event) => setTheme(event.target.value)}
        className={cn(
          "cursor-pointer bg-transparent text-xs font-semibold text-primary outline-none transition-colors",
          compact && "min-w-[6.5rem]",
        )}
        aria-label="Select visual theme"
      >
        {themeOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-background text-foreground"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
