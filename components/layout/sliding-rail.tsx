"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SlidingRailProps = {
  side?: "left" | "right";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panelWidthClass?: string;
  toggleDisabled?: boolean;
  toggleContent: (open: boolean) => ReactNode;
  verticalLabel?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SlidingRail({
  side = "left",
  open,
  onOpenChange,
  panelWidthClass = "w-64",
  toggleDisabled = false,
  toggleContent,
  verticalLabel,
  children,
  className,
}: SlidingRailProps) {
  const isLeft = side === "left";

  const panel = (
    <div
      className={cn(
        "transition-all duration-300",
        open ? `${panelWidthClass} opacity-100` : "w-0 opacity-0",
        open ? "pointer-events-auto" : "[pointer-events:none]",
      )}
    >
      {open ? children : null}
    </div>
  );

  const rail = (
    <aside
      className={cn(
        "sticky top-24 flex h-full min-h-[24rem] w-16 shrink-0 flex-col items-center justify-between border-border/70 bg-background/40 py-6 backdrop-blur",
        isLeft ? "border-r" : "border-l",
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="pointer-events-none h-12 w-12 rounded-full bg-primary/15 blur-xl" />
        <Button
          type="button"
          size="icon"
          variant={open ? "default" : "outline"}
          className="flex h-12 w-12 items-center justify-center rounded-full"
          disabled={toggleDisabled}
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
        >
          {toggleContent(open)}
        </Button>
      </div>
      {verticalLabel ? (
        <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70 [writing-mode:vertical-rl]">
          {verticalLabel}
        </span>
      ) : null}
    </aside>
  );

  return (
    <div className={cn("relative hidden h-full items-stretch lg:flex", className)}>
      {isLeft ? (
        <>
          {panel}
          {rail}
        </>
      ) : (
        <>
          {rail}
          {panel}
        </>
      )}
    </div>
  );
}
