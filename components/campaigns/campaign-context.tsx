"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import type { Campaign } from "@/lib/campaigns";

export const ACTIVE_CAMPAIGN_STORAGE_KEY = "shadowrun.activeCampaignId";

type CampaignsContextValue = {
  campaigns: Campaign[];
  activeCampaignId: string | null;
  setActiveCampaignId: (campaignId: string | null) => void;
  updateCampaign: (campaignId: string, patch: Partial<Campaign>) => void;
  removeCampaign: (campaignId: string) => string | null;
  saveCampaignNotes: (
    campaignId: string,
    description: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
};

const CampaignsContext = createContext<CampaignsContextValue | null>(null);

type CampaignsProviderProps = {
  campaigns: Campaign[];
  children: ReactNode;
};

export function CampaignsProvider({
  campaigns: initialCampaigns,
  children,
}: CampaignsProviderProps) {
  const pathname = usePathname();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [activeCampaignId, setActiveCampaignIdState] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setCampaigns(initialCampaigns);
  }, [initialCampaigns]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const match = pathname.match(/^\/campaigns\/([^/]+)/);
    if (match?.[1]) {
      const routeCampaignId = match[1];
      setActiveCampaignIdState(routeCampaignId);
      window.localStorage.setItem(
        ACTIVE_CAMPAIGN_STORAGE_KEY,
        routeCampaignId,
      );
      return;
    }

    const stored = window.localStorage.getItem(
      ACTIVE_CAMPAIGN_STORAGE_KEY,
    );
    if (stored) {
      setActiveCampaignIdState(stored);
      return;
    }

    if (initialCampaigns.length > 0) {
      const fallbackId = initialCampaigns[0].id;
      setActiveCampaignIdState(fallbackId);
      window.localStorage.setItem(
        ACTIVE_CAMPAIGN_STORAGE_KEY,
        fallbackId,
      );
    }
  }, [pathname, initialCampaigns]);

  const setActiveCampaignId = useCallback((campaignId: string | null) => {
    setActiveCampaignIdState(campaignId);
    if (typeof window !== "undefined" && campaignId) {
      window.localStorage.setItem(
        ACTIVE_CAMPAIGN_STORAGE_KEY,
        campaignId,
      );
    }
  }, []);

  const updateCampaign = useCallback(
    (campaignId: string, patch: Partial<Campaign>) => {
      setCampaigns((previous) =>
        previous.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, ...patch } : campaign,
        ),
      );
    },
    [],
  );

  const removeCampaign = useCallback(
    (campaignId: string) => {
      let fallbackId: string | null = null;

      setCampaigns((previous) => {
        const next = previous.filter(
          (campaign) => campaign.id !== campaignId,
        );
        fallbackId = next[0]?.id ?? null;
        return next;
      });

      setActiveCampaignIdState((current) => {
        if (current !== campaignId) {
          return current;
        }

        if (typeof window !== "undefined") {
          if (fallbackId) {
            window.localStorage.setItem(
              ACTIVE_CAMPAIGN_STORAGE_KEY,
              fallbackId,
            );
          } else {
            window.localStorage.removeItem(ACTIVE_CAMPAIGN_STORAGE_KEY);
          }
        }

        return fallbackId;
      });

      return fallbackId;
    },
    [],
  );

  const saveCampaignNotes = useCallback(
    async (campaignId: string, description: string) => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => null);
          const message =
            (result && typeof result.message === "string"
              ? result.message
              : null) ?? "Unable to save notes.";
          return { ok: false as const, message };
        }

        updateCampaign(campaignId, {
          description,
          updatedAt: new Date().toISOString(),
        });

        return { ok: true as const };
      } catch (error) {
        console.error(error);
        return {
          ok: false as const,
          message: "Unexpected error. Please try again.",
        };
      }
    },
    [updateCampaign],
  );

  const value = useMemo(
    () => ({
      campaigns,
      activeCampaignId,
      setActiveCampaignId,
      updateCampaign,
      removeCampaign,
      saveCampaignNotes,
    }),
    [
      campaigns,
      activeCampaignId,
      setActiveCampaignId,
      updateCampaign,
      removeCampaign,
      saveCampaignNotes,
    ],
  );

  return (
    <CampaignsContext.Provider value={value}>
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignsProvider");
  }
  return context;
}
