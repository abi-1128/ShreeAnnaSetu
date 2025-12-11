import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../lib/supabase'
import {
  ShoppingCart,
  Heart,
  Award,
  MessageCircle,
  Search,
  Filter,
  DollarSign,
  User,
  Star,
} from 'lucide-react'
import Navbar from '../components/Navbar'

export default function ConsumerDashboard() {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [farmers, setFarmers] = useState({})
  const [adoptions, setAdoptions] = useState([])
  const [rewards, setRewards] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMillet, setSelectedMillet] = useState('all')
  const [cart, setCart] = useState([])
  const [showHealthAdvisor, setShowHealthAdvisor] = useState(false)
  const [healthRecommendations, setHealthRecommendations] = useState([])

  useEffect(() => {
    if (profile) {
      fetchProducts()
      fetchAdoptions()
      fetchRewards()
      generateHealthRecommendations()
    }
  }, [profile])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
      const farmerIds = [...new Set(data.map((p) => p.farmer_id))]
      fetchFarmers(farmerIds)
    }
  }

  const fetchFarmers = async (farmerIds) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, location')
      .in('id', farmerIds)

    if (data) {
      const farmerMap = {}
      data.forEach((f) => {
        farmerMap[f.id] = f
      })
      setFarmers(farmerMap)
    }
  }

  const fetchAdoptions = async () => {
    const { data } = await supabase
      .from('farmer_adoptions')
      .select('*')
      .eq('consumer_id', profile.id)
      .eq('status', 'active')

    if (data) setAdoptions(data)
  }

  const fetchRewards = async () => {
    const { data } = await supabase
      .from('rewards')
      .select('points')
      .eq('user_id', profile.id)

    if (data) {
      const total = data.reduce((sum, r) => sum + r.points, 0)
      setRewards(total)
    }
  }

  const generateHealthRecommendations = () => {
    const age = profile?.age || 30
    const recommendations = []

    if (age < 18) {
      recommendations.push({
        millet: 'Finger Millet',
        reason: 'Rich in calcium for growing bones and teeth',
        icon: '💪',
      })
      recommendations.push({
        millet: 'Pearl Millet',
        reason: 'High in iron for energy and growth',
        icon: '⚡',
      })
    } else if (age >= 18 && age < 40) {
      recommendations.push({
        millet: 'Foxtail Millet',
        reason: 'Low glycemic index, helps maintain energy levels',
        icon: '🏃',
      })
      recommendations.push({
        millet: 'Little Millet',
        reason: 'High in fiber, supports digestive health',
        icon: '🌿',
      })
    } else if (age >= 40 && age < 60) {
      recommendations.push({
        millet: 'Barnyard Millet',
        reason: 'Helps manage blood sugar and cholesterol',
        icon: '❤️',
      })
      recommendations.push({
        millet: 'Kodo Millet',
        reason: 'Rich in antioxidants, supports heart health',
        icon: '💚',
      })
    } else {
      recommendations.push({
        millet: 'Finger Millet',
        reason: 'High calcium content for bone health',
        icon: '🦴',
      })
      recommendations.push({
        millet: 'Sorghum',
        reason: 'Anti-inflammatory properties, good for joints',
        icon: '🌾',
      })
    }

    setHealthRecommendations(recommendations)
  }

  const handleAdoptFarmer = async (farmerId) => {
    const { error } = await supabase.from('farmer_adoptions').insert([
      {
        consumer_id: profile.id,
        farmer_id: farmerId,
      },
    ])

    if (!error) {
      fetchAdoptions()
      await supabase.from('rewards').insert([
        {
          user_id: profile.id,
          points: 50,
          earned_from: 'referral',
          description: 'Adopted a farmer',
        },
      ])
      fetchRewards()
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.millet_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMillet =
      selectedMillet === 'all' || product.millet_type === selectedMillet
    return matchesSearch && matchesMillet
  })

  const milletTypes = ['all', ...new Set(products.map((p) => p.millet_type))]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('goodMorning')
    if (hour < 17) return t('goodAfternoon')
    return t('goodEvening')
  }

  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <div className="wheat-shadow"></div>
      <div className="grass-footer">
        <div className="grass"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="glass rounded-3xl p-6 mb-6 fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()}, {profile?.full_name}! 🛒
              </h1>
              <p className="text-gray-600 mt-1">Discover fresh millets directly from farmers</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHealthAdvisor(true)}
                className="glass-strong px-4 py-2 rounded-xl hover-lift flex items-center gap-2"
              >
                <Heart className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Health Advisor</div>
                  <div className="text-sm font-semibold text-gray-800">Get Recommendations</div>
                </div>
              </button>
              <div className="glass-strong px-4 py-2 rounded-xl flex items-center gap-2">
                <Award className="w-5 h-5 text-farm-green" />
                <div>
                  <div className="text-xs text-gray-600">{t('rewards')}</div>
                  <div className="text-xl font-bold text-farm-green">{rewards}</div>
                </div>
              </div>
              <div className="glass-strong px-4 py-2 rounded-xl flex items-center gap-2 relative">
                <ShoppingCart className="w-5 h-5 text-farm-brown" />
                <div className="text-xl font-bold text-farm-brown">{cart.length}</div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6 fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search millets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedMillet}
                onChange={(e) => setSelectedMillet(e.target.value)}
                className="pl-12 pr-8 py-3 rounded-xl bg-white/60 border border-white/40 focus:border-farm-green transition-all appearance-none"
              >
                {milletTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Millets' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const farmer = farmers[product.farmer_id]
              const isAdopted = adoptions.some((a) => a.farmer_id === product.farmer_id)

              return (
                <div
                  key={product.id}
                  className="glass rounded-2xl overflow-hidden hover-lift card-hover fade-in"
                >
                  <div className="bg-gradient-to-br from-farm-wheat to-farm-green h-48 flex items-center justify-center text-6xl">
                    🌾
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {product.millet_type}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          by {farmer?.full_name || 'Farmer'}
                        </p>
                        {farmer?.location && (
                          <p className="text-xs text-gray-500">{farmer.location}</p>
                        )}
                      </div>
                      {!isAdopted && (
                        <button
                          onClick={() => handleAdoptFarmer(product.farmer_id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Adopt this farmer"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      )}
                      {isAdopted && (
                        <span className="text-red-500" title="You've adopted this farmer">
                          <Heart className="w-5 h-5 fill-current" />
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {product.description || 'Fresh and organic millets'}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Available</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {product.quantity_kg} kg
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-farm-green">
                          ₹{product.price_per_kg}
                        </div>
                        <div className="text-xs text-gray-500">per kg</div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-farm-green to-farm-brown text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {adoptions.length > 0 && (
          <div className="glass rounded-3xl p-6 mt-8 fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              {t('myAdoptions')}
            </h2>
            <p className="text-gray-600 mb-4">
              You're supporting {adoptions.length} farmer{adoptions.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {adoptions.map((adoption) => {
                const farmer = farmers[adoption.farmer_id]
                return (
                  <div key={adoption.id} className="bg-white/60 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-farm-green rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {farmer?.full_name?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {farmer?.full_name || 'Farmer'}
                        </h3>
                        <p className="text-sm text-gray-600">{farmer?.location || 'India'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showHealthAdvisor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Heart className="w-7 h-7 text-red-500" />
              AI Health Advisor
            </h2>
            <p className="text-gray-600 mb-6">
              Based on your age ({profile?.age || 'N/A'}) and health profile, we recommend:
            </p>

            <div className="space-y-4 mb-6">
              {healthRecommendations.map((rec, index) => (
                <div key={index} className="bg-white/60 rounded-xl p-4 hover:bg-white/80 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{rec.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{rec.millet}</h3>
                      <p className="text-sm text-gray-700 mt-1">{rec.reason}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Millets are naturally gluten-free, high in fiber, and
                packed with essential nutrients. They help manage diabetes, support heart health,
                and aid in weight management.
              </p>
            </div>

            <button
              onClick={() => setShowHealthAdvisor(false)}
              className="w-full bg-gradient-to-r from-farm-green to-farm-brown text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
