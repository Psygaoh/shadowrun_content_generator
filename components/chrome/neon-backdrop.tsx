import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NeonBackdropVariant = "landing" | "app";

type VariantConfig = {
  outer: string;
  layers: ReactNode;
};

const variantConfig: Record<NeonBackdropVariant, VariantConfig> = {
  landing: {
    outer: "flex min-h-screen flex-col",
    layers: (
      <>
        <div className="absolute inset-0 bg-backdrop-gradient" />
        <div className="absolute inset-0 bg-cyber-grid" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-14 h-72 w-72 rounded-full neon-blob neon-blob-primary" />
          <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full neon-blob neon-blob-secondary" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-bottom-fade" />
        </div>
      </>
    ),
  },
  app: {
    outer: "flex min-h-screen flex-col",
    layers: (
      <>
        <div className="absolute inset-0 bg-backdrop-gradient" />
        <div className="absolute inset-0 bg-cyber-grid" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-14 h-64 w-64 rounded-full neon-blob neon-blob-primary" />
          <div className="absolute -bottom-28 right-10 h-80 w-80 rounded-full neon-blob neon-blob-secondary" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-bottom-fade" />
        </div>
      </>
    ),
  },
};

type NeonBackdropProps = {
  variant?: NeonBackdropVariant;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function NeonBackdrop({
  variant = "landing",
  className,
  contentClassName,
  children,
}: NeonBackdropProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        config.outer,
        className,
      )}
    >
      {config.layers}
      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
