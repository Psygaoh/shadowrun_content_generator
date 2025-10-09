"use server";

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type CreateCampaignPayload = {
  name: string;
  promptContext?: string;
  description?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 },
    );
  }

  let payload: CreateCampaignPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = payload.name?.trim() ?? "";
  const promptContext = payload.promptContext?.trim() ?? "";
  const description = payload.description?.trim() ?? "";

  if (!name) {
    return NextResponse.json(
      { message: "Campaign name is required." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      name,
      prompt_context: promptContext,
      description,
      gamemaster_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[campaigns] create failed", error);
    return NextResponse.json(
      { message: "Unable to create campaign. Try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, campaignId: data.id },
    { status: 201 },
  );
}
