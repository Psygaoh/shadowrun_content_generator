export default function CampaignsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
        Campaign Control
      </h1>
      <p className="max-w-2xl text-sm text-slate-300/80 md:text-base">
        Track your active campaign context here. Soon you will be able to define
        themes, constraints, and session briefs that every generator can draw
        from.
      </p>
      <div className="rounded-lg border border-dashed border-cyan-400/40 bg-slate-900/60 p-6 text-sm text-slate-400">
        Module scaffolding in place. Flesh out the campaign data model, context
        editor, and session history here.
      </div>
    </section>
  );
}
