import React, { createContext, useContext, useState } from 'react';
import { dashboardTranslations } from '../translations/dashboard';

type Language = 'fr' | 'en';

interface DashboardLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof dashboardTranslations.fr) => string;
}

const DashboardLanguageContext = createContext<DashboardLanguageContextType | undefined>(undefined);

export function DashboardLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: keyof typeof dashboardTranslations.fr) => {
    return dashboardTranslations[language][key];
  };

  return (
    <DashboardLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </DashboardLanguageContext.Provider>
  );
}

export function useDashboardLanguage() {
  const context = useContext(DashboardLanguageContext);
  if (context === undefined) {
    throw new Error('useDashboardLanguage must be used within a DashboardLanguageProvider');
  }
  return context;
}