import React from 'react';
import { Shield, Users, Calendar, Star, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ToastContext } from './ToastProvider';
import { useDashboardLanguage } from '../context/DashboardLanguageContext';
import { CreatePsychologistModal } from './CreatePsychologistModal';
import { ViewAppointmentsModal } from './ViewAppointmentsModal';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = React.useContext(ToastContext);
  const { t, language, setLanguage } = useDashboardLanguage();
  const [showCreatePsychologist, setShowCreatePsychologist] = React.useState(false);
  const [showAppointments, setShowAppointments] = React.useState(false);
  const [stats, setStats] = React.useState({
    psychologistCount: 0,
    appointmentCount: 0,
    psychologistsByName: [] as Array<{
      id: string;
      firstName: string;
      lastName: string;
    }>,
    appointmentsByPsychologist: [],
    averageRating: 0,
    ratingsByPsychologist: []
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get psychologist count
        const { count: psychologistCount } = await supabase
          .from('psychologists')
          .select('*', { count: 'exact', head: true });

        // Get total appointments
        const { count: appointmentCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true });

        const { data: psychologists } = await supabase
          .from('psychologists')
          .select(`
            id,
            profiles!inner (
              first_name,
              last_name
            )
          `)
          .order('profiles(first_name)', { ascending: true });

        const formattedPsychologists = psychologists?.map(psych => ({
          id: psych.id,
          firstName: psych.profiles.first_name,
          lastName: psych.profiles.last_name
        })) || [];

        const { data: psychologistsStats } = await supabase
          .from('psychologists')
          .select(`
            id,
            profiles!inner (
              first_name,
              last_name
            )
          `);

        // Get appointments by psychologist
        const { data: appointmentsByPsychologist } = await supabase
          .from('time_slots')
          .select(`
            psychologist_id,
            appointments!inner (
              id
            ),
            psychologists!inner (
              profiles!inner (
                first_name,
                last_name
              )
            )
          `);

        // Calculate appointments per psychologist
        const appointmentStats = {};
        appointmentsByPsychologist?.forEach(slot => {
          const psychId = slot.psychologist_id;
          const psychName = `Dr. ${slot.psychologists.profiles.first_name} ${slot.psychologists.profiles.last_name}`;
          
          if (!appointmentStats[psychId]) {
            appointmentStats[psychId] = { name: psychName, count: 0 };
          }
          appointmentStats[psychId].count++;
        });

        // Get average rating
        const { data: ratings } = await supabase
          .from('appointments')
          .select('satisfaction_rating')
          .not('satisfaction_rating', 'is', null);

        const averageRating = ratings?.reduce((sum, curr) => sum + curr.satisfaction_rating, 0) / (ratings?.length || 1);

        // Get ratings by psychologist
        const { data: ratingsByPsych } = await supabase
          .from('appointments')
          .select(`
            satisfaction_rating,
            time_slots (
              psychologist_id,
              psychologists (
                profiles (
                  first_name,
                  last_name
                )
              )
            )
          `)
          .not('satisfaction_rating', 'is', null);

        // Calculate average rating per psychologist
        const ratingStats = ratingsByPsych?.reduce((acc, curr) => {
          const psychId = curr.time_slots.psychologist_id;
          const psychName = `Dr. ${curr.time_slots.psychologists.profiles.first_name} ${curr.time_slots.psychologists.profiles.last_name}`;
          
          if (!acc[psychId]) {
            acc[psychId] = { name: psychName, ratings: [] };
          }
          acc[psychId].ratings.push(curr.satisfaction_rating);
          return acc;
        }, {});

        // Calculate averages
        const ratingAverages = Object.entries(ratingStats || {}).map(([id, data]) => ({
          id,
          name: data.name,
          average: data.ratings.reduce((sum, rating) => sum + rating, 0) / data.ratings.length
        }));

        setStats({
          psychologistCount: psychologistCount || 0,
          appointmentCount: appointmentsByPsychologist?.length || 0,
          psychologistsByName: formattedPsychologists,
          appointmentsByPsychologist: Object.values(appointmentStats || {}),
          averageRating: averageRating || 0,
          ratingsByPsychologist: ratingAverages
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Globe className="h-5 w-5" />
                <span>{language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">{t('loadingStats')}</div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Statistiques */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('activePsychologists')}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.psychologistCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('appointmentsThisMonth')}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.appointmentCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('globalAverageRating')}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stats.averageRating.toFixed(1)}/5
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('quickActions')}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button 
                onClick={() => setShowCreatePsychologist(true)}
                className="flex items-center p-4 bg-white shadow rounded-lg hover:bg-gray-50"
              >
                <Users className="h-6 w-6 text-blue-600" />
                <span className="ml-3 text-gray-900">{t('managePsychologists')}</span>
              </button>
              <button 
                onClick={() => setShowAppointments(true)}
                className="flex items-center p-4 bg-white shadow rounded-lg hover:bg-gray-50"
              >
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="ml-3 text-gray-900">{t('viewAppointments')}</span>
              </button>
            </div>
          </div>

          {/* Tableau de bord principal */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('appointmentsByPsychologist')}
                </h3>
                <div className="space-y-4">
                  {stats.appointmentsByPsychologist.map((psych, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{psych.name}</span>
                      <span className="text-gray-600">{psych.count} {t('appointments')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('averageRatingsByPsychologist')}
                </h3>
                <div className="space-y-4">
                  {stats.ratingsByPsychologist.map((psych, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{psych.name}</span>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-600">{psych.average.toFixed(1)}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Liste des psychologues */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('connectToDashboard')}
            </h3>
            <div className="space-y-4">
              {stats.psychologistsByName?.map((psych) => (
                <div key={psych.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Dr. {psych.firstName} {psych.lastName}</span>
                  <button
                    onClick={async () => {
                      try {
                        // Sign in as the psychologist
                        const { data: { session }, error } = await supabase.auth.signInWithPassword({
                          email: `${psych.firstName.toLowerCase()}.${psych.lastName.toLowerCase()}@psychologist.super-novae.org`,
                          password: 'SuperNovae2024!'
                        }); 
                        
                        if (error) throw error;
                        
                        if (session) {
                          // Navigate to dashboard
                          navigate('/dashboard');
                        } else {
                          throw new Error('Invalid session');
                        }
                      } catch (err) {
                        console.error('Error accessing dashboard:', err);
                        showToast(t('dashboardError'), 'error');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('access')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showCreatePsychologist && (
          <CreatePsychologistModal
            onClose={() => {
              setShowCreatePsychologist(false);
              // Refresh stats after creating a psychologist
              fetchStats();
            }}
          />
        )}

        {showAppointments && (
          <ViewAppointmentsModal
            onClose={() => setShowAppointments(false)}
          />
        )}
      </main>
    </div>
  );
}