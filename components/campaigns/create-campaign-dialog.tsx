"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACTIVE_CAMPAIGN_STORAGE_KEY } from "./campaign-notes-drawer";

type CampaignFormState = {
  name: string;
  promptContext: string;
  description: string;
};

const initialFormState: CampaignFormState = {
  name: "",
  promptContext: "",
  description: "",
};

export function CreateCampaignDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] =
    useState<CampaignFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeDialog = () => {
    setIsOpen(false);
    setFormState(initialFormState);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formState.name.trim();
    const promptContext = formState.promptContext.trim();
    const description = formState.description.trim();

    if (!name) {
      setErrorMessage("Campaign name is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          promptContext,
          description,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message =
          (result && typeof result.message === "string"
            ? result.message
            : null) ?? "Unable to create campaign.";
        setErrorMessage(message);
        return;
      }

      const result = await response.json().catch(() => null);
      const newCampaignId =
        result && typeof result.campaignId === "string"
          ? result.campaignId
          : null;

      if (newCampaignId && typeof window !== "undefined") {
        window.localStorage.setItem(
          ACTIVE_CAMPAIGN_STORAGE_KEY,
          newCampaignId,
        );
      }

      closeDialog();
      router.refresh();

      if (newCampaignId) {
        router.push(`/campaigns/${newCampaignId}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              closeDialog();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-background p-6 shadow-lg">
            <header className="mb-4 space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                Create campaign
              </h2>
              <p className="text-sm text-muted-foreground">
                Capture the name and core vibe for your next run.
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Name</Label>
                <Input
                  id="campaign-name"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Neo-Tokyo Shadow Games"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-context">Prompt context</Label>
                <Input
                  id="campaign-context"
                  value={formState.promptContext}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      promptContext: event.target.value,
                    }))
                  }
                  placeholder="Corporate intrigue in Shinjuku's neon arcologies"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <textarea
                  id="campaign-description"
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Detail factions, twists, or the crew's current objectives."
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create campaign"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-full blur-md shadow-[0_0_24px_rgba(236,72,153,0.4)]" />
        <Button
          size="sm"
          variant="outline"
          className="relative text-[0.625rem] uppercase tracking-[0.2em]"
          onClick={() => setIsOpen(true)}
          disabled={isSubmitting}
        >
          New
        </Button>
      </div>
    </>
  );
}
