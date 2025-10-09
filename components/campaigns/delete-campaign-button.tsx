"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCampaigns } from "@/components/campaigns/campaign-context";

type DeleteCampaignButtonProps = {
  campaignId: string;
  campaignName: string;
};

export function DeleteCampaignButton({
  campaignId,
  campaignName,
}: DeleteCampaignButtonProps) {
  const router = useRouter();
  const { removeCampaign } = useCampaigns();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message =
          (result && typeof result.message === "string"
            ? result.message
            : null) ?? "Unable to delete campaign.";
        setErrorMessage(message);
        return;
      }

      const fallbackId = removeCampaign(campaignId);
      setOpen(false);

      if (fallbackId) {
        router.push(`/campaigns/${fallbackId}`);
      } else {
        router.push("/campaigns");
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Unexpected error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          if (!isDeleting) {
            setOpen(next);
            setErrorMessage(null);
          }
        }}
        title="Delete campaign"
        description={
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              This will permanently remove <strong>{campaignName}</strong> and its
              related data.
            </p>
            <p className="text-xs text-muted-foreground/80">
              TODO: cascade deletion for NPCs, locations, and other linked entities.
            </p>
          </div>
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
        errorMessage={errorMessage}
        onConfirm={handleDelete}
      />

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Delete campaign
      </Button>
    </>
  );
}
