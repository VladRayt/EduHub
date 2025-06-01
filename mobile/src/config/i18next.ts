import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';

import en from '@locales/en.json';
import ua from '@locales/ua.json';
import { storage } from '@zustand/auth.store';

export const languageResourses = {
  en: {
    translation: en,
  },
  ua: {
    translation: ua,
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: storage.getString('lng') || 'ua',
  fallbackLng: 'en',
  resources: languageResourses,
});

export const t = i18next.t;

export default i18next;
