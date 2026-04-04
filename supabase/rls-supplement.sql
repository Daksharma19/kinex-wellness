-- Run in Supabase SQL editor if booking / slots fail under RLS.
-- Your base schema already enables RLS; these policies allow the wired UI to work.

-- Time slots: list availability and mark booked after a patient books
CREATE POLICY "Anyone can view time slots"
ON time_slots FOR SELECT
USING (true);

CREATE POLICY "Patients can book an open slot"
ON time_slots FOR UPDATE
USING (is_booked = false)
WITH CHECK (is_booked = true);

-- Appointments: patient creates their own rows
CREATE POLICY "Patients can insert own appointments"
ON appointments FOR INSERT
WITH CHECK (patient_id = auth.uid());

-- Doctors: patients need to read verified doctors (nested under time_slots); admins need unverified too.
CREATE POLICY "Read verified doctors"
ON doctors FOR SELECT
USING (is_verified = true);

CREATE POLICY "Admins read all doctors"
ON doctors FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Medical records (patient dashboard join)
CREATE POLICY "Patients read own medical records"
ON medical_records FOR SELECT
USING (patient_id = auth.uid());

CREATE POLICY "Doctors read records for their appointments"
ON medical_records FOR SELECT
USING (
  doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
);

-- Realtime: in Dashboard → Database → Replication, enable `appointments` for supabase_realtime.
