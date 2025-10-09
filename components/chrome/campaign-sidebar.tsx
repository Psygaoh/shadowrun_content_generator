"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTreeIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/campaigns";
import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import { Button } from "@/components/ui/button";
import { ACTIVE_CAMPAIGN_STORAGE_KEY } from "@/components/campaigns/campaign-notes-drawer";

type CampaignSidebarProps = {
  campaigns: Campaign[];
};

export function CampaignSidebar({ campaigns }: CampaignSidebarProps) {
  const pathname = usePathname();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeCampaignId, setActiveCampaignId] =
    useState<string | null>(null);

  const isHomePage = pathname === "/home";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(
      ACTIVE_CAMPAIGN_STORAGE_KEY,
    );
    if (stored) {
      setActiveCampaignId(stored);
    }
  }, []);

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
    } else {
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
    }
  }, [campaigns, activeCampaignId]);

  const campaignLinks = useMemo(() => {
    return campaigns.map((campaign) => {
      const href = `/campaigns/${campaign.id}`;
      const isActive =
        pathname === href || pathname.startsWith(`${href}/`);

      return (
        <Link
          key={campaign.id}
          href={href}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(
                ACTIVE_CAMPAIGN_STORAGE_KEY,
                campaign.id,
              );
            }
            setActiveCampaignId(campaign.id);
          }}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm transition-colors",
            isActive
              ? "border-primary/70 bg-primary/10 text-primary"
              : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/10 hover:text-foreground",
          )}
        >
          <span className="block truncate font-medium">
            {campaign.name}
          </span>
          {campaign.promptContext ? (
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {campaign.promptContext}
            </span>
          ) : null}
        </Link>
      );
    });
  }, [campaigns, pathname]);

  if (isHomePage) {
    return null;
  }

  const panel = (
    <aside className="campaign-sidebar hidden h-full w-64 shrink-0 flex-col gap-4 border-r border-border/70 bg-background/40 p-4 backdrop-blur lg:flex">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Campaigns
          </span>
          <CreateCampaignDialog />
        </div>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto">
        {campaignLinks.length ? (
          campaignLinks
        ) : (
          <div className="rounded-lg border border-dashed px-3 py-6 text-xs text-muted-foreground">
            No campaigns yet. Create your first run to start managing
            context.
          </div>
        )}
      </nav>
    </aside>
  );

  return (
    <>
      <div className="lg:hidden">
        <aside className="campaign-sidebar mb-6 w-full rounded-2xl border border-border/70 bg-background/40 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Campaigns
            </span>
            <CreateCampaignDialog />
          </div>

          <nav className="mt-4 flex flex-col gap-1">
            {campaignLinks.length ? (
              campaignLinks
            ) : (
              <div className="rounded-lg border border-dashed px-3 py-6 text-xs text-muted-foreground">
                No campaigns yet. Create your first run to start managing
                context.
              </div>
            )}
          </nav>
        </aside>
      </div>

      <div className="relative hidden h-full items-stretch lg:flex">
        <div
          className={cn(
            "transition-all duration-300",
            isPanelOpen
              ? "w-64 opacity-100"
              : "w-0 opacity-0 [pointer-events:none]",
          )}
        >
          {isPanelOpen ? panel : null}
        </div>
        <aside className="campaign-rail sticky top-24 flex h-full min-h-[24rem] w-16 shrink-0 flex-col items-center justify-between border-r border-border/70 bg-background/40 py-6 backdrop-blur">
          <div className="flex flex-col items-center gap-4">
            <div className="pointer-events-none h-12 w-12 rounded-full bg-primary/15 blur-xl" />
            <Button
              type="button"
              size="icon"
              variant={isPanelOpen ? "default" : "outline"}
              className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-full text-[0.6rem] uppercase tracking-[0.28em]"
              onClick={() => setIsPanelOpen((open) => !open)}
              aria-expanded={isPanelOpen}
              aria-label="Toggle campaigns"
            >
              <ListTreeIcon className="size-4" />
              <span className="text-[0.55rem] tracking-[0.3em]">Runs</span>
            </Button>
          </div>
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70 [writing-mode:vertical-rl]">
            Campaigns settings
          </span>
        </aside>
      </div>
    </>
  );
}
