-- Script SQL pour peupler la base de données avec des psychologues factices

-- Génération d'IDs pour les psychologues
\set psych1_id '''f47ac10b-58cc-4372-a567-0e02b2c3d479'''
\set psych2_id '''550e8400-e29b-41d4-a716-446655440001'''
\set psych3_id '''6ba7b810-9dad-11d1-80b4-00c04fd430c8'''
\set psych4_id '''6ba7b811-9dad-11d1-80b4-00c04fd430c8'''
\set psych5_id '''6ba7b812-9dad-11d1-80b4-00c04fd430c8'''
\set psych6_id '''6ba7b813-9dad-11d1-80b4-00c04fd430c8'''
\set psych7_id '''6ba7b814-9dad-11d1-80b4-00c04fd430c8'''
\set psych8_id '''6ba7b815-9dad-11d1-80b4-00c04fd430c8'''
\set psych9_id '''6ba7b816-9dad-11d1-80b4-00c04fd430c8'''
\set psych10_id '''6ba7b817-9dad-11d1-80b4-00c04fd430c8'''
\set psych11_id '''6ba7b818-9dad-11d1-80b4-00c04fd430c8'''
\set psych12_id '''6ba7b819-9dad-11d1-80b4-00c04fd430c8'''

-- Insertion des profils
INSERT INTO profiles (id, role, first_name, last_name, email, phone, city)
VALUES
  (:psych1_id, 'psychologist', 'Amina', 'Benali', 'amina.benali@psy.ma', '+212600111111', 'Casablanca'),
  (:psych2_id, 'psychologist', 'Karim', 'El Amrani', 'karim.elamrani@psy.ma', '+212600222222', 'Rabat'),
  (:psych3_id, 'psychologist', 'Sarah', 'Idrissi', 'sarah.idrissi@psy.ma', '+212600333333', 'Marrakech'),
  (:psych4_id, 'psychologist', 'Mehdi', 'Tazi', 'mehdi.tazi@psy.ma', '+212600444444', 'Fès'),
  (:psych5_id, 'psychologist', 'Leila', 'Mansouri', 'leila.mansouri@psy.ma', '+212600555555', 'Tanger'),
  (:psych6_id, 'psychologist', 'Youssef', 'Alaoui', 'youssef.alaoui@psy.ma', '+212600666666', 'Casablanca'),
  (:psych7_id, 'psychologist', 'Fatima Zahra', 'Berrada', 'fz.berrada@psy.ma', '+212600777777', 'Agadir'),
  (:psych8_id, 'psychologist', 'Omar', 'Benjelloun', 'omar.benjelloun@psy.ma', '+212600888888', 'Rabat'),
  (:psych9_id, 'psychologist', 'Nadia', 'Filali', 'nadia.filali@psy.ma', '+212600999999', 'Casablanca'),
  (:psych10_id, 'psychologist', 'Rachid', 'Lamrani', 'rachid.lamrani@psy.ma', '+212601000000', 'Marrakech'),
  (:psych11_id, 'psychologist', 'Zineb', 'Chraibi', 'zineb.chraibi@psy.ma', '+212601111111', 'Fès'),
  (:psych12_id, 'psychologist', 'Hassan', 'Bennani', 'hassan.bennani@psy.ma', '+212601222222', 'Tanger')
ON CONFLICT (id) DO NOTHING;

