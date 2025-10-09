import { notFound } from "next/navigation";

import { getCampaignById } from "@/lib/campaigns";
import { PromptContextEditor } from "@/components/campaigns/prompt-context-editor";
import { majorMono } from "@/lib/fonts";

type CampaignPageProps = {
  params: {
    campaignId: string;
  };
};

export default async function CampaignDetailPage({
  params,
}: CampaignPageProps) {
  const campaign = await getCampaignById(params.campaignId);

  if (!campaign) {
    notFound();
  }

  const promptContext = campaign.prompt_context ?? "";

  return (
    <section className="space-y-12">
      <div className="space-y-5">
        <span className="callout-label text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          Campaign Control
        </span>
        <h1 className={`campaign-title text-4xl md:text-5xl ${majorMono.className}`}>
          {campaign.name}
        </h1>
        <PromptContextEditor
          campaignId={campaign.id}
          initialValue={promptContext}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="feature-card rounded-xl border border-border/70 bg-background/50 p-6 backdrop-blur">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/90">
              Shadow Roster
            </h2>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              NPC tracking
            </span>
          </header>
          <p className="text-sm text-muted-foreground">
            NPC management is coming soon. Every generated contact, fixer, and
            rival will land here once saved.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground/90">
            <li className="rounded-lg border border-dashed border-border/60 px-3 py-2 italic">
              Add your first NPC once the generator hooks in.
            </li>
          </ul>
        </article>

        <article className="feature-card rounded-xl border border-border/70 bg-background/50 p-6 backdrop-blur">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/90">
              Operation Sites
            </h2>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              Locations
            </span>
          </header>
          <p className="text-sm text-muted-foreground">
            Locations you generate or bookmark will surface here for quick table
            reference.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground/90">
            <li className="rounded-lg border border-dashed border-border/60 px-3 py-2 italic">
              No locations yet. Scope a site with the generator to populate this
              list.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
