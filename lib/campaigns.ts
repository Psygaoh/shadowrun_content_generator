import { createClient } from "@/lib/supabase/server";

const CAMPAIGN_FIELDS =
  "id, name, prompt_context, description, created_at, updated_at";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type CampaignRow = {
  id: string;
  name: string;
  prompt_context: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  promptContext: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

function mapCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    promptContext: row.prompt_context?.trim() ?? "",
    description: row.description?.trim() ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listCampaigns(
  client?: SupabaseServerClient,
): Promise<Campaign[]> {
  const supabase = client ?? (await createClient());

  const { data, error } = await supabase
    .from("campaigns")
    .select(CAMPAIGN_FIELDS)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[campaigns] Failed to list campaigns", error);
    throw new Error("Unable to load campaigns. Please try again later.");
  }

  const rows = (data ?? []) as CampaignRow[];

  return rows.map(mapCampaign);
}

export async function getCampaignById(
  campaignId: string,
  client?: SupabaseServerClient,
): Promise<Campaign | null> {
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

  if (!data) {
    return null;
  }

  return mapCampaign(data as CampaignRow);
}
