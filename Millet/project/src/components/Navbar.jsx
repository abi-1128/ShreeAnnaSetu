import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Sprout, LogOut, User, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="glass-strong sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8 text-farm-green" />
            <div>
              <h1 className="text-xl font-bold text-gradient">{t('appName')}</h1>
              <p className="text-xs text-gray-600">{t(profile?.role || 'dashboard')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {['en', 'hi', 'te', 'ta'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    language === lang
                      ? 'bg-farm-green text-white'
                      : 'bg-white/30 text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white/30 rounded-xl px-3 py-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {profile?.full_name}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
