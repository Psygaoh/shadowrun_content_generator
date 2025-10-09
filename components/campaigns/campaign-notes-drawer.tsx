"use client";

import { useEffect, useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import type { CampaignSummary } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";

export const ACTIVE_CAMPAIGN_STORAGE_KEY = "shadowrun.activeCampaignId";

type CampaignNotesDrawerProps = {
  campaigns: CampaignSummary[];
};

function extractCampaignId(pathname: string): string | null {
  const match = pathname.match(/^\/campaigns\/([^/]+)/);
  return match ? match[1] : null;
}

export function CampaignNotesDrawer({
  campaigns,
}: CampaignNotesDrawerProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(
    null,
  );

  const isHome = pathname === "/home";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const routeCampaignId = extractCampaignId(pathname);

    if (routeCampaignId) {
      window.localStorage.setItem(
        ACTIVE_CAMPAIGN_STORAGE_KEY,
        routeCampaignId,
      );
      setActiveCampaignId(routeCampaignId);
      return;
    }

    const stored = window.localStorage.getItem(
      ACTIVE_CAMPAIGN_STORAGE_KEY,
    );
    if (stored) {
      setActiveCampaignId(stored);
    }
  }, [pathname]);

  useEffect(() => {
    if (!campaigns.length) {
      return;
    }

    if (!activeCampaignId) {
      const nextCampaignId = campaigns[0]?.id ?? null;
      if (nextCampaignId) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            ACTIVE_CAMPAIGN_STORAGE_KEY,
            nextCampaignId,
          );
        }
      }
      setActiveCampaignId(nextCampaignId);
      return;
    }

    const exists = campaigns.some(
      (campaign) => campaign.id === activeCampaignId,
    );

    if (!exists) {
      setActiveCampaignId(campaigns[0]?.id ?? null);
    }
  }, [campaigns, activeCampaignId]);

  const activeCampaign = useMemo(() => {
    if (!activeCampaignId) {
      return null;
    }
    return campaigns.find(
      (campaign) => campaign.id === activeCampaignId,
    );
  }, [campaigns, activeCampaignId]);

  if (isHome) {
    return null;
  }

  const buttonDisabled = !activeCampaign;

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-full blur-md shadow-[0_0_24px_rgba(56,189,248,0.35)]" />
        <Button
          size="sm"
          variant="outline"
          className="relative text-[0.625rem] uppercase tracking-[0.2em]"
          onClick={() => setIsOpen(true)}
          disabled={buttonDisabled}
        >
          Notes
        </Button>
      </div>

      {isOpen && activeCampaign ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <aside className="relative flex h-full w-full max-w-[min(42rem,70vw)] flex-col border-l border-border/70 bg-background/95 px-6 py-8 shadow-2xl">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Campaign Notes
                </p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {activeCampaign.name}
                </h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                aria-label="Close notes"
              >
                <XIcon className="size-4" />
              </Button>
            </header>

            <div className="mt-6 h-px bg-border/60" />

            <section className="mt-6 flex-1 overflow-y-auto pr-2">
              {activeCampaign.description ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {activeCampaign.description}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground/80">
                  No notes yet. Capture factions, plot threads, and table
                  beats here to keep everything at your fingertips.
                </p>
              )}
            </section>
          </aside>
        </div>
      ) : null}
    </>
  );
}
