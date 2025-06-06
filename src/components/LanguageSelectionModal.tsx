import React from 'react';
import { Globe, BookX, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (language: string) => void;
}

export function LanguageSelectionModal({
  isOpen,
  onClose,
  onSelect
}: LanguageSelectionModalProps) {
  const { setLanguage } = useLanguage();

  if (!isOpen) return null;

  const languages = [
    { code: 'fr', name: '🇫🇷 Français', label: 'Je parle français' },
    { code: 'ar', name: '🇸🇦 العربية', label: 'أتحدث العربية' },
    { code: 'en', name: '🇬🇧 English', label: 'I speak English' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Globe className="text-blue-600" size={24} />
            <h3 className="text-xl font-semibold">Sélectionnez votre langue</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'fr' | 'ar' | 'en');
                onSelect(lang.code);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{lang.name.split(' ')[0]}</span>
              <span className="text-lg">{lang.label}</span>
            </button>
          ))}

          <button
            onClick={() => onSelect('none')}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <BookX className="text-gray-600" size={24} />
            <span className="text-lg">Non-lecteur</span>
          </button>
        </div>
      </div>
    </div>
  );
}