import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    appName: 'ShreeAnna Connect',
    tagline: 'Bridging Millet Farmers & Conscious Consumers',
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    location: 'Location',
    age: 'Age',
    role: 'I am a',
    farmer: 'Farmer',
    consumer: 'Consumer',
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    profile: 'Profile',
    logout: 'Logout',
    addProduct: 'Add Product',
    myProducts: 'My Products',
    pricePredictor: 'Price Predictor',
    cropAdvisory: 'Crop Advisory',
    rewards: 'Rewards',
    notifications: 'Notifications',
    adoptFarmer: 'Adopt a Farmer',
    myAdoptions: 'My Adoptions',
    healthAdvisor: 'Health Advisor',
    shop: 'Shop Millets',
    cart: 'Cart',
    tipFarmer: 'Tip Farmer',
    milletType: 'Millet Type',
    quantity: 'Quantity (kg)',
    price: 'Price per kg',
    description: 'Description',
    save: 'Save',
    cancel: 'Cancel',
    buy: 'Buy Now',
    addToCart: 'Add to Cart',
    total: 'Total',
    checkout: 'Checkout',
    welcome: 'Welcome',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
  },
  hi: {
    appName: 'श्रीअन्ना कनेक्ट',
    tagline: 'मिलेट किसानों और उपभोक्ताओं को जोड़ना',
    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    phone: 'फोन नंबर',
    location: 'स्थान',
    age: 'आयु',
    role: 'मैं हूँ',
    farmer: 'किसान',
    consumer: 'उपभोक्ता',
    dashboard: 'डैशबोर्ड',
    products: 'उत्पाद',
    orders: 'आदेश',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
    addProduct: 'उत्पाद जोड़ें',
    myProducts: 'मेरे उत्पाद',
    pricePredictor: 'मूल्य पूर्वानुमान',
    cropAdvisory: 'फसल सलाह',
    rewards: 'पुरस्कार',
    notifications: 'सूचनाएं',
    adoptFarmer: 'किसान को गोद लें',
    myAdoptions: 'मेरे गोद लिए',
    healthAdvisor: 'स्वास्थ्य सलाहकार',
    shop: 'मिलेट खरीदें',
    cart: 'कार्ट',
    tipFarmer: 'किसान को टिप दें',
    milletType: 'मिलेट प्रकार',
    quantity: 'मात्रा (किलो)',
    price: 'प्रति किलो मूल्य',
    description: 'विवरण',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    buy: 'अभी खरीदें',
    addToCart: 'कार्ट में जोड़ें',
    total: 'कुल',
    checkout: 'चेकआउट',
    welcome: 'स्वागत',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्ते',
    goodEvening: 'शुभ संध्या',
  },
  te: {
    appName: 'శ్రీఅన్న కనెక్ట్',
    tagline: 'మిల్లెట్ రైతులు మరియు వినియోగదారులను కలుపుతోంది',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    fullName: 'పూర్తి పేరు',
    phone: 'ఫోన్ నంబర్',
    location: 'స్థానం',
    age: 'వయస్సు',
    role: 'నేను',
    farmer: 'రైతు',
    consumer: 'వినియోగదారు',
    dashboard: 'డ్యాష్‌బోర్డ్',
    products: 'ఉత్పత్తులు',
    orders: 'ఆర్డర్లు',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
    addProduct: 'ఉత్పత్తిని జోడించండి',
    myProducts: 'నా ఉత్పత్తులు',
    pricePredictor: 'ధర అంచనా',
    cropAdvisory: 'పంట సలహా',
    rewards: 'బహుమతులు',
    notifications: 'నోటిఫికేషన్లు',
    adoptFarmer: 'రైతును దత్తత తీసుకోండి',
    myAdoptions: 'నా దత్తత',
    healthAdvisor: 'ఆరోగ్య సలహాదారు',
    shop: 'మిల్లెట్లు కొనండి',
    cart: 'కార్ట్',
    tipFarmer: 'రైతుకు టిప్ ఇవ్వండి',
    milletType: 'మిల్లెట్ రకం',
    quantity: 'పరిమాణం (కిలోలు)',
    price: 'కిలో ధర',
    description: 'వివరణ',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    buy: 'ఇప్పుడే కొనండి',
    addToCart: 'కార్ట్‌కు జోడించండి',
    total: 'మొత్తం',
    checkout: 'చెక్అవుట్',
    welcome: 'స్వాగతం',
    goodMorning: 'శుభోదయం',
    goodAfternoon: 'నమస్కారం',
    goodEvening: 'శుభ సాయంత్రం',
  },
  ta: {
    appName: 'ஷ்ரீஅன்ன கனெக்ட்',
    tagline: 'சிறுதானிய விவசாயிகள் மற்றும் நுகர்வோரை இணைக்கிறது',
    login: 'உள்நுழைய',
    signup: 'பதிவு செய்ய',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    fullName: 'முழு பெயர்',
    phone: 'தொலைபேசி எண்',
    location: 'இடம்',
    age: 'வயது',
    role: 'நான்',
    farmer: 'விவசாயி',
    consumer: 'நுகர்வோர்',
    dashboard: 'டாஷ்போர்டு',
    products: 'பொருட்கள்',
    orders: 'ஆர்டர்கள்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    addProduct: 'பொருளைச் சேர்',
    myProducts: 'என் பொருட்கள்',
    pricePredictor: 'விலை கணிப்பு',
    cropAdvisory: 'பயிர் ஆலோசனை',
    rewards: 'வெகுமதிகள்',
    notifications: 'அறிவிப்புகள்',
    adoptFarmer: 'விவசாயியைத் தத்தெடு',
    myAdoptions: 'என் தத்தெடுப்புகள்',
    healthAdvisor: 'சுகாதார ஆலோசகர்',
    shop: 'சிறுதானியங்களை வாங்க',
    cart: 'வண்டி',
    tipFarmer: 'விவசாயிக்கு உதவி',
    milletType: 'சிறுதானிய வகை',
    quantity: 'அளவு (கிலோ)',
    price: 'கிலோ விலை',
    description: 'விவரம்',
    save: 'சேமி',
    cancel: 'ரத்து',
    buy: 'இப்போது வாங்க',
    addToCart: 'வண்டியில் சேர்',
    total: 'மொத்தம்',
    checkout: 'செக்அவுட்',
    welcome: 'வரவேற்பு',
    goodMorning: 'காலை வணக்கம்',
    goodAfternoon: 'மதிய வணக்கம்',
    goodEvening: 'மாலை வணக்கம்',
  },
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
