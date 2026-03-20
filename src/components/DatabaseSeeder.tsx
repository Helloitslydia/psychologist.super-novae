import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function DatabaseSeeder() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const seedDatabase = async () => {
    setStatus('seeding');
    setLogs([]);
    addLog('🌱 Début du peuplement de la base de données...');

    try {
      const { data: specialties, error: specError } = await supabase
        .from('specialties')
        .select('id, name');

      if (specError) throw specError;

      const specMap: Record<string, string> = {};
      specialties.forEach((s: any) => {
        specMap[s.name] = s.id;
      });

      addLog(`✓ ${specialties.length} spécialités trouvées`);

      const psychologists = [
        {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          profile: {
            role: 'psychologist',
            first_name: 'Amina',
            last_name: 'Benali',
            email: 'amina.benali@psy.ma',
            phone: '+212600111111',
            city: 'Casablanca'
          },
          psychologist: {
            address: '45 Boulevard Zerktouni',
            postal_code: '20000',
            description: 'Psychologue clinicienne spécialisée dans le traitement de l\'anxiété et de la dépression. Approche empathique et bienveillante avec plus de 10 ans d\'expérience.',
            years_of_experience: 10,
            hourly_rate: 500,
            photo_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'arabic']
          },
          specialties: ['Anxiété', 'Dépression', 'Thérapie Cognitive Comportementale']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          profile: {
            role: 'psychologist',
            first_name: 'Karim',
            last_name: 'El Amrani',
            email: 'karim.elamrani@psy.ma',
            phone: '+212600222222',
            city: 'Rabat'
          },
          psychologist: {
            address: '12 Avenue Hassan II',
            postal_code: '10000',
            description: 'Spécialiste en thérapie de couple et familiale. Aide les couples à retrouver une communication harmonieuse et à résoudre leurs conflits.',
            years_of_experience: 8,
            hourly_rate: 600,
            photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english', 'arabic']
          },
          specialties: ['Thérapie de couple', 'Thérapie familiale', 'Stress']
        },
        {
          id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Sarah',
            last_name: 'Idrissi',
            email: 'sarah.idrissi@psy.ma',
            phone: '+212600333333',
            city: 'Marrakech'
          },
          psychologist: {
            address: '28 Avenue Mohammed V',
            postal_code: '40000',
            description: 'Psychologue expérimentée dans l\'accompagnement des victimes de traumatismes. Spécialiste EMDR pour le traitement du stress post-traumatique.',
            years_of_experience: 12,
            hourly_rate: 650,
            photo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english']
          },
          specialties: ['Traumatismes', 'Anxiété', 'Dépression']
        },
        {
          id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Mehdi',
            last_name: 'Tazi',
            email: 'mehdi.tazi@psy.ma',
            phone: '+212600444444',
            city: 'Fès'
          },
          psychologist: {
            address: '15 Rue Souani',
            postal_code: '30000',
            description: 'Spécialiste en burn-out et gestion du stress professionnel. Accompagne les professionnels à retrouver l\'équilibre entre vie personnelle et professionnelle.',
            years_of_experience: 7,
            hourly_rate: 450,
            photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
            consultation_type: ['in-person', 'video', 'phone'],
            languages: ['french', 'arabic']
          },
          specialties: ['Burn-out', 'Stress', 'Anxiété']
        },
        {
          id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Leila',
            last_name: 'Mansouri',
            email: 'leila.mansouri@psy.ma',
            phone: '+212600555555',
            city: 'Tanger'
          },
          psychologist: {
            address: '8 Boulevard Pasteur',
            postal_code: '90000',
            description: 'Psychologue spécialisée dans les addictions et les dépendances. Approche cognitive-comportementale pour un accompagnement vers le sevrage.',
            years_of_experience: 9,
            hourly_rate: 550,
            photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english', 'arabic']
          },
          specialties: ['Addictions', 'Thérapie Cognitive Comportementale', 'Anxiété']
        },
        {
          id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Youssef',
            last_name: 'Alaoui',
            email: 'youssef.alaoui@psy.ma',
            phone: '+212600666666',
            city: 'Casablanca'
          },
          psychologist: {
            address: '67 Rue Abdelmoumen',
            postal_code: '20100',
            description: 'Psychothérapeute spécialisé dans les troubles alimentaires. Accompagnement personnalisé pour l\'anorexie, la boulimie et l\'hyperphagie.',
            years_of_experience: 11,
            hourly_rate: 700,
            photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english']
          },
          specialties: ['Troubles alimentaires', 'Anxiété', 'Thérapie Cognitive Comportementale']
        },
        {
          id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Fatima Zahra',
            last_name: 'Berrada',
            email: 'fz.berrada@psy.ma',
            phone: '+212600777777',
            city: 'Agadir'
          },
          psychologist: {
            address: '34 Avenue Hassan II',
            postal_code: '80000',
            description: 'Psychologue clinicienne avec une approche intégrative. Spécialiste de la thérapie familiale et de l\'accompagnement parental.',
            years_of_experience: 6,
            hourly_rate: 400,
            photo_url: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'arabic']
          },
          specialties: ['Thérapie familiale', 'Stress', 'Anxiété']
        },
        {
          id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Omar',
            last_name: 'Benjelloun',
            email: 'omar.benjelloun@psy.ma',
            phone: '+212600888888',
            city: 'Rabat'
          },
          psychologist: {
            address: '23 Rue Patrice Lumumba',
            postal_code: '10090',
            description: 'Psychologue expert en thérapie cognitive-comportementale. Traite efficacement l\'anxiété, les phobies et les TOC.',
            years_of_experience: 15,
            hourly_rate: 800,
            photo_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english', 'arabic']
          },
          specialties: ['Thérapie Cognitive Comportementale', 'Anxiété', 'Dépression']
        },
        {
          id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Nadia',
            last_name: 'Filali',
            email: 'nadia.filali@psy.ma',
            phone: '+212600999999',
            city: 'Casablanca'
          },
          psychologist: {
            address: '89 Boulevard Anfa',
            postal_code: '20050',
            description: 'Thérapeute de couple certifiée. Aide les couples à traverser les crises et à renforcer leur lien affectif.',
            years_of_experience: 8,
            hourly_rate: 550,
            photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english']
          },
          specialties: ['Thérapie de couple', 'Thérapie familiale', 'Dépression']
        },
        {
          id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Rachid',
            last_name: 'Lamrani',
            email: 'rachid.lamrani@psy.ma',
            phone: '+212601000000',
            city: 'Marrakech'
          },
          psychologist: {
            address: '56 Rue de la Liberté',
            postal_code: '40020',
            description: 'Psychologue spécialisé dans la gestion du stress et l\'épuisement professionnel. Techniques de relaxation et mindfulness.',
            years_of_experience: 5,
            hourly_rate: 450,
            photo_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
            consultation_type: ['in-person', 'video', 'phone'],
            languages: ['french', 'arabic']
          },
          specialties: ['Stress', 'Burn-out', 'Anxiété']
        },
        {
          id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Zineb',
            last_name: 'Chraibi',
            email: 'zineb.chraibi@psy.ma',
            phone: '+212601111111',
            city: 'Fès'
          },
          psychologist: {
            address: '7 Avenue des FAR',
            postal_code: '30050',
            description: 'Psychologue clinicienne spécialisée dans le traitement de la dépression et des troubles de l\'humeur. Approche humaniste.',
            years_of_experience: 10,
            hourly_rate: 500,
            photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'arabic']
          },
          specialties: ['Dépression', 'Anxiété', 'Traumatismes']
        },
        {
          id: '6ba7b819-9dad-11d1-80b4-00c04fd430c8',
          profile: {
            role: 'psychologist',
            first_name: 'Hassan',
            last_name: 'Bennani',
            email: 'hassan.bennani@psy.ma',
            phone: '+212601222222',
            city: 'Tanger'
          },
          psychologist: {
            address: '42 Boulevard Mohammed VI',
            postal_code: '90060',
            description: 'Thérapeute familial expérimenté. Accompagne les familles dans la résolution de conflits et l\'amélioration de la communication.',
            years_of_experience: 13,
            hourly_rate: 600,
            photo_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
            consultation_type: ['in-person', 'video'],
            languages: ['french', 'english', 'arabic']
          },
          specialties: ['Thérapie familiale', 'Thérapie de couple', 'Stress']
        }
      ];

      for (const psy of psychologists) {
        addLog(`\n📝 Insertion de Dr. ${psy.profile.first_name} ${psy.profile.last_name}...`);

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: psy.id, ...psy.profile });

        if (profileError && profileError.code !== '23505') {
          addLog(`  ⚠️ Profil: ${profileError.message}`);
          continue;
        }

        const { error: psychError } = await supabase
          .from('psychologists')
          .insert({ id: psy.id, ...psy.psychologist });

        if (psychError && psychError.code !== '23505') {
          addLog(`  ⚠️ Psychologue: ${psychError.message}`);
          continue;
        }

        for (const specName of psy.specialties) {
          if (specMap[specName]) {
            await supabase
              .from('psychologist_specialties')
              .insert({
                psychologist_id: psy.id,
                specialty_id: specMap[specName]
              });
          }
        }

        const slots = [];
        for (let d = 0; d < 14; d++) {
          const date = new Date();
          date.setDate(date.getDate() + d);

          const morning = new Date(date);
          morning.setHours(9, 0, 0, 0);
          const morningEnd = new Date(morning);
          morningEnd.setHours(10, 0, 0, 0);

          const afternoon = new Date(date);
          afternoon.setHours(14, 0, 0, 0);
          const afternoonEnd = new Date(afternoon);
          afternoonEnd.setHours(15, 0, 0, 0);

          slots.push({
            psychologist_id: psy.id,
            start_time: morning.toISOString(),
            end_time: morningEnd.toISOString()
          });

          slots.push({
            psychologist_id: psy.id,
            start_time: afternoon.toISOString(),
            end_time: afternoonEnd.toISOString()
          });
        }

        const { error: slotsError } = await supabase
          .from('time_slots')
          .insert(slots);

        if (slotsError) {
          addLog(`  ⚠️ Créneaux: ${slotsError.message}`);
        } else {
          addLog(`  ✓ ${slots.length} créneaux créés`);
        }
      }

      addLog('\n✨ Peuplement terminé avec succès!');
      addLog(`${psychologists.length} psychologues ont été ajoutés à la base de données`);
      setStatus('success');
      setMessage('Base de données peuplée avec succès!');
    } catch (error: any) {
      addLog(`\n❌ Erreur: ${error.message}`);
      setStatus('error');
      setMessage('Erreur lors du peuplement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">🌱 Peupler la base de données</h1>
          <p className="text-gray-600 mb-6">
            Cliquez sur le bouton ci-dessous pour ajouter 12 psychologues avec leurs créneaux horaires dans la base de données.
          </p>

          <button
            onClick={seedDatabase}
            disabled={status === 'seeding'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'seeding' ? 'En cours...' : 'Démarrer le peuplement'}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {logs.length > 0 && (
            <div className="mt-6 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
