"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCampaigns } from "@/components/campaigns/campaign-context";
import { SlidingRail } from "@/components/layout/sliding-rail";

export function CampaignNotesDrawer() {
  const {
    campaigns,
    activeCampaignId,
    saveCampaignNotes,
  } = useCampaigns();
  const router = useRouter();
  const pathname = usePathname();

  const [isDesktopOpen, setDesktopOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [, startTransition] = useTransition();

  const isHome = pathname === "/home";

  useEffect(() => {
    if (isHome) {
      setDesktopOpen(false);
      setMobileOpen(false);
    }
  }, [isHome]);

  const activeCampaign = useMemo(() => {
    if (!activeCampaignId) {
      return null;
    }
    return campaigns.find((campaign) => campaign.id === activeCampaignId) ?? null;
  }, [campaigns, activeCampaignId]);

  useEffect(() => {
    if (!activeCampaign) {
      setNoteValue("");
      return;
    }
    setNoteValue(activeCampaign.description ?? "");
  }, [activeCampaign]);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobileOpen]);

  if (isHome) {
    return null;
  }

  const disabled = !activeCampaign;

  const submitNotes = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeCampaign) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    setError(null);

    const trimmed = noteValue.trim();
    const result = await saveCampaignNotes(activeCampaign.id, trimmed);

    if (!result.ok) {
      setError(result.message);
    } else {
      setFeedback("Notes saved");
      startTransition(() => router.refresh());
    }

    setIsSaving(false);
  };

  const notesForm = (
    <form className="flex h-full flex-col gap-4" onSubmit={submitNotes}>
      <Textarea
        value={noteValue}
        onChange={(event) => setNoteValue(event.target.value)}
        className="min-h-[240px] flex-1 resize-none rounded-lg border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground shadow-inner outline-none transition focus-visible:ring-1 focus-visible:ring-primary"
        placeholder="Capture factions, agendas, twists, and table beats for this campaign."
      />
      <div className="flex items-center justify-between gap-3">
        <div className="min-h-[1.25rem] text-xs">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : feedback ? (
            <span className="text-muted-foreground">{feedback}</span>
          ) : null}
        </div>
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save notes"}
        </Button>
      </div>
    </form>
  );

  const desktopPanel = activeCampaign ? (
    <aside className="flex h-full w-80 shrink-0 flex-col gap-6 border-border/70 bg-background/40 p-6 backdrop-blur">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Campaign notes
        </span>
        <div className="h-px w-full bg-border/60" />
      </div>
      <header>
        <h2 className="text-lg font-semibold text-foreground">
          {activeCampaign.name}
        </h2>
      </header>
      <section className="flex-1 overflow-y-auto pr-2">{notesForm}</section>
    </aside>
  ) : (
    <aside className="flex h-full w-80 shrink-0 flex-col items-center justify-center gap-2 border-border/70 bg-background/40 p-6 text-sm text-muted-foreground backdrop-blur">
      <p>Select a campaign to view its notes.</p>
    </aside>
  );

  const mobileOverlay =
    isMobileOpen && activeCampaign ? (
      <div
        className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm lg:hidden"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setMobileOpen(false);
          }
        }}
      >
        <aside className="relative flex h-full w-full max-w-[min(42rem,70vw)] flex-col border-l border-border/70 bg-background/95 px-6 py-8 shadow-2xl">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Campaign notes
              </p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">
                {activeCampaign.name}
              </h2>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMobileOpen(false)}
              aria-label="Close notes"
            >
              <XIcon className="size-4" />
            </Button>
          </header>
          <div className="mt-6 h-px bg-border/60" />
          <section className="mt-6 flex-1 overflow-y-auto pr-2">
            {notesForm}
          </section>
        </aside>
      </div>
    ) : null;

  return (
    <>
      <div className="mt-6 flex justify-end lg:hidden">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (!disabled) {
              setMobileOpen(true);
            }
          }}
          disabled={disabled}
          className="text-[0.7rem] uppercase tracking-[0.3em]"
        >
          Campaign Notes
        </Button>
      </div>

      {mobileOverlay}

      <SlidingRail
        side="right"
        open={isDesktopOpen && !disabled}
        onOpenChange={(next) => {
          if (!disabled) {
            setDesktopOpen(next);
          }
        }}
        panelWidthClass="w-80"
        toggleDisabled={disabled}
        toggleContent={(open) =>
          open ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />
        }
        verticalLabel="Campaign notes"
      >
        {desktopPanel}
      </SlidingRail>
    </>
  );
}
