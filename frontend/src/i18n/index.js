import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      mr: {
        translation: {
          dashboard: "डॅशबोर्ड",
          newIssue: "नवीन समस्या",
          submit: "सबमिट करा",
          login: "लॉगिन करा",
          // तुझ्या सगळ्या text येथे add कर
        }
      },
      hi: {
        translation: {
          dashboard: "डैशबोर्ड",
          newIssue: "नई समस्या",
          submit: "सबमिट करें",
          login: "लॉगिन करें",
        }
      },
      en: {
        translation: {
          dashboard: "Dashboard",
          newIssue: "New Issue",
          submit: "Submit",
          login: "Login",
        }
      }
    },
    lng: "mr", // default मराठी
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;