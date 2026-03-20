// Script simple pour peupler la base de données
const SUPABASE_URL = 'https://toautqoefpfspjqezkyr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYXV0cW9lZnBmc3BqcWV6a3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2Njg3MTUsImV4cCI6MjA1NDI0NDcxNX0.pr39r8I9o667gHSbHns-NL5BvVC_277sA8hOqffVG2E';

async function makeRequest(table, data, method = 'POST') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Erreur ${table}:`, error);
    return false;
  }
  return true;
}

async function seed() {
  console.log('🌱 Début du peuplement...\n');

  // Récupération des spécialités
  const specResponse = await fetch(`${SUPABASE_URL}/rest/v1/specialties?select=id,name`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  const specialties = await specResponse.json();
  const specMap = {};
  specialties.forEach(s => {
    specMap[s.name] = s.id;
  });

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
        description: 'Spécialiste en thérapie de couple et familiale. Aide les couples à retrouver une communication harmonieuse.',
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
        description: 'Psychologue expérimentée dans l\'accompagnement des victimes de traumatismes.',
        years_of_experience: 12,
        hourly_rate: 650,
        photo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
        consultation_type: ['in-person', 'video'],
        languages: ['french', 'english']
      },
      specialties: ['Traumatismes', 'Anxiété', 'Dépression']
    }
  ];

  for (const psy of psychologists) {
    console.log(`📝 Dr. ${psy.profile.first_name} ${psy.profile.last_name}...`);

    // Profil
    await makeRequest('profiles', { id: psy.id, ...psy.profile });

    // Psychologue
    await makeRequest('psychologists', { id: psy.id, ...psy.psychologist });

    // Spécialités
    for (const specName of psy.specialties) {
      if (specMap[specName]) {
        await makeRequest('psychologist_specialties', {
          psychologist_id: psy.id,
          specialty_id: specMap[specName]
        });
      }
    }

    // Créneaux (5 jours)
    const slots = [];
    for (let d = 0; d < 5; d++) {
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

    await makeRequest('time_slots', slots);
    console.log(`✅ Terminé\n`);
  }

  console.log('✨ Peuplement terminé!');
}

seed().catch(console.error);
