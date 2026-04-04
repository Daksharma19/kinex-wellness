"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Apple } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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

        <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-wider text-kinex-muted">
          Access with
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-xl border-0 bg-kinex-surface-low text-[13px] font-semibold text-kinex-on-surface hover:bg-[#e8eaec]"
          >
            <GoogleMark className="h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-xl border-0 bg-kinex-surface-low text-[13px] font-semibold text-kinex-on-surface hover:bg-[#e8eaec]"
          >
            <Apple className="h-4 w-4" />
            Apple
          </Button>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-kinex-outline/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-kinex-muted">
              Or continue with email
            </span>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          {mode === "signup" ? (
            <div>
              <label
                htmlFor="auth-name"
                className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant"
              >
                Full name
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Dr. Jane Smith"
                className="mt-1.5 w-full border-0 border-b border-kinex-outline/35 bg-transparent pb-1.5 text-[15px] text-kinex-on-surface placeholder:text-kinex-muted/80 focus:border-kinex-primary focus:outline-none focus:ring-0"
              />
            </div>
          ) : null}

          <div>
            <label
              htmlFor="auth-email"
              className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant"
            >
              Email address
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@clinic.com"
              className="mt-1.5 w-full border-0 border-b border-kinex-outline/35 bg-transparent pb-1.5 text-[15px] text-kinex-on-surface placeholder:text-kinex-muted/80 focus:border-kinex-primary focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label
                htmlFor="auth-password"
                className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant"
              >
                Password
              </label>
              {mode === "login" ? (
                <Link
                  href="#forgot-password"
                  className="text-xs font-semibold text-kinex-primary hover:text-kinex-container"
                >
                  Forgot Password?
                </Link>
              ) : null}
            </div>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              placeholder="••••••••"
              className="mt-1.5 w-full border-0 border-b border-kinex-outline/35 bg-transparent pb-1.5 text-[15px] text-kinex-on-surface placeholder:text-kinex-muted/80 focus:border-kinex-primary focus:outline-none focus:ring-0"
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-kinex-primary text-[15px] font-semibold text-white hover:bg-kinex-container"
          >
            {mode === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>
      </div>

      
    </>
  );
}
