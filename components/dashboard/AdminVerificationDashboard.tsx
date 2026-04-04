"use client";

import { useAuth } from "@clerk/nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseWithClerkJwt } from "@/lib/supabase-clerk";
import {
  fetchUnverifiedDoctors,
  verifyDoctor,
} from "@/lib/supabase-appointments";

type UnverifiedRow = {
  id: string;
  profile_id: string;
  specialization: string[] | null;
  experience_years: number | null;
  license_number: string | null;
  created_at: string;
  profiles: { full_name: string | null; phone: string | null } | null;
};

export function AdminVerificationDashboard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UnverifiedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [sb, setSb] = useState<SupabaseClient | null>(null);

  const load = useCallback(async () => {
    if (!isSignedIn || !userId) {
      router.replace("/auth?mode=login");
      return;
    }
    const token =
      (await getToken({ template: "supabase" })) ?? (await getToken());
    const client = createSupabaseWithClerkJwt(token);
    setSb(client);
    const { data, error: qErr } = await fetchUnverifiedDoctors(client);
    if (qErr) setError(qErr.message);
    else {
      setError(null);
      setRows((data as unknown as UnverifiedRow[]) ?? []);
    }
    setLoading(false);
  }, [router, isSignedIn, userId, getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    void load();
  }, [load, isLoaded]);

  async function handleVerify(doctorId: string) {
    if (!sb) return;
    setBusyId(doctorId);
    const { error: upErr } = await verifyDoctor(doctorId, sb);
    setBusyId(null);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== doctorId));
  }

  async function handleSignOut() {
    await signOut({ redirectUrl: "/auth?mode=login" });
  }

  if (!isLoaded || loading) {
    return (
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-white/60 shadow-card ring-1 ring-kinex-outline/10" />
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-sm font-semibold text-kinex-primary hover:text-kinex-container"
          >
            ← Kinex home
          </Link>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-kinex-primary">
            Head doctor / Admin
          </p>
          <h1 className="text-2xl font-bold text-kinex-on-surface md:text-3xl">
            Verify clinicians
          </h1>
          <p className="mt-1 text-sm text-kinex-on-surface-variant">
            Approve doctor profiles before they appear for booking.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-xl border-0 bg-kinex-surface-low text-kinex-on-surface hover:bg-[#e8eaec]"
          onClick={() => void handleSignOut()}
        >
          Sign out
        </Button>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-4">
        {rows.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-card ring-1 ring-kinex-outline/10">
            <p className="text-kinex-on-surface-variant">
              No pending doctor verifications.
            </p>
          </div>
        ) : (
          rows.map((row) => {
            const name = row.profiles?.full_name ?? "Unknown";
            const specs = row.specialization?.join(", ") ?? "—";
            return (
              <article
                key={row.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-kinex-outline/10 sm:flex-row sm:items-center sm:justify-between md:p-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-kinex-on-surface">
                    {name}
                  </h2>
                  {row.profiles?.phone ? (
                    <p className="text-sm text-kinex-on-surface-variant">
                      {row.profiles.phone}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm text-kinex-on-surface-variant">
                    <span className="font-semibold text-kinex-on-surface">
                      Specialization:{" "}
                    </span>
                    {specs}
                  </p>
                  {row.license_number ? (
                    <p className="text-sm text-kinex-on-surface-variant">
                      License: {row.license_number}
                    </p>
                  ) : null}
                </div>
                <Button
                  className="h-11 shrink-0 rounded-xl bg-kinex-primary text-white hover:bg-kinex-container"
                  disabled={busyId === row.id}
                  onClick={() => void handleVerify(row.id)}
                >
                  {busyId === row.id ? "Approving…" : "Approve"}
                </Button>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
