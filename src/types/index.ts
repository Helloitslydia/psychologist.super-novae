export interface Psychologist {
  id: string;
  name: string;
  specialties: string[];
  photo: string;
  description: string;
  languages?: string[];
}

export interface TimeSlot {
  id: string;
  psychologistId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  psychologistId: string;
  patientId: string;
  timeSlotId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  consultation_status?: 'completed' | 'partial' | 'cancelled' | 'no_show';
  consultation_summary?: string;
  satisfaction_feedback?: string;
  notes?: string;
}