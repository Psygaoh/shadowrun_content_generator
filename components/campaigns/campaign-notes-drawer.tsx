"use client";

import { useEffect, useMemo, useState } from "react";
import { FileTextIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import type { Campaign } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";

export const ACTIVE_CAMPAIGN_STORAGE_KEY = "shadowrun.activeCampaignId";

type CampaignNotesDrawerProps = {
  campaigns: Campaign[];
};

function extractCampaignId(pathname: string): string | null {
  const match = pathname.match(/^\/campaigns\/([^/]+)/);
  return match ? match[1] : null;
}

export function CampaignNotesDrawer({
  campaigns,
}: CampaignNotesDrawerProps) {
  const pathname = usePathname();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
      if (nextCampaignId && typeof window !== "undefined") {
        window.localStorage.setItem(
          ACTIVE_CAMPAIGN_STORAGE_KEY,
          nextCampaignId,
        );
      }
      setActiveCampaignId(nextCampaignId);
      return;
    }

    const exists = campaigns.some(
      (campaign) => campaign.id === activeCampaignId,
    );

    if (!exists) {
      const fallbackId = campaigns[0]?.id ?? null;
      setActiveCampaignId(fallbackId);
      if (fallbackId && typeof window !== "undefined") {
        window.localStorage.setItem(
          ACTIVE_CAMPAIGN_STORAGE_KEY,
          fallbackId,
        );
      }
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

  useEffect(() => {
    if (!isPanelOpen) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPanelOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPanelOpen]);

  if (isHome) {
    return null;
  }

  const buttonDisabled = !activeCampaign;

  const handleToggle = () => {
    if (buttonDisabled) {
      return;
    }
    setIsPanelOpen((open) => !open);
  };

  return (
    <>
      <aside className="notes-rail sticky top-24 hidden h-full min-h-[24rem] w-16 shrink-0 flex-col items-center justify-between border-l border-border/70 bg-background/40 py-6 backdrop-blur md:flex">
        <div className="flex flex-col items-center gap-4">
          <div className="pointer-events-none h-12 w-12 rounded-full bg-primary/15 blur-xl" />
          <Button
            type="button"
            size="icon"
            variant={isPanelOpen ? "default" : "outline"}
            className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-full text-[0.6rem] uppercase tracking-[0.28em]"
            disabled={buttonDisabled}
            onClick={handleToggle}
            aria-expanded={isPanelOpen}
            aria-label="Toggle campaign notes"
          >
            <FileTextIcon className="size-4" />
            <span className="text-[0.55rem] tracking-[0.3em]">Notes</span>
          </Button>
        </div>
        <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70 [writing-mode:vertical-rl]">
          Context
        </span>
      </aside>

      {isPanelOpen && activeCampaign ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsPanelOpen(false);
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
                onClick={() => setIsPanelOpen(false)}
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
