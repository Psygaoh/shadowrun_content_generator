import { createClient } from "@/lib/supabase/server";

const CAMPAIGN_FIELDS =
  "id, name, prompt_context, description, created_at, updated_at";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type CampaignSummary = {
  id: string;
  name: string;
  prompt_context: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export async function listCampaigns(
  client?: SupabaseServerClient,
): Promise<CampaignSummary[]> {
  const supabase = client ?? (await createClient());

  const { data, error } = await supabase
    .from("campaigns")
    .select(CAMPAIGN_FIELDS)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[campaigns] Failed to list campaigns", error);
    throw new Error("Unable to load campaigns. Please try again later.");
  }

  return data ?? [];
}

export async function getCampaignById(
  campaignId: string,
  client?: SupabaseServerClient,
): Promise<CampaignSummary | null> {
  const supabase = client ?? (await createClient());

  const { data, error } = await supabase
    .from("campaigns")
    .select(CAMPAIGN_FIELDS)
    .eq("id", campaignId)
    .maybeSingle();

  if (error) {
    console.error("[campaigns] Failed to load campaign", error);
    throw new Error("Unable to load campaign. Please try again later.");
  }

  return data ?? null;
}
