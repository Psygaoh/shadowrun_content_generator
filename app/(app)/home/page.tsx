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
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-400/80">
          Dashboard
        </span>
        <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
          Welcome home
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/80 md:text-base">
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
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-cyan-400/30 bg-slate-900/60 p-6 shadow-[0_25px_65px_-35px_rgba(59,130,246,0.55)] backdrop-blur transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative space-y-3">
              <h2 className="text-lg font-semibold text-slate-50">
                {panel.title}
              </h2>
              <p className="text-sm text-slate-300/80">{panel.description}</p>
            </div>
            <span className="relative mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Enter<span className="ml-2 h-px w-10 bg-cyan-300/50 transition-all group-hover:w-16" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
