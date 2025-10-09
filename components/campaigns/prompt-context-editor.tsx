"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/components/campaigns/campaign-context";

type PromptContextEditorProps = {
  campaignId: string;
  initialValue: string;
};

export function PromptContextEditor({
  campaignId,
  initialValue,
}: PromptContextEditorProps) {
  const router = useRouter();
  const { updateCampaign } = useCampaigns();
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = value.trim();

    if (!trimmed) {
      setFeedback("Context cannot be empty.");
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptContext: trimmed,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message =
          (result && typeof result.message === "string"
            ? result.message
            : null) ?? "Unable to save context.";
        setFeedback(message);
        return;
      }

      updateCampaign(campaignId, {
        promptContext: trimmed,
        updatedAt: new Date().toISOString(),
      });

      setFeedback("Context updated.");
      router.refresh();
    } catch (error) {
      console.error(error);
      setFeedback("Unexpected error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label
        htmlFor="prompt-context"
        className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground"
      >
        Campaign context prompt
      </label>
      <textarea
        id="prompt-context"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-lg border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground shadow-inner transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        placeholder="Corporate intrigue in Shinjuku's neon arcologies"
        rows={3}
      />
      <div className="flex items-center gap-3">
        <Button size="sm" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save context"}
        </Button>
        {feedback ? (
          <span className="text-xs text-muted-foreground">{feedback}</span>
        ) : null}
      </div>
    </form>
  );
}
