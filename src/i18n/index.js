import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import mrTranslation from './locales/mr.json';

const resources = {
  'en-IN': { translation: enTranslation },
  'hi-IN': { translation: hiTranslation },
  'mr-IN': { translation: mrTranslation }
};

// Fallback alias
resources['en'] = resources['en-IN'];
resources['hi'] = resources['hi-IN'];
resources['mr'] = resources['mr-IN'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-IN',
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'aicte_lang',
      caches: ['localStorage']
    }
  });

export default i18n;
