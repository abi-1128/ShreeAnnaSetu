import { useState, useEffect } from 'react'
import { Mic, Volume2, X, Loader2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function VoiceAssistant({ onClose }) {
  const { t, language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false

      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
      }
      recognitionInstance.lang = langMap[language] || 'en-US'

      recognitionInstance.onresult = (event) => {
        const spokenText = event.results[0][0].transcript
        setTranscript(spokenText)
        setIsListening(false)
        handleVoiceCommand(spokenText)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [language])

  const handleVoiceCommand = async (text) => {
    const lowerText = text.toLowerCase()
    let reply = ''

    if (lowerText.includes('price') || lowerText.includes('rate') || lowerText.includes('दाम') || lowerText.includes('ధర') || lowerText.includes('விலை')) {
      reply = getTranslation('priceResponse')
    } else if (lowerText.includes('weather') || lowerText.includes('मौसम') || lowerText.includes('వాతావరణం') || lowerText.includes('வானிலை')) {
      reply = getTranslation('weatherResponse')
    } else if (lowerText.includes('product') || lowerText.includes('add') || lowerText.includes('उत्पाद') || lowerText.includes('ఉత్పత్తి') || lowerText.includes('தயாரிப்பு')) {
      reply = getTranslation('productResponse')
    } else if (lowerText.includes('advisory') || lowerText.includes('सलाह') || lowerText.includes('సలహా') || lowerText.includes('ஆலோசனை')) {
      reply = getTranslation('advisoryResponse')
    } else {
      reply = getTranslation('defaultResponse')
    }

    setResponse(reply)
    speak(reply)
  }

  const getTranslation = (key) => {
    const translations = {
      en: {
        priceResponse: 'Current millet prices are looking good! Foxtail millet is at 65 rupees per kg, and Pearl millet is at 72 rupees per kg.',
        weatherResponse: 'Today looks sunny with good conditions for harvesting. Temperature is moderate at 28 degrees.',
        productResponse: 'You can add your products from the dashboard. Just click on Add Product and fill in the details.',
        advisoryResponse: 'For best results, ensure proper irrigation this week. Weather looks favorable for growth.',
        defaultResponse: 'How can I help you today? You can ask about prices, weather, products, or farming advice.',
      },
      hi: {
        priceResponse: 'वर्तमान में बाजरा की कीमतें अच्छी हैं! कंगनी बाजरा 65 रुपये प्रति किलो और बाजरा 72 रुपये प्रति किलो है।',
        weatherResponse: 'आज धूप खिली है और फसल की कटाई के लिए अच्छी स्थिति है। तापमान 28 डिग्री है।',
        productResponse: 'आप डैशबोर्ड से अपने उत्पाद जोड़ सकते हैं। बस उत्पाद जोड़ें पर क्लिक करें और विवरण भरें।',
        advisoryResponse: 'सर्वोत्तम परिणामों के लिए, इस सप्ताह उचित सिंचाई सुनिश्चित करें। मौसम विकास के लिए अनुकूल है।',
        defaultResponse: 'मैं आज आपकी कैसे मदद कर सकता हूं? आप कीमतों, मौसम, उत्पादों या खेती की सलाह के बारे में पूछ सकते हैं।',
      },
      te: {
        priceResponse: 'ప్రస్తుతం జొన్నల ధరలు బాగున్నాయి! కొర్రలు 65 రూపాయలు కిలో మరియు సజ్జలు 72 రూపాయలు కిలో.',
        weatherResponse: 'ఈరోజు ఎండగా ఉంది మరియు పంట కోత కోసం మంచి పరిస్థితులు ఉన్నాయి. ఉష్ణోగ్రత 28 డిగ్రీలు.',
        productResponse: 'మీరు డాష్‌బోర్డ్ నుండి మీ ఉత్పత్తులను జోడించవచ్చు. ఉత్పత్తిని జోడించు క్లిక్ చేసి వివరాలు పూరించండి.',
        advisoryResponse: 'ఉత్తమ ఫలితాల కోసం, ఈ వారం సరైన నీటిపారుదల నిర్ధారించండి. వాతావరణం పెరుగుదలకు అనుకూలంగా ఉంది.',
        defaultResponse: 'ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను? మీరు ధరలు, వాతావరణం, ఉత్పత్తులు లేదా వ్యవసాయ సలహా గురించి అడగవచ్చు.',
      },
      ta: {
        priceResponse: 'தற்போது சிறுதானிய விலைகள் நன்றாக உள்ளன! தினை 65 ரூபாய் கிலோ மற்றும் கம்பு 72 ரூபாய் கிலோ.',
        weatherResponse: 'இன்று வெயில் நன்றாக உள்ளது மற்றும் அறுவடைக்கு நல்ல நிலைமைகள் உள்ளன. வெப்பநிலை 28 டிகிரி.',
        productResponse: 'டாஷ்போர்டிலிருந்து உங்கள் தயாரிப்புகளைச் சேர்க்கலாம். பொருளைச் சேர் என்பதைக் கிளிக் செய்து விவரங்களை நிரப்பவும்.',
        advisoryResponse: 'சிறந்த முடிவுகளுக்கு, இந்த வாரம் சரியான நீர்ப்பாசனத்தை உறுதி செய்யவும். வானிலை வளர்ச்சிக்கு சாதகமாக உள்ளது.',
        defaultResponse: 'இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் விலைகள், வானிலை, தயாரிப்புகள் அல்லது விவசாய ஆலோசனை பற்றி கேட்கலாம்.',
      },
    }

    return translations[language]?.[key] || translations.en[key]
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)

      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
      }
      utterance.lang = langMap[language] || 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1.0

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognition) {
      setTranscript('')
      setResponse('')
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-strong max-w-2xl w-full p-8 fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-yellow to-primary-orange flex items-center justify-center glow-yellow">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{t('voiceAssistant') || 'Voice Assistant'}</h2>
              <p className="text-sm text-gray-600">{t('speakToGetHelp') || 'Speak to get instant help'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 glow-orange animate-pulse'
                  : isSpeaking
                  ? 'bg-gradient-to-r from-primary-yellow to-primary-orange opacity-50'
                  : 'bg-gradient-to-r from-primary-yellow to-primary-orange hover:scale-110 glow-yellow'
              }`}
            >
              {isListening ? (
                <div className="flex flex-col items-center">
                  <Mic className="w-12 h-12 text-white animate-pulse" />
                  <span className="text-xs text-white mt-2">Listening...</span>
                </div>
              ) : isSpeaking ? (
                <div className="flex flex-col items-center">
                  <Volume2 className="w-12 h-12 text-white animate-pulse" />
                  <span className="text-xs text-white mt-2">Speaking...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="w-12 h-12 text-white" />
                  <span className="text-xs text-white mt-2">Tap to speak</span>
                </div>
              )}
            </button>
          </div>

          {transcript && (
            <div className="glass-yellow p-4 rounded-2xl">
              <p className="text-xs text-gray-600 mb-1 font-semibold">You said:</p>
              <p className="text-gray-800 font-medium">{transcript}</p>
            </div>
          )}

          {response && (
            <div className="glass-green p-4 rounded-2xl">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Assistant:</p>
              <p className="text-gray-800 font-medium">{response}</p>
            </div>
          )}

          {!transcript && !response && (
            <div className="glass p-6 rounded-2xl text-center">
              <p className="text-gray-600 mb-4">
                {t('voiceAssistantHelp') || 'Try asking:'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/50 rounded-xl p-3 text-sm">
                  <span className="text-2xl mb-1 block">💰</span>
                  <span className="text-gray-700 font-medium">What are today's prices?</span>
                </div>
                <div className="bg-white/50 rounded-xl p-3 text-sm">
                  <span className="text-2xl mb-1 block">🌤️</span>
                  <span className="text-gray-700 font-medium">How's the weather?</span>
                </div>
                <div className="bg-white/50 rounded-xl p-3 text-sm">
                  <span className="text-2xl mb-1 block">📦</span>
                  <span className="text-gray-700 font-medium">How to add products?</span>
                </div>
                <div className="bg-white/50 rounded-xl p-3 text-sm">
                  <span className="text-2xl mb-1 block">🌱</span>
                  <span className="text-gray-700 font-medium">Farming advice?</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Make sure your microphone is enabled. Speak clearly in your preferred language.
          </p>
        </div>
      </div>
    </div>
  )
}
