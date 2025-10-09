import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type HeaderVariant = "landing" | "app";

const headerVariants: Record<
  HeaderVariant,
  { container: string; brand: string }
> = {
  landing: {
    container: "px-6 py-6 md:px-10",
    brand: "tracking-[0.6em]",
  },
  app: {
    container:
      "border-b border-cyan-500/20 bg-slate-950/80 px-6 py-5 backdrop-blur md:px-10",
    brand: "tracking-[0.5em]",
  },
};

type PageHeaderProps = {
  variant?: HeaderVariant;
  brandHref?: string;
  brandLabel?: string;
  rightSlot?: ReactNode;
  className?: string;
  brandClassName?: string;
};

export function PageHeader({
  variant = "landing",
  brandHref = "/",
  brandLabel = "Shadowrun",
  rightSlot,
  className,
  brandClassName,
}: PageHeaderProps) {
  const variantStyles = headerVariants[variant];

  return (
    <header
      className={cn(
        "flex items-center justify-between",
        variantStyles.container,
        className,
      )}
    >
      <Link
        href={brandHref}
        className={cn(
          "text-xs font-semibold uppercase text-cyan-200/80 hover:text-cyan-200",
          variantStyles.brand,
          brandClassName,
        )}
      >
        {brandLabel}
      </Link>
      {rightSlot}
    </header>
  );
}
