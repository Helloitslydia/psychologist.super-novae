import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, Check, X as XIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ViewAppointmentsModalProps {
  onClose: () => void;
}

interface Appointment {
  id: string;
  status: string;
  patient_first_name: string;
  patient_whatsapp: string;
  consultation_status: string | null;
  time_slots: {
    start_time: string;
    end_time: string;
    psychologists: {
      profiles: {
        first_name: string;
        last_name: string;
      };
    };
  };
}

export function ViewAppointmentsModal({ onClose }: ViewAppointmentsModalProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            status,
            patient_first_name,
            patient_whatsapp,
            consultation_status,
            time_slots (
              start_time,
              end_time,
              psychologists (
                profiles (
                  first_name,
                  last_name
                )
              )
            )
          `)
          .order('time_slots(start_time)', { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.time_slots.start_time);
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return appointmentDate > now;
      case 'past':
        return appointmentDate <= now;
      default:
        return true;
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Liste des rendez-vous</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'upcoming'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'past'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Passés
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Chargement des rendez-vous...</div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Aucun rendez-vous trouvé</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const startTime = new Date(appointment.time_slots.start_time);
              const endTime = new Date(appointment.time_slots.end_time);
              const isPast = startTime <= new Date();

              return (
                <div
                  key={appointment.id}
                  className={`p-4 rounded-lg border ${
                    isPast ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-400" size={20} />
                        <span className="font-medium">
                          {startTime.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-gray-400" size={20} />
                        <span>
                          {startTime.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {' - '}
                          {endTime.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="text-gray-400" size={20} />
                        <span>
                          {appointment.patient_first_name} - {appointment.patient_whatsapp}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Psychologue: Dr. {appointment.time_slots.psychologists.profiles.first_name}{' '}
                          {appointment.time_slots.psychologists.profiles.last_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </span>
                      {isPast && appointment.consultation_status && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            appointment.consultation_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.consultation_status === 'partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.consultation_status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {appointment.consultation_status === 'completed'
                            ? 'Terminé'
                            : appointment.consultation_status === 'partial'
                            ? 'Partiel'
                            : appointment.consultation_status === 'cancelled'
                            ? 'Annulé'
                            : 'Non-présent'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}