export default function GeneratorsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
        Generators Hub
      </h1>
      <p className="max-w-2xl text-sm text-slate-300/80 md:text-base">
        This area will host the NPC, location, and ambience generators. Each one
        will respect the active campaign context and let you iterate quickly mid
        session.
      </p>
      <div className="rounded-lg border border-dashed border-purple-400/40 bg-slate-900/60 p-6 text-sm text-slate-400">
        TODO: wire up generator forms, streaming completions, and revision tools.
      </div>
    </section>
  );
}
