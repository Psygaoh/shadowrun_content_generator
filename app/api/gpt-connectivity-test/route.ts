"use server";

import OpenAI from "openai";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const DEFAULT_OPENAI_MODEL = "gpt-5-nano";

function buildOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { client: null, error: "OpenAI API key missing. Populate OPENAI_API_KEY in your environment before running the connectivity test." };
  }

  return {
    client: new OpenAI({ apiKey }),
    error: null,
  };
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required. Please sign in and try again.",
      },
      { status: 401 },
    );
  }

  const { client, error } = buildOpenAIClient();

  if (!client) {
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 },
    );
  }

  const model = process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;

  try {
    const response = await client.responses.create({
      model,
      input: "Write a one-sentence bedtime story about a unicorn.",
    });

    const content = response.output_text?.trim() ?? "(No content returned)";

    return NextResponse.json({
      success: true,
      message: content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while contacting OpenAI.",
      },
      { status: 500 },
    );
  }
}
