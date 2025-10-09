import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type FooterVariant = "landing" | "app";

const footerVariants: Record<
  FooterVariant,
  { container: string; content: ReactNode }
> = {
  landing: {
    container: "px-6 py-8 md:px-10",
    content: (
      <p>
        Built for game masters who want to keep the shadows moving.{" "}
        <Link
          href="/auth/sign-up"
          className="text-cyan-300 hover:text-cyan-100"
        >
          Create an account
        </Link>{" "}
        to start drafting tonight&apos;s run.
      </p>
    ),
  },
  app: {
    container: "border-t border-white/5 px-6 py-6 md:px-10",
    content: <p>Secure area - only those invited to the shadows can proceed.</p>,
  },
};

type PageFooterProps = {
  variant?: FooterVariant;
  className?: string;
  children?: ReactNode;
};

export function PageFooter({
  variant = "landing",
  className,
  children,
}: PageFooterProps) {
  const variantStyles = footerVariants[variant];

  return (
    <footer
      className={cn(
        "flex justify-center text-xs text-slate-500",
        variantStyles.container,
        className,
      )}
    >
      {children ?? variantStyles.content}
    </footer>
  );
}
