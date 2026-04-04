"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { VisitType } from "@/lib/database.types";
import {
  bookAppointment,
  fetchAvailableTimeSlots,
  type AvailableSlotRow,
} from "@/lib/supabase-appointments";
import { supabase } from "@/lib/supabase";

const inputClass =
  "mt-1.5 w-full border-0 border-b border-kinex-outline/35 bg-transparent pb-1.5 text-[15px] text-kinex-on-surface focus:border-kinex-primary focus:outline-none focus:ring-0";

export function BookAppointmentBlock() {
  const [slots, setSlots] = useState<AvailableSlotRow[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState("");
  const [visitType, setVisitType] = useState<VisitType>("clinic");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    const { data, error: sErr } = await fetchAvailableTimeSlots();
    if (sErr) setError(sErr.message);
    else {
      setError(null);
      const next = data ?? [];
      setSlots(next);
      setSlotId((prev) => {
        if (!next.length) return "";
        if (next.some((s) => s.id === prev)) return prev;
        return next[0].id;
      });
    }
    setLoadingSlots(false);
  }, []);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    void loadSlots();
    return () => subscription.unsubscribe();
  }, [loadSlots]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!userId) {
      setError("Please sign in to book.");
      return;
    }
    const picked = slots.find((s) => s.id === slotId);
    if (!picked) {
      setError("Choose an available time slot.");
      return;
    }
    setSubmitting(true);
    const { error: bookErr } = await bookAppointment({
      patientId: userId,
      doctorId: picked.doctor_id,
      timeSlotId: picked.id,
      type: visitType,
      meetingLink:
        visitType === "online" && meetingLink.trim()
          ? meetingLink.trim()
          : null,
      notes: notes.trim() || null,
    });
    setSubmitting(false);
    if (bookErr) {
      setError(bookErr.message);
      return;
    }
    setMessage("Appointment requested. You’ll see it in your patient dashboard.");
    setMeetingLink("");
    setNotes("");
    await loadSlots();
  }

  return (
    <section
      id="appointments"
      className="scroll-mt-[88px] bg-kinex-surface-low/40 px-6 py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[560px]">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-kinex-primary">
          Scheduling
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold text-kinex-on-surface md:text-3xl">
          Book an appointment
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-kinex-on-surface-variant">
          Pick an open slot from our verified doctors. Online visits can include
          a meeting link now or after confirmation.
        </p>

        {!userId ? (
          <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-kinex-outline/10 md:p-8">
            <p className="text-sm text-kinex-on-surface-variant">
              Sign in to complete booking.
            </p>
            <Button
              asChild
              className="mt-4 h-11 rounded-xl bg-kinex-primary text-white hover:bg-kinex-container"
            >
              <Link href="/auth?mode=login">Log in</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => void onSubmit(e)}
            className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-kinex-outline/10 md:p-8"
          >
            <div>
              <label
                htmlFor="book-slot"
                className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant"
              >
                Time slot
              </label>
              <select
                id="book-slot"
                name="time_slot_id"
                className={inputClass}
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                disabled={loadingSlots || slots.length === 0}
              >
                {slots.length === 0 ? (
                  <option value="">No open slots</option>
                ) : (
                  slots.map((s) => {
                    const name =
                      s.doctors?.profiles?.full_name ?? "Clinician";
                    const start = new Date(s.slot_start).toLocaleString();
                    return (
                      <option key={s.id} value={s.id}>
                        {name} — {start}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant">
                Visit type
              </span>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-kinex-on-surface">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="visit_type"
                    checked={visitType === "clinic"}
                    onChange={() => setVisitType("clinic")}
                    className="text-kinex-primary"
                  />
                  Clinic
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="visit_type"
                    checked={visitType === "online"}
                    onChange={() => setVisitType("online")}
                    className="text-kinex-primary"
                  />
                  Online
                </label>
              </div>
            </div>

            {visitType === "online" ? (
              <div>
                <label
                  htmlFor="book-meeting"
                  className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant"
                >
                  Meeting link (optional)
                </label>
                <input
                  id="book-meeting"
                  name="meeting_link"
                  type="url"
                  placeholder="https://…"
                  className={inputClass}
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            ) : null}

            <div>
              <label
                htmlFor="book-notes"
                className="text-xs font-bold uppercase tracking-wide text-kinex-on-surface-variant"
              >
                Notes (optional)
              </label>
              <input
                id="book-notes"
                name="notes"
                type="text"
                placeholder="Reason for visit"
                className={inputClass}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="text-sm font-medium text-kinex-primary" role="status">
                {message}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-kinex-primary text-[15px] font-semibold text-white hover:bg-kinex-container"
              disabled={submitting || slots.length === 0}
            >
              {submitting ? "Booking…" : "Book appointment"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
