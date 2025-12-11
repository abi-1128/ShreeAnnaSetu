import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../lib/supabase'
import {
  Package,
  TrendingUp,
  Lightbulb,
  Bell,
  Gift,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Sun,
  CloudRain,
  Wind,
} from 'lucide-react'
import Navbar from '../components/Navbar'

export default function FarmerDashboard() {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [rewards, setRewards] = useState([])
  const [notifications, setNotifications] = useState([])
  const [predictions, setPredictions] = useState([])
  const [advisories, setAdvisories] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [totalRewards, setTotalRewards] = useState(0)
  const [newProduct, setNewProduct] = useState({
    millet_type: '',
    quantity_kg: '',
    price_per_kg: '',
    description: '',
  })

  useEffect(() => {
    if (profile) {
      fetchProducts()
      fetchRewards()
      fetchNotifications()
      fetchPredictions()
      fetchAdvisories()
    }
  }, [profile])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', profile.id)
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
  }

  const fetchRewards = async () => {
    const { data } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (data) {
      setRewards(data)
      const total = data.reduce((sum, r) => sum + r.points, 0)
      setTotalRewards(total)
    }
  }

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) setNotifications(data)
  }

  const fetchPredictions = async () => {
    const { data } = await supabase
      .from('price_predictions')
      .select('*')
      .order('prediction_date', { ascending: false })
      .limit(5)

    if (data) setPredictions(data)
  }

  const fetchAdvisories = async () => {
    const { data } = await supabase
      .from('crop_advisories')
      .select('*')
      .eq('farmer_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(3)

    if (data) setAdvisories(data)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('products').insert([
      {
        farmer_id: profile.id,
        ...newProduct,
        quantity_kg: parseFloat(newProduct.quantity_kg),
        price_per_kg: parseFloat(newProduct.price_per_kg),
      },
    ])

    if (!error) {
      setNewProduct({
        millet_type: '',
        quantity_kg: '',
        price_per_kg: '',
        description: '',
      })
      setShowAddProduct(false)
      fetchProducts()
    }
  }

  const handleDeleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('goodMorning')
    if (hour < 17) return t('goodAfternoon')
    return t('goodEvening')
  }

  const milletTypes = [
    'Foxtail Millet',
    'Pearl Millet',
    'Finger Millet',
    'Little Millet',
    'Kodo Millet',
    'Proso Millet',
    'Barnyard Millet',
    'Sorghum',
  ]

  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <div className="wheat-shadow"></div>
      <div className="grass-footer">
        <div className="grass"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="glass rounded-3xl p-6 mb-6 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()}, {profile?.full_name}! 🌾
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome to your farming dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-strong px-4 py-2 rounded-xl flex items-center gap-2">
                <Gift className="w-5 h-5 text-farm-green" />
                <div>
                  <div className="text-xs text-gray-600">{t('rewards')}</div>
                  <div className="text-xl font-bold text-farm-green">{totalRewards}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-2xl p-6 hover-lift card-hover fade-in">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-farm-green" />
              <div className="text-3xl">📦</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t('myProducts')}</h3>
            <p className="text-3xl font-bold text-farm-green mt-2">{products.length}</p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift card-hover fade-in">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-blue-500" />
              <div className="text-3xl">📈</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t('pricePredictor')}</h3>
            <p className="text-sm text-gray-600 mt-2">AI-powered insights</p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift card-hover fade-in">
            <div className="flex items-center justify-between mb-4">
              <Lightbulb className="w-10 h-10 text-yellow-500" />
              <div className="text-3xl">💡</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t('cropAdvisory')}</h3>
            <p className="text-sm text-gray-600 mt-2">Expert guidance</p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift card-hover fade-in">
            <div className="flex items-center justify-between mb-4">
              <Bell className="w-10 h-10 text-red-500" />
              <div className="text-3xl">🔔</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t('notifications')}</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {notifications.filter((n) => !n.is_read).length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="glass rounded-3xl p-6 fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-6 h-6 text-farm-green" />
                {t('myProducts')}
              </h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-farm-green text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('addProduct')}
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products yet. Add your first product!</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/60 rounded-xl p-4 hover:bg-white/80 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{product.millet_type}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm">
                            <span className="font-medium">Qty:</span> {product.quantity_kg} kg
                          </span>
                          <span className="text-sm">
                            <span className="font-medium">Price:</span> ₹{product.price_per_kg}/kg
                          </span>
                        </div>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              {t('pricePredictor')}
            </h2>

            <div className="space-y-3">
              {predictions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No predictions available</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      AI-powered price predictions will appear here based on market trends,
                      weather patterns, and demand forecasts.
                    </p>
                  </div>
                </div>
              ) : (
                predictions.map((pred) => (
                  <div key={pred.id} className="bg-white/60 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800">{pred.millet_type}</h3>
                        <p className="text-sm text-gray-600">
                          Confidence: {(pred.confidence_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{pred.predicted_price}
                        </div>
                        <div className="text-xs text-gray-500">per kg</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              {t('cropAdvisory')}
            </h2>

            <div className="space-y-3">
              {advisories.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    AI-powered crop advisories will help you with irrigation, fertilization,
                    pest management, and best practices based on your location and weather.
                  </p>
                </div>
              ) : (
                advisories.map((adv) => (
                  <div key={adv.id} className="bg-white/60 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{adv.crop_type}</h3>
                    <p className="text-sm text-gray-700">{adv.advisory_text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(adv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-500" />
              {t('notifications')}
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-xl p-4 ${
                      notif.is_read ? 'bg-white/40' : 'bg-white/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.type === 'weather' && (
                        <CloudRain className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                      {notif.type === 'scheme' && (
                        <Gift className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {notif.type === 'alert' && (
                        <Bell className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('addProduct')}</h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('milletType')}
                </label>
                <select
                  value={newProduct.millet_type}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, millet_type: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                  required
                >
                  <option value="">Select Millet Type</option>
                  {milletTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quantity')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.quantity_kg}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantity_kg: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('price')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price_per_kg}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price_per_kg: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description')}
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-farm-green to-farm-brown text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-white/60 text-gray-700 py-3 rounded-xl font-semibold hover:bg-white/80 transition-all"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
