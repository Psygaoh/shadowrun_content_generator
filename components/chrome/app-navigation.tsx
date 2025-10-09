"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const appNavItems = [
  { href: "/home", label: "Home" },
  { href: "/campaigns", label: "Campaign" },
  { href: "/generators", label: "Generator" },
  { href: "/ambiences", label: "Ambiance Library" },
];

function isActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="app-subnav border-b border-border/60 bg-background/50 px-6 pb-4 pt-3 backdrop-blur md:px-10">
      <div className="flex flex-wrap items-center gap-2">
        {appNavItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] transition-colors md:px-5",
                active
                  ? "border-primary/80 bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
