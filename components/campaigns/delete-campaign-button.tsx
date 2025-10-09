"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeConfirm = () => {
    if (!isDeleting) {
      setIsConfirmOpen(false);
      setErrorMessage(null);
    }
  };

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
      closeConfirm();

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
      {isConfirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirm();
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-background p-6 shadow-lg">
            <header className="space-y-2">
              <h2 className="text-base font-semibold text-destructive">
                Delete campaign
              </h2>
              <p className="text-sm text-muted-foreground">
                This will permanently remove <strong>{campaignName}</strong>{" "}
                and its data. This action cannot be undone.
              </p>
            </header>

            <footer className="mt-6 flex items-center justify-between gap-3">
              <div className="text-xs text-destructive">
                {errorMessage ?? (
                  <span className="text-muted-foreground">
                    {/* TODO: also remove NPCs, locations, and other campaign-linked data */}
                    No undo available.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeConfirm}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setIsConfirmOpen(true)}
      >
        Delete campaign
      </Button>
    </>
  );
}
