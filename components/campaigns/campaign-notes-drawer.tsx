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
import { cn } from "@/lib/utils";

export function CampaignNotesDrawer() {
  const {
    campaigns,
    activeCampaignId,
    saveCampaignNotes,
  } = useCampaigns();
  const router = useRouter();
  const pathname = usePathname();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [, startTransition] = useTransition();

  const isHome = pathname === "/home";

  useEffect(() => {
    if (isHome) {
      setIsPanelOpen(false);
      setIsMobilePanelOpen(false);
    }
  }, [isHome]);

  const activeCampaign = useMemo(() => {
    if (!activeCampaignId) {
      return null;
    }
    return campaigns.find((campaign) => campaign.id === activeCampaignId);
  }, [campaigns, activeCampaignId]);

  useEffect(() => {
    if (!activeCampaign) {
      setNoteValue("");
      return;
    }
    setNoteValue(activeCampaign.description ?? "");
  }, [activeCampaign]);

  useEffect(() => {
    if (!isMobilePanelOpen) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobilePanelOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobilePanelOpen]);

  const buttonDisabled = !activeCampaign;

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

  if (isHome) {
    return null;
  }

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

  const desktopPanel =
    isPanelOpen && activeCampaign ? (
      <aside className="notes-panel flex h-full w-80 shrink-0 flex-col gap-6 border-l border-border/70 bg-background/40 p-6 backdrop-blur">
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
    ) : null;

  const mobileOverlay =
    isMobilePanelOpen && activeCampaign ? (
      <div
        className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm lg:hidden"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsMobilePanelOpen(false);
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
              onClick={() => setIsMobilePanelOpen(false)}
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
            if (!buttonDisabled) {
              setIsMobilePanelOpen(true);
            }
          }}
          disabled={buttonDisabled}
          className="text-[0.7rem] uppercase tracking-[0.3em]"
        >
          Campaign Notes
        </Button>
      </div>

      {mobileOverlay}

      <div className="relative hidden h-full items-stretch lg:flex">
        <div
          className={cn(
            "transition-all duration-300",
            isPanelOpen
              ? "w-80 opacity-100"
              : "w-0 opacity-0 [pointer-events:none]",
          )}
        >
          {desktopPanel}
        </div>
        <aside className="notes-rail sticky top-24 flex h-full min-h-[24rem] w-16 shrink-0 flex-col items-center justify-between border-l border-border/70 bg-background/40 py-6 backdrop-blur">
          <div className="flex flex-col items-center gap-4">
            <div className="pointer-events-none h-12 w-12 rounded-full bg-primary/15 blur-xl" />
            <Button
              type="button"
              size="icon"
              variant={isPanelOpen ? "default" : "outline"}
              className="flex h-12 w-12 items-center justify-center rounded-full"
              disabled={buttonDisabled}
              onClick={() => setIsPanelOpen((open) => !open)}
              aria-expanded={isPanelOpen}
              aria-label="Toggle campaign notes"
            >
              {isPanelOpen ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/70 [writing-mode:vertical-rl]">
            Campaign notes
          </span>
        </aside>
      </div>
    </>
  );
}
