# 🦍 SURA RWANDA - The Future of Rwandan Tourism

Sura Rwanda is a premium, AI-driven tourism ecosystem designed to redefine how travelers experience the Land of a Thousand Hills. By blending cultural authenticity with cutting-edge artificial intelligence, Sura provides a seamless, high-tech journey through Rwanda's vibrant landscapes and rich heritage.

## 🚀 Key Innovations

### 🧠 Neural Trip Architect
Our flagship feature, the **Journey Architect**, uses machine learning to synthesize professional itineraries. It doesn't just suggest places; it models your budget, predicts logistics costs, and adapts to real-time weather and demand levels.

### 💬 Sura AI Assistant
A sophisticated, multi-modal chatbot integrated across the entire platform. 
- **Travel Chat:** Powered by Groq/Llama3 for deep cultural insights and travel advice.
- **Real-time Translation:** Instant Kinyarwanda, French, and Swahili translation to bridge the gap between travelers and locals.

### 📊 Predictive Logistics Engine
Integrated machine learning models that predict transport fares across Rwanda based on transport type, distance, and seasonal demand.

### 🍱 Cultural Flavor Profile
A comprehensive guide to Rwandan gastronomy, with AI-curated culinary selections and etiquette insights.

## 🏗️ Technical Architecture

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS 4.0 with a custom "Glassmorphism" design system
- **Animations:** Motion (Framer Motion 12) for smooth, high-end transitions
- **Icons:** Lucide React for professional, consistent iconography

### AI Service (Backend)
- **Engine:** FastAPI (Python 3.10+)
- **LLM:** Groq (Llama 3 70B) for high-speed, intelligent conversations
- **Prediction:** Scikit-learn models for fare prediction
- **Translation:** LibreTranslate integration for private, secure translations

## 📁 Project Structure

```
sura-rwanda/
├── src/
│   ├── app/
│   │   ├── api/              # Unified API layer (Frontend & AI)
│   │   ├── components/       # High-end UI components (AIChatbot, Navigation, etc.)
│   │   ├── pages/            # Page components (Home, TripPlanner, etc.)
│   │   └── routes.tsx        # React Router 7 configuration
├── ai_service/               # 🧠 Python AI Backend
│   ├── backend/              # AI Core logic (chatbot, predictor, translator)
│   ├── data/                 # Training data and route datasets
│   └── main.py               # FastAPI entry point
├── public/
│   └── images/               # High-resolution optimized assets
└── package.json              # Modern dependency management
```

## 🛠️ Getting Started

### 1. Frontend Setup
```bash
npm install
npm run dev
```

### 2. AI Service Setup
```bash
cd ai_service
pip install -r requirements.txt
python -m backend.main
```

## 🎨 Design Philosophy
Sura Rwanda adheres to a **Premium-Modernist** aesthetic:
- **Glassmorphism:** Using backdrop-blur and semi-transparent layers for depth.
- **Nature-Inspired Palette:** Deep Forest Green (#16a34a), Slate Gray, and Vibrant Golden accents.
- **Responsive-First:** Fully optimized for mobile explorers and desktop strategists alike.

---

**Built with ❤️ for Rwanda's Digital Transformation** 🇷🇼  
*Revolutionizing tourism through artificial intelligence.*