-- Insertion des psychologues
INSERT INTO psychologists (id, address, postal_code, description, years_of_experience, hourly_rate, photo_url, consultation_type, languages)
VALUES
  (:psych1_id, '45 Boulevard Zerktouni', '20000', 'Psychologue clinicienne spécialisée dans le traitement de l''anxiété et de la dépression. Approche empathique et bienveillante avec plus de 10 ans d''expérience.', 10, 500, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'arabic']),
  (:psych2_id, '12 Avenue Hassan II', '10000', 'Spécialiste en thérapie de couple et familiale. Aide les couples à retrouver une communication harmonieuse et à résoudre leurs conflits.', 8, 600, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english', 'arabic']),
  (:psych3_id, '28 Avenue Mohammed V', '40000', 'Psychologue expérimentée dans l''accompagnement des victimes de traumatismes. Spécialiste EMDR pour le traitement du stress post-traumatique.', 12, 650, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english']),
  (:psych4_id, '15 Rue Souani', '30000', 'Spécialiste en burn-out et gestion du stress professionnel. Accompagne les professionnels à retrouver l''équilibre entre vie personnelle et professionnelle.', 7, 450, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400', ARRAY['in-person', 'video', 'phone'], ARRAY['french', 'arabic']),
  (:psych5_id, '8 Boulevard Pasteur', '90000', 'Psychologue spécialisée dans les addictions et les dépendances. Approche cognitive-comportementale pour un accompagnement vers le sevrage.', 9, 550, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english', 'arabic']),
  (:psych6_id, '67 Rue Abdelmoumen', '20100', 'Psychothérapeute spécialisé dans les troubles alimentaires. Accompagnement personnalisé pour l''anorexie, la boulimie et l''hyperphagie.', 11, 700, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english']),
  (:psych7_id, '34 Avenue Hassan II', '80000', 'Psychologue clinicienne avec une approche intégrative. Spécialiste de la thérapie familiale et de l''accompagnement parental.', 6, 400, 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'arabic']),
  (:psych8_id, '23 Rue Patrice Lumumba', '10090', 'Psychologue expert en thérapie cognitive-comportementale. Traite efficacement l''anxiété, les phobies et les TOC.', 15, 800, 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english', 'arabic']),
  (:psych9_id, '89 Boulevard Anfa', '20050', 'Thérapeute de couple certifiée. Aide les couples à traverser les crises et à renforcer leur lien affectif.', 8, 550, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english']),
  (:psych10_id, '56 Rue de la Liberté', '40020', 'Psychologue spécialisé dans la gestion du stress et l''épuisement professionnel. Techniques de relaxation et mindfulness.', 5, 450, 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400', ARRAY['in-person', 'video', 'phone'], ARRAY['french', 'arabic']),
  (:psych11_id, '7 Avenue des FAR', '30050', 'Psychologue clinicienne spécialisée dans le traitement de la dépression et des troubles de l''humeur. Approche humaniste.', 10, 500, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'arabic']),
  (:psych12_id, '42 Boulevard Mohammed VI', '90060', 'Thérapeute familial expérimenté. Accompagne les familles dans la résolution de conflits et l''amélioration de la communication.', 13, 600, 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400', ARRAY['in-person', 'video'], ARRAY['french', 'english', 'arabic'])
ON CONFLICT (id) DO NOTHING;

-- Récupération des IDs des spécialités et insertion des relations
INSERT INTO psychologist_specialties (psychologist_id, specialty_id)
SELECT :psych1_id, id FROM specialties WHERE name IN ('Anxiété', 'Dépression', 'Thérapie Cognitive Comportementale')
UNION ALL
SELECT :psych2_id, id FROM specialties WHERE name IN ('Thérapie de couple', 'Thérapie familiale', 'Stress')
UNION ALL
SELECT :psych3_id, id FROM specialties WHERE name IN ('Traumatismes', 'Anxiété', 'Dépression')
UNION ALL
SELECT :psych4_id, id FROM specialties WHERE name IN ('Burn-out', 'Stress', 'Anxiété')
UNION ALL
SELECT :psych5_id, id FROM specialties WHERE name IN ('Addictions', 'Thérapie Cognitive Comportementale', 'Anxiété')
UNION ALL
SELECT :psych6_id, id FROM specialties WHERE name IN ('Troubles alimentaires', 'Anxiété', 'Thérapie Cognitive Comportementale')
UNION ALL
SELECT :psych7_id, id FROM specialties WHERE name IN ('Thérapie familiale', 'Stress', 'Anxiété')
UNION ALL
SELECT :psych8_id, id FROM specialties WHERE name IN ('Thérapie Cognitive Comportementale', 'Anxiété', 'Dépression')
UNION ALL
SELECT :psych9_id, id FROM specialties WHERE name IN ('Thérapie de couple', 'Thérapie familiale', 'Dépression')
UNION ALL
SELECT :psych10_id, id FROM specialties WHERE name IN ('Stress', 'Burn-out', 'Anxiété')
UNION ALL
SELECT :psych11_id, id FROM specialties WHERE name IN ('Dépression', 'Anxiété', 'Traumatismes')
UNION ALL
SELECT :psych12_id, id FROM specialties WHERE name IN ('Thérapie familiale', 'Thérapie de couple', 'Stress')
ON CONFLICT DO NOTHING;

-- Création des créneaux horaires pour les 30 prochains jours
DO $$
DECLARE
  psychs uuid[] := ARRAY[
    'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b812-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b813-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b814-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b815-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b816-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b817-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b818-9dad-11d1-80b4-00c04fd430c8'::uuid,
    '6ba7b819-9dad-11d1-80b4-00c04fd430c8'::uuid
  ];
  psych_id uuid;
BEGIN
  FOREACH psych_id IN ARRAY psychs
  LOOP
    FOR day_offset IN 0..29 LOOP
      -- Créneau du matin (9h-10h)
      INSERT INTO time_slots (psychologist_id, start_time, end_time)
      VALUES (
        psych_id,
        (CURRENT_DATE + day_offset * INTERVAL '1 day' + INTERVAL '9 hours')::timestamptz,
        (CURRENT_DATE + day_offset * INTERVAL '1 day' + INTERVAL '10 hours')::timestamptz
      );

      -- Créneau de l'après-midi (14h-15h)
      INSERT INTO time_slots (psychologist_id, start_time, end_time)
      VALUES (
        psych_id,
        (CURRENT_DATE + day_offset * INTERVAL '1 day' + INTERVAL '14 hours')::timestamptz,
        (CURRENT_DATE + day_offset * INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz
      );
    END LOOP;
  END LOOP;
END $$;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Base de données peuplée avec succès!';
  RAISE NOTICE '- 12 psychologues créés';
  RAISE NOTICE '- 720 créneaux horaires créés (30 jours × 2 créneaux/jour × 12 psychologues)';
END $$;
