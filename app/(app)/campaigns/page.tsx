export default function CampaignsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
        Campaign Control
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
        Track your active campaign context here. Soon you will be able to define
        themes, constraints, and session briefs that every generator can draw
        from.
      </p>
      <div className="feature-card rounded-lg border border-dashed p-6 text-sm text-muted-foreground/85">
        Module scaffolding in place. Flesh out the campaign data model, context
        editor, and session history here.
      </div>
    </section>
  );
}
