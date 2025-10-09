"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/campaigns";
import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import { ACTIVE_CAMPAIGN_STORAGE_KEY } from "@/components/campaigns/campaign-notes-drawer";

type CampaignSidebarProps = {
  campaigns: Campaign[];
};

export function CampaignSidebar({ campaigns }: CampaignSidebarProps) {
  const pathname = usePathname();

  const isHomePage = pathname === "/home";

  const handleCampaignSelect = (campaignId: string) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      ACTIVE_CAMPAIGN_STORAGE_KEY,
      campaignId,
    );
  };

  if (isHomePage) {
    return null;
  }

  return (
    <aside className="campaign-sidebar w-full shrink-0 border-b border-border/70 bg-background/40 p-4 backdrop-blur lg:basis-[14%] lg:min-w-[9rem] lg:max-w-[16%] lg:border-b-0 lg:border-r">
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Campaigns
          </span>
          <CreateCampaignDialog />
        </div>
      </div>

      <nav className="flex flex-col gap-1 lg:max-h-[70vh] lg:overflow-y-auto">
        {campaigns.length ? (
          campaigns.map((campaign) => {
            const href = `/campaigns/${campaign.id}`;
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={campaign.id}
                href={href}
                onClick={() => handleCampaignSelect(campaign.id)}
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
          })
        ) : (
          <div className="rounded-lg border border-dashed px-3 py-6 text-xs text-muted-foreground">
            No campaigns yet. Create your first run to start managing
            context.
          </div>
        )}
      </nav>
    </aside>
  );
}
