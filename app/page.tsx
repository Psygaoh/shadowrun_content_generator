import Link from "next/link";

import { AuthButton } from "@/components/auth-button";
import { PageHeader } from "@/components/chrome/page-header";
import { PageFooter } from "@/components/chrome/page-footer";
import { NeonBackdrop } from "@/components/chrome/neon-backdrop";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
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
    <NeonBackdrop>
      <PageHeader
        rightSlot={
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        }
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <span className="callout-label text-xs font-medium uppercase tracking-[0.4em]">
            Shadowrun GM Toolkit
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl md:leading-tight">
            Shadowrun Content Creator Assistant
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
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
              "cta-button-primary",
            )}
          >
            Enter the Grid
          </Link>
          {!user && (
            <Link
              href="/auth/login"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "cta-button-secondary",
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
              className="feature-card relative overflow-hidden rounded-xl p-6 text-left backdrop-blur"
            >
              <div className="relative space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PageFooter />
    </NeonBackdrop>
  );
}
