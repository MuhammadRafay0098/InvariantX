"use client";

import { useEffect } from "react";

import ErrorState from "@/components/ui/ErrorState";

interface GlobalErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error("InvariantX route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center justify-center">
      <div className="w-full">
        <ErrorState
          title="Workspace unavailable"
          description="InvariantX could not load this workspace state. Your existing security data has not been changed."
          onRetry={reset}
          retryLabel="Retry workspace"
        />

        {error.digest ? (
          <p className="mt-3 text-center font-mono text-[10px] text-zinc-700">
            reference: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
