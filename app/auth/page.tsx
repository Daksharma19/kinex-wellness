import { Suspense } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/layout/AuthFooter";
import { Navbar } from "@/components/layout/Navbar";

function AuthCardFallback() {
  return (
    <div className="h-[460px] w-full max-w-[440px] animate-pulse rounded-2xl bg-white/60 shadow-card ring-1 ring-kinex-outline/10" />
  );
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/40 to-sky-50/30">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[min(520px,70vw)] w-[min(520px,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-teal-200/20 blur-3xl"
          aria-hidden
        />

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6 md:py-10">
          <Suspense fallback={<AuthCardFallback />}>
            <AuthCard />
          </Suspense>
        </main>

        <AuthFooter />
      </div>
    </div>
  );
}
