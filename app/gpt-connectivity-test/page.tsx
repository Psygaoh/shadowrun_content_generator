"use client";

import { useState, useTransition } from "react";

type ConnectivityResult = {
  message: string;
};

export default function GptConnectivityTestPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ConnectivityResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTestConnectivity = () => {
    startTransition(async () => {
      setErrorMessage(null);

      try {
        const response = await fetch("/api/gpt-connectivity-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Unexpected status: ${response.status}`);
        }

        const data = (await response.json()) as ConnectivityResult;
        setResult(data);
      } catch (error) {
        setResult(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unexpected error during connectivity test.",
        );
      }
    });
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 md:px-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          GPT Connectivity Test
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Trigger the placeholder backend call below. Once OpenAI integration is
          configured, this screen will reflect the live response from ChatGPT.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleTestConnectivity}
          disabled={isPending}
          className="cta-button-primary h-11 w-fit rounded-md px-6 text-sm font-semibold disabled:opacity-60"
        >
          {isPending ? "Contacting backend..." : "Run connectivity test"}
        </button>

        <div className="feature-card relative min-h-[160px] rounded-xl p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Screen
          </h2>
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : result ? (
            <pre className="whitespace-pre-wrap text-sm text-foreground">
              {result.message}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              Awaiting prompt execution. Click the button to request a response.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
