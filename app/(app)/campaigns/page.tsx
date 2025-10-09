import { redirect } from "next/navigation";

import { listCampaigns } from "@/lib/campaigns";

export default async function CampaignsIndexPage() {
  const campaigns = await listCampaigns();

  if (campaigns.length > 0) {
    redirect(`/campaigns/${campaigns[0].id}`);
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <span className="callout-label text-xs font-semibold uppercase tracking-[0.35em]">
          Campaign Control
        </span>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          No campaigns yet
        </h1>
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
        Create a campaign to start capturing your Shadowrun context. Once a
        campaign exists, it will appear in the sidebar and you can switch
        between them instantly.
      </p>
    </section>
  );
}
