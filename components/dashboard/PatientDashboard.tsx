"use client";

import {
  Bell,
  Calendar,
  CalendarDays,
  Clock,
  Download,
  FileText,
  Filter,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquare,
  Pill,
  Scan,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Wallet,
  HelpCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";

import { useAuth } from "@clerk/nextjs";

import { KINEX_LOCATION } from "@/lib/contact";
import { createSupabaseWithClerkJwt } from "@/lib/supabase-clerk";
import {
  fetchPatientAppointments,
  fetchProfileRole,
} from "@/lib/supabase-appointments";

const TEAL = "#005F5F";
const TEAL_SOFT = "rgba(0, 95, 95, 0.12)";
const BADGE_GREEN = "#e8f5f0";
const BADGE_GREEN_TEXT = "#0d7a5c";

type AppointmentRow = {
  id: string;
  status: string;
  type: "online" | "clinic";
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  time_slots: { slot_start: string; slot_end: string } | null;
  doctors: { profiles: { full_name: string | null } | null } | null;
  medical_records: Array<{
    id: string;
    diagnosis: string | null;
    treatment_plan: string | null;
    created_at: string | null;
  }> | null;
};

function formatApptWhen(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
        active
          ? "bg-white font-semibold shadow-sm ring-1 ring-black/[0.04]"
          : "text-[#6b7280] hover:bg-white/60 hover:text-[#374151]"
      }`}
      style={active ? { color: TEAL } : undefined}
    >
      <Icon
        className="h-5 w-5 shrink-0"
        style={active ? { color: TEAL } : { color: "#9ca3af" }}
      />
      {label}
    </button>
  );
}

function ActionCard({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: TEAL_SOFT }}
      >
        <Icon className="h-6 w-6" style={{ color: TEAL }} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-[#111827]">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-[#6b7280]">{subtitle}</span>
      </span>
    </button>
  );
}

export function PatientDashboard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const busy = !isLoaded || loading;

  const load = useCallback(async () => {
    if (!isSignedIn || !userId) {
      router.replace("/auth?mode=login");
      return;
    }
    const token =
      (await getToken({ template: "supabase" })) ?? (await getToken());
    const client = createSupabaseWithClerkJwt(token);
    const [profileRes, apptRes] = await Promise.all([
      fetchProfileRole(userId, client),
      fetchPatientAppointments(userId, client),
    ]);
    if (profileRes.error) setFetchError(profileRes.error.message);
    else if (apptRes.error) setFetchError(apptRes.error.message);
    else setFetchError(null);
    const name = profileRes.data?.full_name ?? "there";
    setPatientName(name);
    setAppointments((apptRes.data as unknown as AppointmentRow[]) ?? []);
    setLoading(false);
  }, [router, isSignedIn, userId, getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    void load();
  }, [load, isLoaded]);

  const { nextAppointment, historyRows } = useMemo(() => {
    const now = Date.now();
    const withSlot = appointments.filter((a) => a.time_slots?.slot_start);
    const upcoming = withSlot
      .filter((a) => new Date(a.time_slots!.slot_start).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.time_slots!.slot_start).getTime() -
          new Date(b.time_slots!.slot_start).getTime()
      );
    const next = upcoming[0] ?? withSlot[0] ?? null;
    const history = [...appointments].sort((a, b) => {
      const ta = a.time_slots?.slot_start
        ? new Date(a.time_slots.slot_start).getTime()
        : 0;
      const tb = b.time_slots?.slot_start
        ? new Date(b.time_slots.slot_start).getTime()
        : 0;
      return tb - ta;
    });
    return { nextAppointment: next, historyRows: history };
  }, [appointments]);

  const firstName = patientName?.split(/\s+/)[0] ?? "…";

  async function handleLogout() {
    await signOut({ redirectUrl: "/auth?mode=login" });
  }

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ backgroundColor: "#f0f2f5" }}
    >
      <aside className="fixed bottom-0 left-0 top-0 z-20 flex w-[248px] flex-col border-r border-[#e8eaed] bg-[#f7f8fa] px-4 pb-6 pt-6">
        <div className="mb-8 flex h-11 items-center px-2">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: TEAL }}
          >
            Kinex
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Calendar} label="Appointments" />
          <NavItem icon={FileText} label="Records" />
          <NavItem icon={MessageSquare} label="Messages" />
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-[#e8eaed] pt-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#6b7280] hover:bg-white/60"
          >
            <HelpCircle className="h-5 w-5 text-[#9ca3af]" />
            Help Center
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#6b7280] hover:bg-white/60"
          >
            <LogOut className="h-5 w-5 text-[#9ca3af]" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-[248px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between gap-6 border-b border-[#e8eaed] bg-[#f0f2f5]/95 px-8 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-3xl flex-1 justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="search"
                placeholder="Search records or doctors..."
                className="h-11 w-full rounded-full border border-[#e5e7eb] bg-white pl-11 pr-4 text-sm text-[#111827] shadow-sm placeholder:text-[#9ca3af] focus:border-[#005F5F] focus:outline-none focus:ring-2 focus:ring-[#005F5F]/20"
                aria-label="Search records or doctors"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-white"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="ml-1 h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm"
              aria-label="Account"
            >
              <span
                className="flex h-full w-full items-center justify-center text-sm font-semibold text-white uppercase"
                style={{ backgroundColor: TEAL }}
              >
                {busy
                  ? "…"
                  : (firstName.replace(/\W/g, "")[0] ?? "?").toUpperCase()}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          {fetchError ? (
            <p
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {fetchError}
            </p>
          ) : null}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color: TEAL }}
              >
                Patient overview
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111827] md:text-[28px]">
                Welcome back, {busy ? "…" : firstName}.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6b7280]">
                Here is a snapshot of your health and upcoming care. Everything
                looks on track—reach out anytime you have questions.
              </p>
            </div>
            <Link
              href="/#appointments"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95"
              style={{ backgroundColor: TEAL }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-lg leading-none">
                +
              </span>
              Book New Appointment
            </Link>
          </div>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row">
            <ActionCard
              icon={MessageCircle}
              title="Message Doctor"
              subtitle="Send a secure note to your care team"
            />
            <ActionCard
              icon={Pill}
              title="Refill Prescription"
              subtitle="Request renewals for active medications"
            />
            <ActionCard
              icon={Wallet}
              title="Pay Statement"
              subtitle="View and pay your latest balance"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
              <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-baseline justify-between">
                  <h2 className="text-base font-bold text-[#111827]">
                    Recent Vitals
                  </h2>
                  <span className="text-xs text-[#9ca3af]">
                    Last updated 2h ago
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: TEAL_SOFT }}
                      >
                        <Heart
                          className="h-5 w-5"
                          style={{ color: TEAL }}
                          aria-hidden
                        />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#374151]">
                          Heart Rate
                        </p>
                        <p className="text-sm font-semibold text-[#111827]">
                          72 bpm
                        </p>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: BADGE_GREEN,
                        color: BADGE_GREEN_TEXT,
                      }}
                    >
                      Stable
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: TEAL_SOFT }}
                      >
                        <ShieldCheck
                          className="h-5 w-5"
                          style={{ color: TEAL }}
                          aria-hidden
                        />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#374151]">
                          Blood Pressure
                        </p>
                        <p className="text-sm font-semibold text-[#111827]">
                          118/76 mmHg
                        </p>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: BADGE_GREEN,
                        color: BADGE_GREEN_TEXT,
                      }}
                    >
                      Optimal
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: TEAL_SOFT }}
                      >
                        <Scale
                          className="h-5 w-5"
                          style={{ color: TEAL }}
                          aria-hidden
                        />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#374151]">
                          Weight
                        </p>
                        <p className="text-sm font-semibold text-[#111827]">
                          68.4 kg
                        </p>
                      </div>
                    </div>
                    <svg
                      width="56"
                      height="24"
                      viewBox="0 0 56 24"
                      className="shrink-0 text-[#005F5F]"
                      aria-hidden
                    >
                      <path
                        d="M2 18 L12 14 L22 16 L32 8 L42 10 L54 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-[#111827]">
                  Latest Reports
                </h2>
                <ul className="space-y-3">
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-3 text-left transition-colors hover:border-[#e5e7eb] hover:bg-[#f9fafb]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#111827]">
                          Complete Blood Count
                        </span>
                        <span className="mt-0.5 block text-xs text-[#6b7280]">
                          Mar 12, 2026 · Lab Services
                        </span>
                      </span>
                      <Download className="h-5 w-5 shrink-0 text-[#9ca3af]" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-3 text-left transition-colors hover:border-[#e5e7eb] hover:bg-[#f9fafb]"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: TEAL_SOFT }}
                      >
                        <Scan
                          className="h-5 w-5"
                          style={{ color: TEAL }}
                          aria-hidden
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#111827]">
                          Chest X-Ray
                        </span>
                        <span className="mt-0.5 block text-xs text-[#6b7280]">
                          Feb 28, 2026 · Imaging Center
                        </span>
                      </span>
                      <Download className="h-5 w-5 shrink-0 text-[#9ca3af]" />
                    </button>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <Link
                    href="#"
                    className="text-sm font-semibold"
                    style={{ color: TEAL }}
                  >
                    View All Records
                  </Link>
                </div>
              </section>
            </div>

            <div className="space-y-6 xl:col-span-5">
              <section
                className="overflow-hidden rounded-2xl p-6 text-white shadow-lg"
                style={{ backgroundColor: TEAL }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                  Next appointment
                </p>
                {busy ? (
                  <p className="mt-3 text-sm text-white/90">Loading…</p>
                ) : !nextAppointment?.time_slots ? (
                  <>
                    <h3 className="mt-2 text-xl font-bold">No visits scheduled</h3>
                    <p className="mt-1 text-sm text-white/90">
                      Book a slot when you&apos;re ready.
                    </p>
                    <Link
                      href="/#appointments"
                      className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-3.5 text-sm font-bold text-[#005F5F] shadow-md transition-opacity hover:opacity-95"
                    >
                      Book appointment
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="mt-2 text-xl font-bold">
                      {nextAppointment.type === "online"
                        ? "Online visit"
                        : "Clinic visit"}
                    </h3>
                    <p className="mt-1 text-sm text-white/90">
                      {nextAppointment.doctors?.profiles?.full_name ??
                        "Your clinician"}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-6 text-sm">
                      <span className="inline-flex items-center gap-2 text-white/95">
                        <CalendarDays className="h-4 w-4 shrink-0 opacity-90" />
                        {
                          formatApptWhen(nextAppointment.time_slots.slot_start)
                            .date
                        }
                      </span>
                      <span className="inline-flex items-center gap-2 text-white/95">
                        <Clock className="h-4 w-4 shrink-0 opacity-90" />
                        {
                          formatApptWhen(nextAppointment.time_slots.slot_start)
                            .time
                        }
                      </span>
                    </div>
                    {nextAppointment.type === "online" ? (
                      nextAppointment.meeting_link ? (
                        <a
                          href={nextAppointment.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-[#005F5F] shadow-md transition-opacity hover:opacity-95"
                        >
                          <Video className="h-5 w-5" />
                          Join video call
                        </a>
                      ) : (
                        <p className="mt-4 text-sm text-white/85">
                          Meeting link will appear when your visit is confirmed.
                        </p>
                      )
                    ) : (
                      <div className="mt-4 rounded-xl bg-white/10 p-4 text-sm text-white/95">
                        <p className="font-semibold">{KINEX_LOCATION.shortLabel}</p>
                        <p className="mt-1 text-white/85">
                          {KINEX_LOCATION.street}, {KINEX_LOCATION.city}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-wide text-white/70">
                          Status: {nextAppointment.status}
                        </p>
                        <Link
                          href="/contact"
                          className="mt-3 inline-block text-sm font-bold underline-offset-4 hover:underline"
                        >
                          Directions & contact
                        </Link>
                      </div>
                    )}
                    <Link
                      href="/#appointments"
                      className="mt-3 block w-full text-center text-sm font-semibold text-white/95 underline-offset-4 hover:underline"
                    >
                      Book another visit
                    </Link>
                  </>
                )}
              </section>

              <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#111827]">
                    Appointment History
                  </h2>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6]"
                    aria-label="Filter"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
                <ul className="space-y-3">
                  {busy ? (
                    <li className="rounded-xl border border-[#f3f4f6] bg-[#fafafa] p-4 text-sm text-[#6b7280]">
                      Loading history…
                    </li>
                  ) : historyRows.length === 0 ? (
                    <li className="rounded-xl border border-[#f3f4f6] bg-[#fafafa] p-4 text-sm text-[#6b7280]">
                      No appointments yet.
                    </li>
                  ) : (
                    historyRows.map((row) => {
                      const doctor =
                        row.doctors?.profiles?.full_name ?? "Clinician";
                      const when = row.time_slots?.slot_start
                        ? formatApptWhen(row.time_slots.slot_start)
                        : null;
                      const record = row.medical_records?.[0];
                      const title =
                        row.type === "online" ? "Online visit" : "Clinic visit";
                      return (
                        <li
                          key={row.id}
                          className="flex items-start gap-3 rounded-xl border border-[#f3f4f6] bg-[#fafafa] p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-[#111827]">
                                {title}
                              </span>
                              {when ? (
                                <span className="text-xs text-[#9ca3af]">
                                  {when.date} · {when.time}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-xs text-[#6b7280]">
                              {doctor}
                              {record?.diagnosis
                                ? ` · ${record.diagnosis}`
                                : record?.treatment_plan
                                  ? ` · ${record.treatment_plan}`
                                  : ""}
                            </p>
                            <span className="mt-2 inline-block rounded-md bg-[#e5e7eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
                              {row.status}
                            </span>
                          </div>
                          <span
                            className="shrink-0 rounded-lg p-2 text-[#9ca3af]"
                            aria-hidden
                          >
                            <FileText className="h-5 w-5" />
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
