import React, { useEffect, useContext } from 'react';
import { Calendar, Clock, User, Settings, Star, LogOut, Link, Globe } from 'lucide-react';
import type { Appointment, TimeSlot } from '../types';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from './ToastProvider';
import { useDashboardLanguage } from '../context/DashboardLanguageContext';
import { ProfileSettings } from './ProfileSettings';
import { ConsultationDetailsModal } from './ConsultationDetailsModal';
import { ManualAppointmentModal } from './ManualAppointmentModal';
import { BiweeklyReportModal } from './BiweeklyReportModal';
import { ContentManagementModal } from './ContentManagementModal';
import { useState } from 'react';

interface User {
  id: string;
}

export function PsychologistDashboard() {
  const { showToast } = useContext(ToastContext);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showManualAppointment, setShowManualAppointment] = useState(false);
  const [showBiweeklyReport, setShowBiweeklyReport] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [contents, setContents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  
  // Get past appointments sorted by date
  const pastAppointments = appointments
    .filter(appointment => new Date(appointment.time_slots.start_time) < new Date())
    .sort((a, b) => new Date(b.time_slots.start_time).getTime() - new Date(a.time_slots.start_time).getTime());

  // Get current page appointments
  const currentAppointments = pastAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('17:00');
  const [slotDuration, setSlotDuration] = React.useState(60); // durée en minutes
  const [breakInterval, setBreakInterval] = React.useState(15); // pause en minutes

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);

      // Get today's date boundaries in ISO format
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      const { data: slots } = await supabase
        .from('time_slots')
        .select('*')
        .eq('psychologist_id', user.id);

      const { data: appts } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          time_slot_id,
          patient_id,
          consultation_status,
          consultation_summary,
          satisfaction_feedback,
          time_slots!inner(start_time, end_time, psychologist_id),
          profiles!appointments_patient_id_fkey(first_name, last_name, phone)
        `)
        .eq('time_slots.psychologist_id', user.id);

      console.log('Fetched appointments:', appts);
      console.log('Date range:', {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString()
      });

      if (slots) setTimeSlots(slots);
      if (appts) setAppointments(appts);
      setLoading(false);
      
      // Fetch biweekly reports
      const { data: reportsData } = await supabase
        .from('biweekly_reports')
        .select('*')
        .eq('psychologist_id', user.id)
        .order('period_start', { ascending: false });

      if (reportsData) setReports(reportsData);
      
      // Fetch content
      const { data: contentData } = await supabase
        .from('psychologist_content')
        .select('*')
        .eq('psychologist_id', user.id)
        .order('created_at', { ascending: false });

      if (contentData) setContents(contentData);

      // Calculate average rating
      const completedAppointments = appts?.filter(a => 
        a.consultation_status === 'completed' && 
        typeof a.satisfaction_rating === 'number'
      ) || [];
      
      if (completedAppointments.length > 0) {
        const totalRating = completedAppointments.reduce(
          (sum, app) => sum + (app.satisfaction_rating || 0), 
          0
        );
        setAverageRating(totalRating / completedAppointments.length);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddTimeSlot = async () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, startHours, startMinutes);
    const endDate = new Date(year, month - 1, day, endHours, endMinutes);

    // Validate time slot
    if (endDate <= startDate) {
      showToast('L\'heure de fin doit être après l\'heure de début', 'error');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data: psychologists } = await supabase
        .from('psychologists')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!psychologists) {
        showToast('Profil de psychologue non trouvé. Veuillez vous reconnecter.', 'error');
        navigate('/login');
        return;
      }

      // Générer tous les créneaux
      const slots = [];
      let currentStart = startDate;
      
      while (currentStart.getTime() + (slotDuration * 60 * 1000) <= endDate.getTime()) {
        const slotEnd = new Date(currentStart.getTime() + (slotDuration * 60 * 1000));
        
        slots.push({
          psychologist_id: psychologists.id,
          start_time: currentStart.toISOString(),
          end_time: slotEnd.toISOString()
        });

        // Ajouter la pause au temps de début du prochain créneau
        currentStart = new Date(slotEnd.getTime() + (breakInterval * 60 * 1000));
      }

      if (slots.length === 0) {
        showToast('Aucun créneau n\'a pu être créé avec ces paramètres. Veuillez ajuster la durée ou l\'intervalle de pause.', 'error');
        return;
      }

      // Insérer tous les créneaux
      const { data: newSlots, error } = await supabase
        .from('time_slots')
        .insert(slots)
        .select();

      if (error) {
        console.error('Error adding time slot:', error);
        showToast('Erreur lors de la création du créneau : ' + error.message, 'error');
        return;
      }

      if (newSlots) {
        setTimeSlots(prev => [...prev, ...newSlots]);
        showToast(`${newSlots.length} créneaux ont été ajoutés avec succès !`, 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Une erreur est survenue lors de la création du créneau', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Header with menu */}
        <div className="md:col-span-3 bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <Settings size={20} />
                <span>Paramètres</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-800"
              >
                <LogOut size={20} />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ajouter des disponibilités</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée du rendez-vous (minutes)
                  </label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={90}>1 heure 30</option>
                    <option value={120}>2 heures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pause entre les RDV (minutes)
                  </label>
                  <input
                    type="number"
                    value={breakInterval}
                    onChange={(e) => setBreakInterval(Math.max(0, Math.min(60, Number(e.target.value))))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    min="0"
                    max="60"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    step="1800"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    step="1800"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>
              <button
                onClick={handleAddTimeSlot}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Mes rendez-vous</h2>
              <div className="flex gap-2">
                <span className="text-sm text-gray-500">
                  {appointments.filter(a => new Date(a.time_slots.start_time) >= new Date()).length} à venir
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {appointments.filter(a => new Date(a.time_slots.start_time) < new Date()).length} passés
                </span>
              </div>
            </div>
            
            {/* Rendez-vous à venir */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-700">À venir</h3>
              <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun rendez-vous à venir
                </div>
              ) : (
                appointments
                .filter(appointment => new Date(appointment.time_slots.start_time) >= new Date())
                .sort((a, b) => new Date(a.time_slots.start_time).getTime() - new Date(b.time_slots.start_time).getTime())
                .map((appointment: any) => {
                  const timeSlot = appointment.time_slots;
                  const patient = appointment.profiles;
                  const appointmentDate = new Date(timeSlot.start_time);

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <User className="text-gray-400 flex-shrink-0" />
                        <div>
                          {patient ? (
                            <div className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </div>
                          ) : (
                            <div className="font-medium text-gray-500">
                              {appointment.notes?.split('\n')[0]?.replace('Patient: ', '') || 'Patient sans profil'}
                            </div>
                          )}
                          <div className="text-sm text-gray-500 space-y-1">
                            {patient ? (
                              <div>
                                WhatsApp: {patient.phone}
                              </div>
                            ) : (
                              <div>
                                {appointment.notes?.split('\n')[1] || 'Aucun numéro'}
                              </div>
                            )}
                            <div>
                              {appointmentDate.toLocaleString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              </div>
            </div>
            
            {/* Rendez-vous passés */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-700">Passés</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowManualAppointment(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    + Ajouter un rendez-vous passé manuellement
                  </button>
                  <div className="text-sm text-gray-500">
                    {Math.min((currentPage - 1) * appointmentsPerPage + 1, pastAppointments.length)} - {Math.min(currentPage * appointmentsPerPage, pastAppointments.length)} sur {pastAppointments.length}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Aucun rendez-vous passé
                  </div>
                ) : (
                  currentAppointments
                  .map((appointment: any) => {
                    const timeSlot = appointment.time_slots;
                    const patient = appointment.profiles;
                    const appointmentDate = new Date(timeSlot.start_time);

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="flex items-center space-x-4">
                          <User className="text-gray-400 flex-shrink-0" />
                          <div>
                            {patient ? (
                              <div className="font-medium">
                                {patient.first_name} {patient.last_name}
                              </div>
                            ) : (
                              <div className="font-medium text-gray-500">
                               {appointment.patient_first_name || 'Patient sans profil'}
                              </div>
                            )}
                            <div className="text-sm text-gray-500 space-y-1">
                              {patient ? (
                                <div>
                                  WhatsApp: {patient.phone}
                                </div>
                              ) : (
                                <div>
                               WhatsApp: {appointment.patient_whatsapp || 'Aucun numéro'}
                                </div>
                              )}
                              <div>
                                {appointmentDate.toLocaleString('fr-FR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              appointment.consultation_status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.consultation_status === 'partial'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.consultation_status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : appointment.consultation_status === 'no_show'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {appointment.consultation_status === 'completed'
                              ? 'Terminé'
                              : appointment.consultation_status === 'partial'
                              ? 'Partiel'
                              : appointment.consultation_status === 'cancelled'
                              ? 'Annulé'
                              : appointment.consultation_status === 'no_show'
                              ? 'Non-présent'
                              : 'À compléter'
                            }
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Pagination controls */}
                {pastAppointments.length > 0 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Précédent
                    </button>
                    {(() => {
  const totalPages = Math.ceil(pastAppointments.length / appointmentsPerPage);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded border ${
            currentPage === i
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    } else if (
      (i === currentPage - 2 && currentPage > 4) ||
      (i === currentPage + 2 && currentPage < totalPages - 3)
    ) {
      pages.push(
        <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
          ...
        </span>
      );
    }
  }

  return pages;
})()}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(pastAppointments.length / appointmentsPerPage), p + 1))}
                      disabled={currentPage >= Math.ceil(pastAppointments.length / appointmentsPerPage)}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <Calendar className="text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-semibold">
                  {appointments.filter((a) => a.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-500">Rendez-vous confirmés</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-semibold">{timeSlots.length}</div>
                <div className="text-sm text-gray-500">Rendez-vous global</div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <User className="text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-semibold">0</div>
              <div className="text-sm text-gray-500">Patients</div>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="text-yellow-400 mr-3 fill-yellow-400" />
            <div>
              <div className="text-2xl font-semibold flex items-center gap-2">
                {averageRating ? (
                  <>
                    {averageRating.toFixed(1)}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= Math.round(averageRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  'N/A'
                )}
              </div>
              <div className="text-sm text-gray-500">Note moyenne de satisfaction</div>
            </div>
          </div>
        </div>
        
        {/* Rapports bihebdomadaires */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Rapports bihebdomadaires</h3>
            <button
              onClick={() => setShowBiweeklyReport(true)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              + Nouveau rapport
            </button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun rapport pour le moment
              </p>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar size={16} />
                    <span>
                      Du {new Date(report.period_start).toLocaleDateString('fr-FR')}
                      {' '}au{' '}
                      {new Date(report.period_end).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700 line-clamp-3">{report.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Contenus */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Mes contenus</h3>
            <button
              onClick={() => setShowContentModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              + Ajouter un contenu
            </button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {contents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun contenu pour le moment
              </p>
            ) : (
              contents.map((content) => (
                <div
                  key={content.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  {content.description && (
                    <p className="text-gray-600 text-sm mb-2">{content.description}</p>
                  )}
                  {content.url && (
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Link size={16} />
                      Voir le contenu
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showSettings && (
        <ProfileSettings
          onClose={() => setShowSettings(false)}
        />
      )}
      {selectedAppointment && (
        <ConsultationDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSave={() => {
            showToast('Détails de la consultation mis à jour', 'success');
            // Refresh appointments
            window.location.reload();
          }}
        />
      )}
      {showManualAppointment && (
        <ManualAppointmentModal
          psychologistId={user?.id ?? ''}
          onClose={() => setShowManualAppointment(false)}
          onSave={() => {
            setShowManualAppointment(false);
            showToast('Rendez-vous ajouté avec succès', 'success');
            // Refresh appointments list
            fetchData();
          }}
        />
      )}
      {showBiweeklyReport && (
        <BiweeklyReportModal
          psychologistId={user?.id ?? ''}
          onClose={() => setShowBiweeklyReport(false)}
          onSave={() => {
            showToast('Rapport créé avec succès', 'success');
            // Refresh reports
            fetchData();
          }}
        />
      )}
      {showContentModal && (
        <ContentManagementModal
          psychologistId={user?.id ?? ''}
          onClose={() => setShowContentModal(false)}
          onSave={() => {
            showToast('Contenu ajouté avec succès', 'success');
            // Refresh content list
            fetchData();
          }}
        />
      )}
    </div>
  );
}

async function fetchData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    navigate('/login');
    return;
  }

  const { data: slots } = await supabase
    .from('time_slots')
    .select('*')
    .eq('psychologist_id', user.id);

  const { data: appts } = await supabase
    .from('appointments')
    .select(`
      id,
      status,
      time_slot_id,
      patient_id,
      consultation_status,
      consultation_summary,
      satisfaction_feedback,
      time_slots!inner(start_time, end_time, psychologist_id),
      profiles!appointments_patient_id_fkey(first_name, last_name, phone)
    `)
    .eq('time_slots.psychologist_id', user.id);

  if (slots) setTimeSlots(slots);
  if (appts) setAppointments(appts);
}