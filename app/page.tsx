import Link from "next/link";

import { AuthButton } from "@/components/auth-button";
import { PageHeader } from "@/components/chrome/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

const featureHighlights = [
  {
    title: "Instant NPC briefs",
    description:
      "Generate archetypes, quirks, and hooks in moments so your runners never see the seams.",
  },
  {
    title: "Mission-ready locales",
    description:
      "Paint the scene with sensory hits, security notes, and complications tailored to each run.",
  },
  {
    title: "Atmospheric prompts",
    description:
      "Drop-in ambient snippets to set the tone for smoke-filled bars, corporate vaults, or astral storms.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data?.user ?? null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-cyber-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-14 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-purple-500/20 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <PageHeader rightSlot={<AuthButton />} />

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-cyan-400/80">
              Shadowrun GM Toolkit
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-6xl md:leading-tight">
              Shadowrun Content Creator Assistant
            </h1>
            <p className="text-base text-slate-300/80 md:text-lg">
              Streamline preparation and improvisation. Spin up NPCs, locations,
              and ambient beats that match your campaign context without breaking
              the pacing of the run.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/home"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-500 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:from-cyan-300 hover:via-cyan-400 hover:to-purple-400",
              )}
            >
              Enter the Grid
            </Link>
            {!user && (
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-cyan-500/60 bg-white/5 text-cyan-200 hover:border-cyan-300 hover:text-cyan-100",
                )}
              >
                Log in with Supabase
              </Link>
            )}
          </div>

          <div className="mt-20 grid w-full max-w-4xl gap-6 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900/60 p-6 text-left shadow-[0_20px_60px_-30px_rgba(34,211,238,0.45)] backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
                <div className="relative space-y-3">
                  <h3 className="text-lg font-semibold text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-300/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="flex justify-center px-6 py-8 text-xs text-slate-500 md:px-10">
          <p>
            Built for game masters who want to keep the shadows moving.{" "}
            <Link
              href="/auth/sign-up"
              className="text-cyan-300 hover:text-cyan-100"
            >
              Create an account
            </Link>{" "}
            to start drafting tonight&apos;s run.
          </p>
        </footer>
      </div>
    </div>
  );
}
