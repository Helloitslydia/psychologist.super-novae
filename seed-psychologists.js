import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://toautqoefpfspjqezkyr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYXV0cW9lZnBmc3BqcWV6a3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2Njg3MTUsImV4cCI6MjA1NDI0NDcxNX0.pr39r8I9o667gHSbHns-NL5BvVC_277sA8hOqffVG2E'
);

async function seedPsychologists() {
  console.log('🌱 Début du peuplement de la base de données...\n');

  try {
    // Récupération des spécialités existantes
    const { data: specialties, error: specError } = await supabase
      .from('specialties')
      .select('id, name');

    if (specError) throw specError;

    const specMap = {};
    specialties.forEach(spec => {
      specMap[spec.name] = spec.id;
    });

    // Données des psychologues
    const psychologists = [
      {
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

    // Insertion des psychologues
    for (const psy of psychologists) {
      console.log(`📝 Insertion de Dr. ${psy.profile.first_name} ${psy.profile.last_name}...`);

      // Générer un ID unique pour ce psychologue
      const psychologistId = crypto.randomUUID();

      // Insérer le profil (pas besoin de auth.users car on utilise des UUIDs directs)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: psychologistId,
          ...psy.profile
        });

      if (profileError && profileError.code !== '23505') {
        console.error(`❌ Erreur profil: ${profileError.message}`);
        continue;
      }

      // Insérer les données psychologue
      const { error: psychError } = await supabase
        .from('psychologists')
        .insert({
          id: psychologistId,
          ...psy.psychologist
        });

      if (psychError && psychError.code !== '23505') {
        console.error(`❌ Erreur psychologist: ${psychError.message}`);
        continue;
      }

      // Insérer les spécialités
      for (const specName of psy.specialties) {
        if (specMap[specName]) {
          await supabase
            .from('psychologist_specialties')
            .insert({
              psychologist_id: psychologistId,
              specialty_id: specMap[specName]
            });
        }
      }

      // Créer des créneaux horaires pour les 30 prochains jours
      const timeSlots = [];
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);

        // Créneau matin (9h-10h)
        const morning = new Date(date);
        morning.setHours(9, 0, 0, 0);
        const morningEnd = new Date(morning);
        morningEnd.setHours(10, 0, 0, 0);

        // Créneau après-midi (14h-15h)
        const afternoon = new Date(date);
        afternoon.setHours(14, 0, 0, 0);
        const afternoonEnd = new Date(afternoon);
        afternoonEnd.setHours(15, 0, 0, 0);

        timeSlots.push(
          {
            psychologist_id: psychologistId,
            start_time: morning.toISOString(),
            end_time: morningEnd.toISOString()
          },
          {
            psychologist_id: psychologistId,
            start_time: afternoon.toISOString(),
            end_time: afternoonEnd.toISOString()
          }
        );
      }

      const { error: slotsError } = await supabase
        .from('time_slots')
        .insert(timeSlots);

      if (slotsError) {
        console.error(`⚠️  Erreur créneaux: ${slotsError.message}`);
      } else {
        console.log(`✅ Dr. ${psy.profile.first_name} ${psy.profile.last_name} ajouté(e) avec ${timeSlots.length} créneaux`);
      }
    }

    console.log('\n✨ Peuplement terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

seedPsychologists();
