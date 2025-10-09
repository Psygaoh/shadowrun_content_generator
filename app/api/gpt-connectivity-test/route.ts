"use server";

import OpenAI from "openai";
import { NextResponse } from "next/server";

// Set OPENAI_API_KEY (required) and optionally OPENAI_MODEL in .env.local / .env.production.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_MODEL = process.env.OPENAI_MODEL! ?? "gpt-5-nano";

export async function POST() {
  console.log("we got the key!")
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        message:
          "OpenAI API key missing. Populate OPENAI_API_KEY in your environment before running the connectivity test.",
      },
      { status: 500 },
    );
  }

  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  try {
    console.log("sendinguh")
    const response = await client.responses.create({
      model: OPENAI_MODEL,
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
