import Link from "next/link";

const panels = [
  {
    title: "Campaign Control",
    description:
      "Define the current run, manage briefing notes, and keep your context aligned with the crew.",
    href: "/campaigns",
  },
  {
    title: "Generators",
    description:
      "Spin up NPCs, locations, and mission beats tuned to your campaign constraints in seconds.",
    href: "/generators",
  },
  {
    title: "Ambience Library",
    description:
      "Collect, refine, and resurface the atmospheric snippets that keep the shadows alive at the table.",
    href: "/ambiences",
  },
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <span className="callout-label text-xs font-medium uppercase tracking-[0.35em]">
          Dashboard
        </span>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Welcome home
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          This is your command deck for the Shadowrun Content Creator Assistant.
          Choose a module to start prepping tonight&apos;s session or keep refining
          the tools that power your campaign.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {panels.map((panel) => (
          <Link
            key={panel.title}
            href={panel.href}
            className="feature-card group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                {panel.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {panel.description}
              </p>
            </div>
            <span className="relative mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Enter
              <span className="ml-2 h-px w-10 bg-primary/50 transition-all duration-300 group-hover:w-16" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
