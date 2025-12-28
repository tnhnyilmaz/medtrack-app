import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
    en: { translation: en },
    tr: { translation: tr },
};

const initI18n = async () => {
    let language = Localization.getLocales()[0].languageCode;

    // Basic fallback
    if (language !== 'tr' && language !== 'en') {
        language = 'en';
    }

    await i18n.use(initReactI18next).init({
        resources,
        lng: language,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });
};

initI18n();

export default i18n;
