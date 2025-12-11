# ShreeAnna Connect - Getting Started Guide

## Welcome to ShreeAnna Connect! 🌾

A beautiful, AI-powered platform connecting millet farmers with conscious consumers.

## Features Implemented ✅

### 🔐 Authentication System
- **Role-based signup/login** (Farmer & Consumer)
- Secure authentication with Supabase
- Profile management
- Multilingual support (English, Hindi, Telugu, Tamil)

### 👨‍🌾 Farmer Dashboard
- **Add Products**: Upload millet type, quantity, and pricing
- **AI Price Predictor**: View predicted market prices
- **Crop Advisory System**: Get AI-powered farming recommendations
- **Notifications**: Receive weather alerts and government scheme updates
- **Rewards System**: Track points and earnings
- **Beautiful Glassmorphism UI** with animated wheat shadows

### 🛒 Consumer Dashboard
- **Shop Millets**: Browse products from farmers
- **Search & Filter**: Find specific millet types
- **AI Health Advisor**: Get personalized millet recommendations based on age
- **Adopt a Farmer**: Support farmers directly
- **Shopping Cart**: Add items and checkout
- **Rewards Points**: Earn points on purchases and adoptions

### 🎨 Design Features
- **Glassmorphism Theme**: Frosted glass effects throughout
- **Animated Background**: Moving wheat shadows and grass footer
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Hover effects, transitions, and fades
- **Natural Color Palette**: Pastel greens, browns, and ivory tones

### 🌍 Multilingual Support
- English
- Hindi (हिंदी)
- Telugu (తెలుగు)
- Tamil (தமிழ்)

## Quick Start

### 1. Test the Application

**Create a Farmer Account:**
- Go to signup
- Choose "Farmer" role
- Fill in details
- Add products from dashboard

**Create a Consumer Account:**
- Go to signup
- Choose "Consumer" role
- Enter age for health recommendations
- Browse products and adopt farmers

### 2. Key Features to Try

**As a Farmer:**
1. Add your first millet product
2. View AI price predictions
3. Check crop advisories
4. Monitor notifications

**As a Consumer:**
1. Click "Health Advisor" to get personalized recommendations
2. Browse and search for millets
3. Adopt a farmer by clicking the heart icon
4. Add products to cart

### 3. Sample Price Predictions

The database includes sample predictions for:
- Foxtail Millet: ₹65.50/kg
- Pearl Millet: ₹72.00/kg
- Finger Millet: ₹68.75/kg
- Little Millet: ₹70.25/kg
- Kodo Millet: ₹75.00/kg

## Technical Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS v4 (Glassmorphism)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router

## Database Schema

### Tables Created:
1. **profiles** - User profiles with role (farmer/consumer)
2. **products** - Millet products from farmers
3. **orders** - Purchase transactions
4. **farmer_adoptions** - Consumer-farmer connections
5. **rewards** - Points and rewards tracking
6. **price_predictions** - AI-powered price forecasts
7. **crop_advisories** - Farming recommendations
8. **notifications** - Alerts and updates

All tables have Row Level Security (RLS) enabled for data protection.

## Future Enhancements (Not Yet Implemented)

- Payment Gateway Integration (Razorpay/Stripe)
- Voice Assistant (Text-to-Speech & Speech-to-Text)
- Real-time Weather API Integration
- Government Scheme API Integration
- AI Chatbot for product queries
- Order management and tracking
- Farmer microloans system
- Advanced ML price prediction model
- Push notifications
- Image upload for products

## Notes

- Payment integration requires API keys (not implemented)
- Voice features require additional APIs
- Weather alerts need OpenWeatherMap API
- Government schemes need data.gov.in API

Enjoy building the future of sustainable farming! 🌱
