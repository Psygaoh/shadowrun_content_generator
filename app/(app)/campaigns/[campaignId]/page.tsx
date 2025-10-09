import { notFound } from "next/navigation";

import { getCampaignById } from "@/lib/campaigns";

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

  const promptContext = campaign.prompt_context?.trim() ?? "";
  const description = campaign.description?.trim() ?? "";

  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <span className="callout-label text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          Campaign Control
        </span>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          {campaign.name}
        </h1>
        {promptContext ? (
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {promptContext}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground/80">
            No context tagline yet. Add a quick summary to align generators.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="feature-card rounded-xl border border-border/70 bg-background/50 p-6 backdrop-blur">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/90">
              Prompt Context
            </h2>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              For generators
            </span>
          </header>
          <p className="text-sm text-muted-foreground">
            {promptContext
              ? promptContext
              : "Use this space to capture a punchy mission framing or campaign tone. Generators will draw from it soon."}
          </p>
        </article>

        <article className="feature-card rounded-xl border border-border/70 bg-background/50 p-6 backdrop-blur">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/90">
              Campaign Notes
            </h2>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              Deep brief
            </span>
          </header>
          <p className="text-sm text-muted-foreground">
            {description
              ? description
              : "Expand on factions, twists, or pacing beats for the campaign. This richer brief will anchor future modules."}
          </p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="feature-card rounded-xl border border-border/70 bg-background/50 p-6 backdrop-blur">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/90">
              Cast of Figures
            </h2>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              NPC roster
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
              Staging Grounds
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
