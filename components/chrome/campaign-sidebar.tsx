"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import { useCampaigns } from "@/components/campaigns/campaign-context";
import { SlidingRail } from "@/components/layout/sliding-rail";

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
    <aside className="campaign-sidebar flex h-full flex-col gap-4 border-border/70 bg-background/40 p-4 backdrop-blur">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Campaigns
        </span>
        <div className="h-px w-full bg-border/60" />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
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

          <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1">
            {campaignList}
          </nav>

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
        <SlidingRail
          side="left"
          open={isPanelOpen}
          onOpenChange={setIsPanelOpen}
          panelWidthClass="w-64"
          toggleContent={(open) =>
            open ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />
          }
          verticalLabel="Campaigns"
        >
          {panel}
        </SlidingRail>
      </div>
    </>
  );
}
