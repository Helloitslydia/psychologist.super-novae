/*
  # Initial Schema for PsyBook Application

  1. New Tables
    - `profiles`
      - Stores user profile information for both patients and psychologists
      - Links to Supabase auth.users
      - Includes role (patient/psychologist) and basic info
    
    - `psychologists`
      - Stores detailed psychologist information
      - Links to profiles table
      - Includes professional details, rates, etc.
    
    - `specialties`
      - List of available specialties/expertise areas
    
    - `psychologist_specialties`
      - Junction table linking psychologists to their specialties
    
    - `time_slots`
      - Available appointment slots
      - Links to psychologists
    
    - `appointments`
      - Booked appointments
      - Links time slots to patients and psychologists
    
  2. Security
    - RLS enabled on all tables
    - Policies for proper data access control
    - Public profiles are readable by all
    - Private data only accessible to owners
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('patient', 'psychologist')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create psychologists table
CREATE TABLE IF NOT EXISTS psychologists (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  address text NOT NULL,
  postal_code text NOT NULL,
  description text NOT NULL,
  education text[],
  years_of_experience integer NOT NULL DEFAULT 0,
  hourly_rate decimal NOT NULL CHECK (hourly_rate > 0),
  photo_url text,
  consultation_type text[] DEFAULT ARRAY['in-person']::text[] CHECK (
    consultation_type <@ ARRAY['in-person', 'video', 'phone']::text[]
  ),
  languages text[] DEFAULT ARRAY['french']::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Psychologist profiles are viewable by everyone"
  ON psychologists FOR SELECT
  USING (true);

CREATE POLICY "Psychologists can update own profile"
  ON psychologists FOR UPDATE
  USING (auth.uid() = id);

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Specialties are viewable by everyone"
  ON specialties FOR SELECT
  USING (true);

-- Create psychologist_specialties junction table
CREATE TABLE IF NOT EXISTS psychologist_specialties (
  psychologist_id uuid REFERENCES psychologists(id) ON DELETE CASCADE,
  specialty_id uuid REFERENCES specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (psychologist_id, specialty_id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE psychologist_specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Psychologist specialties are viewable by everyone"
  ON psychologist_specialties FOR SELECT
  USING (true);

CREATE POLICY "Psychologists can manage their specialties"
  ON psychologist_specialties FOR ALL
  USING (auth.uid() = psychologist_id);

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id uuid NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_recurring boolean DEFAULT false,
  recurrence_rule text, -- iCal RRULE format for recurring slots
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT time_slots_end_time_check CHECK (end_time > start_time),
  CONSTRAINT time_slots_duration_check CHECK (
    EXTRACT(EPOCH FROM (end_time - start_time)) <= 7200 -- Max 2 hours
  )
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Time slots are viewable by everyone"
  ON time_slots FOR SELECT
  USING (true);

CREATE POLICY "Psychologists can manage their time slots"
  ON time_slots FOR ALL
  USING (auth.uid() = psychologist_id);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_slot_id uuid NOT NULL REFERENCES time_slots(id) ON DELETE RESTRICT,
  patient_id uuid NOT NULL REFERENCES profiles(id),
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  cancellation_reason text,
  cancelled_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Psychologists can view appointments for their time slots"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM time_slots
      WHERE time_slots.id = appointments.time_slot_id
      AND time_slots.psychologist_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (
    auth.uid() = patient_id OR
    EXISTS (
      SELECT 1 FROM time_slots
      WHERE time_slots.id = appointments.time_slot_id
      AND time_slots.psychologist_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_time_slots_psychologist_id ON time_slots(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_start_time ON time_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot_id ON appointments(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_psychologist_specialties_specialty_id ON psychologist_specialties(specialty_id);

-- Insert initial specialties
INSERT INTO specialties (name, description) VALUES
  ('Thérapie Cognitive Comportementale', 'Approche thérapeutique basée sur les pensées et comportements'),
  ('Anxiété', 'Traitement des troubles anxieux'),
  ('Dépression', 'Accompagnement pour la dépression'),
  ('Thérapie de couple', 'Consultation pour couples'),
  ('Burn-out', 'Accompagnement pour l''épuisement professionnel'),
  ('Stress', 'Gestion du stress'),
  ('Troubles alimentaires', 'Accompagnement des troubles du comportement alimentaire'),
  ('Traumatismes', 'Traitement des traumatismes psychologiques'),
  ('Addictions', 'Accompagnement des dépendances'),
  ('Thérapie familiale', 'Consultation pour familles')
ON CONFLICT (name) DO NOTHING;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_available_slots(
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_psychologist_id uuid DEFAULT NULL
)
RETURNS TABLE (
  slot_id uuid,
  psychologist_id uuid,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ts.id as slot_id,
    ts.psychologist_id,
    ts.start_time,
    ts.end_time
  FROM time_slots ts
  LEFT JOIN appointments a ON ts.id = a.time_slot_id
  WHERE
    ts.start_time >= p_start_date
    AND ts.end_time <= p_end_date
    AND (p_psychologist_id IS NULL OR ts.psychologist_id = p_psychologist_id)
    AND a.id IS NULL -- Only slots without appointments
  ORDER BY ts.start_time;
END;
$$;