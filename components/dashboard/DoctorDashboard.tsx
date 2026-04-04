"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import {
  fetchDoctorAppointments,
  fetchDoctorRowForProfile,
} from "@/lib/supabase-appointments";
import { supabase } from "@/lib/supabase";

type DoctorAppointmentRow = {
  id: string;
  status: string;
  type: "online" | "clinic";
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  patient_id: string;
  time_slots: { slot_start: string; slot_end: string } | null;
  profiles: { full_name: string | null; phone: string | null } | null;
  medical_records: Array<{
    id: string;
    diagnosis: string | null;
    treatment_plan: string | null;
  }> | null;
};

function formatRange(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  return `${a.toLocaleString()} – ${b.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function DoctorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [rows, setRows] = useState<DoctorAppointmentRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async (docId: string) => {
    const { data, error: loadErr } = await fetchDoctorAppointments(docId);
    if (loadErr) setError(loadErr.message);
    else {
      setError(null);
      setRows((data as unknown as DoctorAppointmentRow[]) ?? []);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id;
      if (!uid) {
        router.replace("/auth?mode=login");
        return;
      }
      const { data: doc, error: docErr } = await fetchDoctorRowForProfile(uid);
      if (cancelled) return;
      if (docErr || !doc?.id) {
        setError(
          docErr?.message ??
            "No doctor profile is linked to this account. Ask an admin to create your doctor row."
        );
        setLoading(false);
        return;
      }
      setDoctorId(doc.id);
      await loadAppointments(doc.id);
      setLoading(false);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [router, loadAppointments]);

  useEffect(() => {
    if (!doctorId) return;

    const channel = supabase
      .channel(`appointments-doctor-${doctorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `doctor_id=eq.${doctorId}`,
        },
        () => {
          void loadAppointments(doctorId);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [doctorId, loadAppointments]);

  async function handleSignOut() {
    await signOut();
    router.replace("/auth?mode=login");
  }

  if (loading) {
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
            Doctor
          </p>
          <h1 className="text-2xl font-bold text-kinex-on-surface md:text-3xl">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-kinex-on-surface-variant">
            New bookings appear in real time.
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
        {rows.length === 0 && !error ? (
          <div className="rounded-2xl bg-white p-8 shadow-card ring-1 ring-kinex-outline/10">
            <p className="text-kinex-on-surface-variant">
              No appointments assigned yet.
            </p>
          </div>
        ) : null}
        {rows.map((appt) => {
          const patient = appt.profiles?.full_name ?? "Patient";
          const phone = appt.profiles?.phone;
          const slot = appt.time_slots;
          const records = appt.medical_records ?? [];

          return (
            <article
              key={appt.id}
              className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-kinex-outline/10 md:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold text-kinex-on-surface">
                  {patient}
                </h2>
                <span className="text-xs font-bold uppercase tracking-wide text-kinex-muted">
                  {appt.status}
                </span>
              </div>
              {phone ? (
                <p className="mt-1 text-sm text-kinex-on-surface-variant">
                  {phone}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-kinex-on-surface-variant">
                {appt.type === "online" ? "Online" : "Clinic"}
              </p>
              {slot ? (
                <p className="mt-2 text-sm text-kinex-on-surface">
                  {formatRange(slot.slot_start, slot.slot_end)}
                </p>
              ) : null}
              {appt.meeting_link ? (
                <a
                  href={appt.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-kinex-primary hover:text-kinex-container"
                >
                  Meeting link
                </a>
              ) : null}
              {records.length > 0 ? (
                <ul className="mt-4 space-y-2 border-t border-kinex-outline/15 pt-4 text-sm text-kinex-on-surface-variant">
                  {records.map((r) => (
                    <li key={r.id}>
                      {r.diagnosis ?? r.treatment_plan ?? "Record on file"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
