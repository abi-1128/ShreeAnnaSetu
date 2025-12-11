import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Sprout, Mail, Lock, User, Phone, MapPin, Calendar, Loader2 } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    location: '',
    role: 'consumer',
    age: '',
    language_preference: 'en',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signUp(formData.email, formData.password, {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="wheat-shadow"></div>
      <div className="grass-footer">
        <div className="grass"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="glass rounded-3xl p-8 fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sprout className="w-10 h-10 text-farm-green mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gradient">{t('appName')}</h1>
              <p className="text-xs text-gray-600">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {['en', 'hi', 'te', 'ta'].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  changeLanguage(lang)
                  setFormData({ ...formData, language_preference: lang })
                }}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  language === lang
                    ? 'bg-farm-green text-white'
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('location')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('age')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('role')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'farmer' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'farmer'
                      ? 'border-farm-green bg-farm-green/10'
                      : 'border-white/40 bg-white/40 hover:border-farm-green/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🌾</div>
                  <div className="font-semibold">{t('farmer')}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'consumer' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'consumer'
                      ? 'border-farm-green bg-farm-green/10'
                      : 'border-white/40 bg-white/40 hover:border-farm-green/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🛒</div>
                  <div className="font-semibold">{t('consumer')}</div>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-farm-green to-farm-brown text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                t('signup')
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-farm-green font-semibold hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
