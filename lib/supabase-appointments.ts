import { supabase } from "@/lib/supabase";
import type { VisitType } from "@/lib/database.types";

export async function fetchProfileRole(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", userId)
    .maybeSingle();
  return { data, error };
}

export async function fetchDoctorRowForProfile(profileId: string) {
  const { data, error } = await supabase
    .from("doctors")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();
  return { data, error };
}

/** Patient dashboard: appointments + doctor full_name + medical_records. */
export async function fetchPatientAppointments(patientId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      status,
      type,
      meeting_link,
      notes,
      created_at,
      time_slots ( slot_start, slot_end ),
      doctors (
        id,
        profiles ( full_name )
      ),
      medical_records (
        id,
        diagnosis,
        treatment_plan,
        created_at
      )
    `
    )
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  return { data, error };
}

/** Doctor dashboard: appointments for this doctor with patient profile + slot + records. */
export async function fetchDoctorAppointments(doctorId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      status,
      type,
      meeting_link,
      notes,
      created_at,
      patient_id,
      time_slots ( slot_start, slot_end ),
      profiles ( full_name, phone ),
      medical_records (
        id,
        diagnosis,
        treatment_plan,
        created_at
      )
    `
    )
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function fetchUnverifiedDoctors() {
  const { data, error } = await supabase
    .from("doctors")
    .select(
      `
      id,
      profile_id,
      specialization,
      experience_years,
      license_number,
      created_at,
      profiles ( full_name, phone )
    `
    )
    .eq("is_verified", false)
    .order("created_at", { ascending: true });
  return { data, error };
}

export async function verifyDoctor(doctorId: string) {
  return await supabase
    .from("doctors")
    .update({ is_verified: true, updated_at: new Date().toISOString() })
    .eq("id", doctorId)
    .select("id")
    .maybeSingle();
}

export type AvailableSlotRow = {
  id: string;
  slot_start: string;
  slot_end: string;
  doctor_id: string;
  doctors: {
    id: string;
    profiles: { full_name: string | null } | null;
  } | null;
};

export async function fetchAvailableTimeSlots() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("time_slots")
    .select(
      `
      id,
      slot_start,
      slot_end,
      doctor_id,
      doctors (
        id,
        profiles ( full_name )
      )
    `
    )
    .eq("is_booked", false)
    .gt("slot_start", now)
    .order("slot_start", { ascending: true });
  return { data: data as AvailableSlotRow[] | null, error };
}

export async function bookAppointment(params: {
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  type: VisitType;
  meetingLink?: string | null;
  notes?: string | null;
}) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_id: params.patientId,
      doctor_id: params.doctorId,
      time_slot_id: params.timeSlotId,
      type: params.type,
      status: "pending",
      meeting_link: params.meetingLink ?? null,
      notes: params.notes ?? null,
    })
    .select("id")
    .single();

  if (error) return { data: null, error };

  const { error: slotError } = await supabase
    .from("time_slots")
    .update({ is_booked: true })
    .eq("id", params.timeSlotId);

  if (slotError) return { data, error: slotError };

  return { data, error: null };
}
