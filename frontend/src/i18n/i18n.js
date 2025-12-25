import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  // ================= MARATHI =================
  mr: {
    translation: {
      appName: "GramPulse 🏡",
      tagline: "डिजिटल ग्रामपंचायत प्रणाली",

      // Auth
      login: "लॉगिन करा",
      loggingIn: "लॉगिन होत आहे...",
      register: "नोंदणी करा",
      noAccount: "खाते नाही?",
      haveAccount: "आधीच खाते आहे?",

      mobile: "मोबाईल नंबर",
      password: "पासवर्ड",
      fullName: "पूर्ण नाव",
      villageName: "गावाचे नाव",

      // Dashboard
      dashboard: "डॅशबोर्ड",
      publicDashboard: "सार्वजनिक डॅशबोर्ड",
      adminDashboard: "अॅडमिन डॅशबोर्ड",

      // Issue / Complaint
      newIssue: "नवीन समस्या नोंदवा",
      issueType: "समस्येचा प्रकार निवडा",
      description: "समस्येचे वर्णन",
      descriptionPlaceholder:
        "इथे तपशील लिहा... (उदा. कुठे आहे, किती दिवसांपासून, किती लोकांना त्रास)",
      uploadMedia:
        "फोटो किंवा व्हिडिओ अपलोड करा (पर्यायी पण शिफारस केलेले)",
      selectLocation:
        "📍 समस्येचे ठिकाण नकाशावर निवडा (क्लिक करा)",
      selectedLocation: "निवडलेले ठिकाण",
      submitIssue: "समस्या सबमिट करा",
      selectOption: "-- निवडा --",
      filesSelected: "{{count}} फाइल्स निवडल्या",

      issueTypes: {
        water: "पाणी",
        road: "रस्ता",
        light: "लाईट",
        drainage: "ड्रेनेज / गटार",
        garbage: "कचरा",
        other: "इतर"
      },

      // Common
      welcome: "स्वागत आहे",
      logout: "लॉगआउट",
      language: "भाषा",
      demoNote: "डेमो: मोबाईल 9999999999 | पासवर्ड: कोणताही",

      success: {
        issueSubmitted: "समस्या यशस्वीरीत्या नोंदवली गेली! 🚀"
      },

      error: {
        fillFields: "कृपया सर्व फील्ड भरा",
        invalidMobile: "योग्य 10 अंकी मोबाईल नंबर टाका",
        fillAllFields: "कृपया सगळी माहिती भरा!"
      }
    }
  },

  // ================= HINDI =================
  hi: {
    translation: {
      appName: "GramPulse 🏡",
      tagline: "डिजिटल ग्राम पंचायत प्रणाली",

      login: "लॉगिन करें",
      loggingIn: "लॉगिन हो रहा है...",
      register: "रजिस्टर करें",
      noAccount: "खाता नहीं है?",
      haveAccount: "पहले से खाता है?",

      mobile: "मोबाइल नंबर",
      password: "पासवर्ड",
      fullName: "पूरा नाम",
      villageName: "गाँव का नाम",

      dashboard: "डैशबोर्ड",
      publicDashboard: "सार्वजनिक डैशबोर्ड",
      adminDashboard: "एडमिन डैशबोर्ड",

      newIssue: "नई समस्या दर्ज करें",
      issueType: "समस्या का प्रकार चुनें",
      description: "समस्या का वर्णन",
      descriptionPlaceholder:
        "यहाँ विवरण लिखें... (जैसे कहाँ है, कितने दिनों से, कितने लोग प्रभावित)",
      uploadMedia:
        "फोटो या वीडियो अपलोड करें (वैकल्पिक लेकिन अनुशंसित)",
      selectLocation:
        "📍 समस्या का स्थान नक्शे पर चुनें (क्लिक करें)",
      selectedLocation: "चुना गया स्थान",
      submitIssue: "समस्या सबमिट करें",
      selectOption: "-- चुनें --",
      filesSelected: "{{count}} फाइलें चुनी गईं",

      issueTypes: {
        water: "पानी",
        road: "सड़क",
        light: "लाइट",
        drainage: "ड्रेनेज / नाली",
        garbage: "कचरा",
        other: "अन्य"
      },

      welcome: "स्वागत है",
      logout: "लॉगआउट",
      language: "भाषा",
      demoNote: "डेमो: मोबाइल 9999999999 | पासवर्ड: कोई भी",

      success: {
        issueSubmitted: "समस्या सफलतापूर्वक दर्ज की गई! 🚀"
      },

      error: {
        fillFields: "कृपया सभी फ़ील्ड भरें",
        invalidMobile: "मान्य 10 अंकों का मोबाइल नंबर दर्ज करें",
        fillAllFields: "कृपया सभी जानकारी भरें!"
      }
    }
  },

  // ================= ENGLISH =================
  en: {
    translation: {
      appName: "GramPulse 🏡",
      tagline: "Digital Gram Panchayat System",

      login: "Login",
      loggingIn: "Logging in...",
      register: "Register",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",

      mobile: "Mobile Number",
      password: "Password",
      fullName: "Full Name",
      villageName: "Village Name",

      dashboard: "Dashboard",
      publicDashboard: "Public Dashboard",
      adminDashboard: "Admin Dashboard",

      newIssue: "Submit New Issue",
      issueType: "Select Issue Type",
      description: "Issue Description",
      descriptionPlaceholder:
        "Write details here... (e.g. where is it, since how many days, how many people affected)",
      uploadMedia:
        "Upload Photo or Video (Optional but Recommended)",
      selectLocation:
        "📍 Select Issue Location on Map (Click)",
      selectedLocation: "Selected Location",
      submitIssue: "Submit Issue",
      selectOption: "-- Select --",
      filesSelected: "{{count}} files selected",

      issueTypes: {
        water: "Water",
        road: "Road",
        light: "Street Light",
        drainage: "Drainage / Sewer",
        garbage: "Garbage",
        other: "Other"
      },

      welcome: "Welcome",
      logout: "Logout",
      language: "Language",
      demoNote: "Demo: Mobile 9999999999 | Password: any",

      success: {
        issueSubmitted: "Issue successfully submitted! 🚀"
      },

      error: {
        fillFields: "Please fill all fields",
        invalidMobile: "Enter valid 10 digit mobile number",
        fillAllFields: "Please fill all required fields!"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "mr", // default Marathi
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
