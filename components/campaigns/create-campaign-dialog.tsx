"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCampaigns } from "@/components/campaigns/campaign-context";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

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

type CreateCampaignDialogProps = {
  triggerLabel?: string;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  triggerClassName?: string;
  fullWidth?: boolean;
};

export function CreateCampaignDialog({
  triggerLabel = "New",
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  fullWidth = false,
}: CreateCampaignDialogProps) {
  const router = useRouter();
  const { setActiveCampaignId } = useCampaigns();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] =
    useState<CampaignFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

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

      closeDialog();
      if (newCampaignId) {
        setActiveCampaignId(newCampaignId);
        router.push(`/campaigns/${newCampaignId}`);
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsOpen(true);
            return;
          }
          if (!isSubmitting) {
            closeDialog();
          }
        }}
      >
        <ModalHeader
          title="Create campaign"
          description="Capture the name and core vibe for your next run."
        />

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
              data-autofocus="true"
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
            <Textarea
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

          <ModalFooter>
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
          </ModalFooter>
        </form>
      </Modal>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-full blur-md shadow-[0_0_24px_rgba(236,72,153,0.4)]" />
        <Button
          size={triggerSize}
          variant={triggerVariant}
          className={cn(
            "relative text-[0.625rem] uppercase tracking-[0.2em]",
            fullWidth && "w-full",
            triggerClassName,
          )}
          onClick={() => setIsOpen(true)}
          disabled={isSubmitting}
        >
          {triggerLabel}
        </Button>
      </div>
    </>
  );
}
