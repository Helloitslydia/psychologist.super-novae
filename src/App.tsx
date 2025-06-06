import React, { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { PsychologistCard } from './components/PsychologistCard';
import { Calendar } from './components/Calendar';
import { AppointmentConfirmation } from './components/AppointmentConfirmation';
import { PsychologistDashboard } from './components/PsychologistDashboard';
import { BookingModal } from './components/BookingModal';
import { Menu, X, BookOpen, ArrowLeft } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Psychologist, TimeSlot, Appointment } from './types';
import { useLanguage } from './context/LanguageContext';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { useNavigate } from 'react-router-dom';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    psychologistId: '1',
    patientId: 'patient1',
    timeSlotId: '2',
    status: 'confirmed',
  },
];

function App() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [view, setView] = React.useState<'search' | 'booking' | 'dashboard' | 'confirmation'>('search');
  const [psychologists, setPsychologists] = React.useState<Psychologist[]>([]);
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = React.useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<TimeSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [isBookingLoading, setIsBookingLoading] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [confirmedAppointmentInfo, setConfirmedAppointmentInfo] = React.useState<{
    firstName: string;
    lastName: string;
    whatsapp: string;
    email: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [userLanguage, setUserLanguage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const { data: psychologistsData, error } = await supabase
          .from('psychologists')
          .select(`
            id,
            profiles!inner(
              first_name,
              last_name,
              city
            ),
            address,
            description,
            hourly_rate,
            photo_url,
            languages,
            languages,
            psychologist_specialties(
              specialties(name)
            )
          `);

        if (error) throw error;

        if (psychologistsData) {
          const formattedPsychologists: Psychologist[] = psychologistsData.map(psych => ({
            id: psych.id,
            name: `Dr. ${psych.profiles.first_name} ${psych.profiles.last_name}`,
            specialties: psych.psychologist_specialties.map(
              spec => spec.specialties.name
            ),
            address: psych.address,
            city: psych.profiles.city,
            photo: psych.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
            description: psych.description,
            languages: Array.isArray(psych.languages) ? psych.languages : ['fr']
          }));
          setPsychologists(formattedPsychologists);
        }
      } catch (error) {
        console.error('Error fetching psychologists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  const handleLanguageSelect = (language: string) => {
    setUserLanguage(language);
    setShowLanguageModal(false);
    
    if (language === 'none') {
      // Rediriger vers une page d'assistance ou afficher des instructions visuelles
      alert('Un assistant va vous aider à prendre rendez-vous. Veuillez patienter...');
    }
  };

  const handleSearch = async (query: string, language: string) => {
    setLoading(true);
    try {
      let supabaseQuery = supabase
        .from('psychologists')
        .select(`
          id,
          profiles!inner(
            first_name,
            last_name,
          ),
          description,
          photo_url,
          languages,
          psychologist_specialties(
            specialties(name)
          )
        `);

      if (language) {
        supabaseQuery = supabaseQuery.contains('languages', [language]);
      }

      if (query) {
        supabaseQuery = supabaseQuery.or(`
          profiles.first_name.ilike.%${query}%
        `);
      }

      const { data: psychologistsData, error } = await supabaseQuery;

      if (error) throw error;

      if (psychologistsData) {
        const formattedPsychologists: Psychologist[] = psychologistsData.map(psych => ({
          id: psych.id,
          name: `Dr. ${psych.profiles.first_name} ${psych.profiles.last_name}`,
          specialties: psych.psychologist_specialties.map(
            spec => spec.specialties.name
          ),
          photo: psych.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
          description: psych.description,
          languages: Array.isArray(psych.languages) ? psych.languages : ['fr']
        }));
        setPsychologists(formattedPsychologists);
      }
    } catch (error) {
      console.error('Error searching psychologists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPsychologist = async (id: string) => {
    setSelectedPsychologist(id);
    setView('booking');
    setLoadingSlots(true);

    try {
      // Fetch time slots for the selected psychologist
      const { data: slots, error } = await supabase
        .from('time_slots')
        .select(`
          id,
          psychologist_id,
          start_time,
          end_time,
          appointments(id)
        `)
        .eq('psychologist_id', id)
        .gte('start_time', new Date().toISOString()) // Only future slots
        .order('start_time');

      if (error) throw error;

      if (slots) {
        const formattedSlots: TimeSlot[] = slots.map(slot => ({
          id: slot.id,
          psychologistId: slot.psychologist_id,
          startTime: slot.start_time,
          endTime: slot.end_time,
          isBooked: slot.appointments.length > 0
        }));
        setTimeSlots(formattedSlots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectTimeSlot = async (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (formData: { firstName: string; lastName: string; whatsapp: string; email: string }) => {
    if (!selectedTimeSlot || !selectedPsychologist) return;

    setBookingError(null);
    setIsBookingLoading(true);
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.whatsapp || !formData.email) {
        throw new Error('Tous les champs sont obligatoires');
      }

      const appointmentData = {
        time_slot_id: selectedTimeSlot.id,
        status: 'confirmed',
        patient_first_name: formData.firstName.trim(),
        patient_whatsapp: formData.whatsapp.trim(),
        notes: `Patient: ${formData.firstName.trim()} ${formData.lastName.trim()}\nEmail: ${formData.email.trim()}`
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23505') {
          throw new Error('Ce créneau a déjà été réservé. Veuillez en choisir un autre.');
        } else {
          throw new Error('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
        }
      }
      
      // Update local state
      setTimeSlots(prev =>
        prev.map(slot =>
          slot.id === selectedTimeSlot.id
            ? { ...slot, isBooked: true }
            : slot
        )
      );

      // Close modal and show success message
      setConfirmedAppointmentInfo(formData);
      setIsBookingModalOpen(false);
      setView('confirmation');
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la réservation. Veuillez réessayer.';
      setBookingError(errorMessage);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleAddTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    console.log('Adding time slot:', slot);
    // This would typically add the slot to the database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageSelectionModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={handleLanguageSelect}
      />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <a
                href="https://tandem-project.super-novae.org/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </a>
              <img
                onClick={() => navigate('/admin')}
                src="//c5ceaa4e16cfaa43c4e175e2d8739333.cdn.bubble.io/f1737549126604x138366551156432480/logo-sn.jpeg"
                alt="Super-Novae Logo"
                className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
              <h1 className="text-2xl font-bold text-gray-900">PSS</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/resources')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <BookOpen size={20} />
                <span className="hidden sm:inline">{t('mentalHealthResources')}</span>
              </button>
              
              {/* Menu sandwich button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Menu dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setView(view === 'dashboard' ? 'search' : 'dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {view === 'dashboard' ? t('patientMode') : t('psychologistMode')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === 'search' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-4">
                {t('searchTitle')}
              </h2>
              <p className="text-gray-600 text-center mb-8">
                {t('searchSubtitle')}
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 text-center py-8">
                  <div className="text-lg">{t('loading')}</div>
                </div>
              ) : psychologists.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <div className="text-lg">{t('noPsychologist')}</div>
                </div>
              ) : psychologists.map((psych) => (
                <PsychologistCard
                  key={psych.id}
                  psychologist={psych}
                  onSelect={handleSelectPsychologist}
                />
              ))}
            </div>
          </>
        )}

        {view === 'booking' && selectedPsychologist && (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setView('search')}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Retour à la recherche
            </button>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start gap-6">
                <img
                  src={psychologists.find((p) => p.id === selectedPsychologist)?.photo}
                  alt="Psychologist"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {psychologists.find((p) => p.id === selectedPsychologist)?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {psychologists.find((p) => p.id === selectedPsychologist)?.description}
                  </p>
                </div>
              </div>
            </div>
            {loadingSlots ? (
              <div className="text-center py-8">
                <div className="text-lg">Chargement des disponibilités...</div>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg">Aucune disponibilité pour le moment</div>
              </div>
            ) : (
              <Calendar
                timeSlots={timeSlots}
                onSelectSlot={handleSelectTimeSlot}
              />
            )}
          </div>
        )}

        {view === 'dashboard' && (
          <PsychologistDashboard
            appointments={mockAppointments}
            timeSlots={timeSlots}
            onAddTimeSlot={handleAddTimeSlot}
          />
        )}

        {view === 'confirmation' && selectedTimeSlot && selectedPsychologist && confirmedAppointmentInfo && (
          <AppointmentConfirmation
            psychologist={psychologists.find(p => p.id === selectedPsychologist)!}
            timeSlot={selectedTimeSlot}
            patientInfo={confirmedAppointmentInfo}
          />
        )}

        {selectedTimeSlot && selectedPsychologist && (
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            onConfirm={(formData) => handleConfirmBooking(formData)}
            timeSlot={selectedTimeSlot}
            psychologist={psychologists.find(p => p.id === selectedPsychologist)!}
            loading={isBookingLoading}
            error={bookingError}
          />
        )}
      </main>
    </div>
  );
}

export default App;