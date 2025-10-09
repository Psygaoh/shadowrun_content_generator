"use server";

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: {
    campaignId: string;
  };
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
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

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      "id, name, prompt_context, description, created_at, updated_at",
    )
    .eq("id", params.campaignId)
    .maybeSingle();

  if (error) {
    console.error("[campaigns] fetch failed", error);
    return NextResponse.json(
      { message: "Unable to load campaign." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
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

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const updates: Record<string, string> = {};

  if (typeof body.promptContext === "string") {
    updates.prompt_context = body.promptContext.trim();
  }

  if (typeof body.description === "string") {
    updates.description = body.description.trim();
  }

  if (typeof body.name === "string") {
    updates.name = body.name.trim();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { message: "No valid fields provided." },
      { status: 400 },
    );
  }

  const { status, error } = await supabase
    .from("campaigns")
    .update(updates)
    .eq("id", params.campaignId)
    .eq("gamemaster_id", user.id);

  if (error) {
    console.error("[campaigns] update failed", error);
    return NextResponse.json(
      { message: "Unable to update campaign." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: status ?? 200 });
}
