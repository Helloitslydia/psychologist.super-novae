import React from 'react';
import { Clock, Globe } from 'lucide-react';
import type { Psychologist } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PsychologistCardProps {
  psychologist: Psychologist;
  onSelect: (id: string) => void;
}

export function PsychologistCard({ psychologist, onSelect }: PsychologistCardProps) {
  const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
  const { t, language } = useLanguage();

  const getLanguageName = (code: string) => {
    const languageNames = {
      fr: {
        fr: '🇫🇷 Français',
        en: '🇬🇧 Anglais',
        es: '🇪🇸 Espagnol',
        de: '🇩🇪 Allemand',
        it: '🇮🇹 Italien',
        pt: '🇵🇹 Portugais',
        nl: '🇳🇱 Néerlandais',
        ar: '🇸🇦 Arabe',
        zh: '🇨🇳 Chinois',
        ja: '🇯🇵 Japonais'
      },
      ar: {
        fr: '🇫🇷 الفرنسية',
        en: '🇬🇧 الإنجليزية',
        es: '🇪🇸 الإسبانية',
        de: '🇩🇪 الألمانية',
        it: '🇮🇹 الإيطالية',
        pt: '🇵🇹 البرتغالية',
        nl: '🇳🇱 الهولندية',
        ar: '🇸🇦 العربية',
        zh: '🇨🇳 الصينية',
        ja: '🇯🇵 اليابانية'
      },
      en: {
        fr: '🇫🇷 French',
        en: '🇬🇧 English',
        es: '🇪🇸 Spanish',
        de: '🇩🇪 German',
        it: '🇮🇹 Italian',
        pt: '🇵🇹 Portuguese',
        nl: '🇳🇱 Dutch',
        ar: '🇸🇦 Arabic',
        zh: '🇨🇳 Chinese',
        ja: '🇯🇵 Japanese'
      }
    };

    return languageNames[language][code] || code;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-3 aspect-h-2">
        <img
          src={psychologist.photo || DEFAULT_PHOTO}
          alt={psychologist.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{psychologist.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Clock size={16} className="mr-2" />
          <span>{t('nextAvailability')}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Globe size={16} className="mr-2" />
          <span>
            {psychologist.languages?.map((lang, index) => (
              <span key={lang} className="inline-flex items-center">
                {index > 0 && <span className="mx-1">•</span>}
                <span>
                  {getLanguageName(lang)}
                </span>
              </span>
            )) || <span className="text-gray-400">{t('languagesNotSpecified')}</span>}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {psychologist.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
        <button
          onClick={() => onSelect(psychologist.id)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('bookAppointment')}
        </button>
      </div>
    </div>
  );
}