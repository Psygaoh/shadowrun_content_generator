export default function AmbiencesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
        Ambience Library
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
        Collect and remix the cinematic beats that sell your scenes. Soon you
        will be able to store favourite prompts, variants, and quick descriptors
        for any location or encounter.
      </p>
      <div className="feature-card rounded-lg border border-dashed p-6 text-sm text-muted-foreground/85">
        Future work: list saved ambience cards, tagging, and quick-share tools
        for your table.
      </div>
    </section>
  );
}
