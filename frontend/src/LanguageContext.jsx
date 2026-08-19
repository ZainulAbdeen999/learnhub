import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const LANG_KEY = 'learnhub_lang';
const LanguageContext = createContext(null);

const LANGUAGES = [
  { code: 'all', name: 'All Languages', flag: '🌍' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'ru', name: 'Roman Urdu', flag: '📝' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved || 'all';
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
