import { localeDefault } from '@locales/locales';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

export function initLocale(locale: string) {
  return i18n
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, ns: string) => import(`../public/locales/${language}/${ns}.json`),
      ),
    )
    .use(initReactI18next)
    .init({
      lng: locale || localeDefault,
      fallbackLng: localeDefault,

      debug: false,
      load: 'languageOnly',
      ns: ['common'],
      defaultNS: 'common',

      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
