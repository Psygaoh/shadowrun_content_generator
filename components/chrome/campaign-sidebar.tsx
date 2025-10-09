"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/components/campaigns/campaign-context";

export function CampaignSidebar() {
  const pathname = usePathname();
  const { campaigns, activeCampaignId, setActiveCampaignId } =
    useCampaigns();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const isHomePage = pathname === "/home";

  const campaignLinks = useMemo(() => {
    return campaigns.map((campaign) => {
      const href = `/campaigns/${campaign.id}`;
      const isActive = campaign.id === activeCampaignId;

      return (
        <Link
          key={campaign.id}
          href={href}
          onClick={() => setActiveCampaignId(campaign.id)}
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
  }, [campaigns, activeCampaignId, setActiveCampaignId]);

  if (isHomePage) {
    return null;
  }

  const campaignList =
    campaignLinks.length > 0 ? (
      campaignLinks
    ) : (
      <div className="rounded-lg border border-dashed px-3 py-6 text-xs text-muted-foreground">
        No campaigns yet. Create your first run to start managing context.
      </div>
    );

  const panel = (
    <aside className="campaign-sidebar hidden h-full w-64 shrink-0 flex-col gap-4 border-r border-border/70 bg-background/40 p-4 backdrop-blur lg:flex">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Campaigns
        </span>
        <div className="h-px w-full bg-border/60" />
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto">
        {campaignList}
      </nav>

      <div className="mt-auto pt-4">
        <CreateCampaignDialog
          triggerLabel="NEW CAMPAIGN"
          triggerVariant="default"
          triggerSize="sm"
          fullWidth
          triggerClassName="tracking-[0.35em]"
        />
      </div>
    </aside>
  );

  return (
    <>
      <div className="lg:hidden">
        <aside className="campaign-sidebar mb-6 w-full rounded-2xl border border-border/70 bg-background/40 p-4 backdrop-blur">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Campaigns
            </span>
            <div className="h-px w-full bg-border/60" />
          </div>

          <nav className="mt-4 flex flex-col gap-1">{campaignList}</nav>

          <div className="mt-6">
            <CreateCampaignDialog
              triggerLabel="NEW CAMPAIGN"
              triggerVariant="default"
              triggerSize="sm"
              fullWidth
              triggerClassName="tracking-[0.35em]"
            />
          </div>
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
              className="flex h-12 w-12 items-center justify-center rounded-full"
              onClick={() => setIsPanelOpen((open) => !open)}
              aria-expanded={isPanelOpen}
              aria-label="Toggle campaigns"
            >
              {isPanelOpen ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>
          </div>
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70 [writing-mode:vertical-rl]">
            Campaigns
          </span>
        </aside>
      </div>
    </>
  );
}
