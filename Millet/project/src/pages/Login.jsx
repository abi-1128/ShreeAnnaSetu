import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Sprout, Mail, Lock, Loader2 } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-md z-10">
        <div className="glass p-10 fade-in float-animation">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-yellow to-primary-orange flex items-center justify-center glow-yellow mr-4">
              <Sprout className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">{t('appName')}</h1>
              <p className="text-sm text-gray-700 font-medium mt-1">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {['en', 'hi', 'te', 'ta'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  language === lang
                    ? 'bg-gradient-to-r from-primary-yellow to-primary-orange text-white glow-yellow'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-orange" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/70 border-2 border-primary-yellow/30 focus:border-primary-orange transition-all font-medium text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-orange" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/70 border-2 border-primary-yellow/30 focus:border-primary-orange transition-all font-medium text-gray-800"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Loading...
                </>
              ) : (
                t('login')
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-700 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-orange font-bold hover:underline text-lg">
              {t('signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
