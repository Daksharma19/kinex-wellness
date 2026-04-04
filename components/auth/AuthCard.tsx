"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

const clerkAppearance = {
  variables: {
    colorPrimary: "#005F5F",
    colorText: "#111827",
    colorTextSecondary: "#6b7280",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "shadow-none border-0 bg-transparent",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "rounded-xl border-0 bg-[#f0f2f5] text-[13px] font-semibold hover:bg-[#e8eaec]",
    formButtonPrimary:
      "rounded-xl bg-[#005F5F] hover:bg-[#004747] text-[15px] font-semibold",
    footerAction: "hidden",
    footer: "hidden",
  },
} as const;

export function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode: AuthMode = useMemo(() => {
    const m = searchParams.get("mode");
    return m === "signup" ? "signup" : "login";
  }, [searchParams]);

  const setMode = useCallback(
    (next: AuthMode) => {
      router.replace(`/auth?mode=${next}`, { scroll: false });
    },
    [router]
  );

  return (
    <>
      <div className="relative w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-card ring-1 ring-kinex-outline/10 md:p-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-kinex-primary">
          Clinical Sanctuary
        </p>
        <p className="mt-0.5 text-center text-xl font-bold text-kinex-primary md:text-2xl">
          Kinex
        </p>

        <div
          className="relative mt-5 flex rounded-full bg-kinex-surface-low p-1"
          role="tablist"
          aria-label="Account access"
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-white shadow-md shadow-kinex-primary/10 ring-1 ring-black/[0.04] transition-all duration-300 ease-out",
              mode === "login" ? "left-1 right-auto" : "left-auto right-1"
            )}
            aria-hidden
          />
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={cn(
              "relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-200",
              mode === "login"
                ? "text-kinex-on-surface"
                : "text-kinex-muted hover:text-kinex-on-surface-variant"
            )}
            onClick={() => setMode("login")}
          >
            Log In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={cn(
              "relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-200",
              mode === "signup"
                ? "text-kinex-on-surface"
                : "text-kinex-muted hover:text-kinex-on-surface-variant"
            )}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="mt-4 min-h-[380px]">
          {mode === "login" ? (
            <SignIn
              routing="virtual"
              signUpUrl="/auth?mode=signup"
              forceRedirectUrl="/dashboard/patient"
              appearance={clerkAppearance}
            />
          ) : (
            <SignUp
              routing="virtual"
              signInUrl="/auth?mode=login"
              forceRedirectUrl="/dashboard/patient"
              appearance={clerkAppearance}
            />
          )}
        </div>

        <div className="mt-5 border-t border-kinex-outline/15 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="h-10 w-full rounded-xl border border-kinex-outline/25 bg-kinex-surface-low text-[13px] font-semibold text-kinex-on-surface hover:bg-[#e8eaec]"
            onClick={() => router.push("/dashboard/patient")}
          >
            Open patient dashboard
          </Button>
        </div>
      </div>
    </>
  );
}
