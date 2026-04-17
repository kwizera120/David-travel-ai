import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Map, Users, Calendar, Check, ArrowRight, CloudSun, Banknote, Briefcase, Globe, Info, ClipboardCheck, Navigation2, TrendingUp, Sparkles, Utensils, Ticket } from 'lucide-react';
import { Link } from 'react-router';
import { tripPlannerAPI, type TripPlan } from '../api/travelApi';
import { aiApi } from '../api/aiApi';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function TripPlanner() {
  const { isAuthenticated } = useAuth();
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [fromCity, setFromCity] = useState('Kigali');
  const [toCity, setToCity] = useState('');
  const [transportType, setTransportType] = useState('Bus');
  const [demand, setDemand] = useState('Medium');
  
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions = [
    'Wildlife & Safaris',
    'Culture & History',
    'Adventure Sports',
    'Relaxation',
    'Photography',
    'Local Cuisine',
  ];

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest],
    );
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Get original plan (mock or existing backend)
      const nextPlan = await tripPlannerAPI.generatePlan({
        budget: Number(budget),
        duration: Number(duration),
        travelers: Number(travelers),
        interests,
      });
      setPlan(nextPlan);

      // 2. Get AI Recommendations from the new Python backend
      const distanceResult = await aiApi.getRouteDistance(fromCity, toCity || 'Gisenyi');
      const distance = distanceResult.success ? distanceResult.distance_km : 150;

      const [aiRecResult, priceResult] = await Promise.all([
        aiApi.recommendTrip({
          from_city: fromCity,
          to_city: toCity || 'Gisenyi',
          distance_km: distance,
          transport_type: transportType,
          demand: demand,
          budget_usd: Number(budget),
          duration_days: Number(duration),
          travelers: Number(travelers),
          interests,
        }),
        aiApi.predictPrice({
          from_city: fromCity,
          to_city: toCity || 'Gisenyi',
          distance_km: distance,
          transport_type: transportType,
          demand: demand,
        })
      ]);

      if (aiRecResult.recommendations) {
        setAiRecommendations(aiRecResult.recommendations);
      }
      if (priceResult.predicted_price) {
        setPredictedPrice(priceResult.predicted_price);
      }

    } catch (err) {
      console.error(err);
      setError('AI Synthesis partially failed, but here is your draft plan.');
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = budget && duration && travelers && interests.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
              <Map className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">Journey Architect</h1>
              <p className="text-slate-500 font-medium italic">Professional itineraries synchronized with live travel, weather, and logistics data.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-[2.5rem] p-8 border-border shadow-sm h-fit"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Project Parameters
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departure</label>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Kigali"
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 focus:ring-primary rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="e.g. Gisenyi"
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 focus:ring-primary rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transport</label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 focus:ring-primary rounded-xl"
                  >
                    <option value="Bus">Public Bus</option>
                    <option value="Taxi">Private Taxi</option>
                    <option value="Rental">Car Rental</option>
                    <option value="Motorcycle">Moto-Taxi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Demand Level</label>
                  <select
                    value={demand}
                    onChange={(e) => setDemand(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 focus:ring-primary rounded-xl"
                  >
                    <option value="Low">Low Season</option>
                    <option value="Medium">Regular</option>
                    <option value="High">Holiday Peak</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Investment (USD)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="e.g. 3000"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 focus:ring-primary rounded-2xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration (Days)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    placeholder="e.g. 7"
                    className="w-full px-4 py-4 bg-slate-50 border-slate-200 focus:ring-primary rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Travelers</label>
                  <input
                    type="number"
                    value={travelers}
                    onChange={(event) => setTravelers(event.target.value)}
                    placeholder="e.g. 2"
                    className="w-full px-4 py-4 bg-slate-50 border-slate-200 focus:ring-primary rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Interests</label>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all duration-300 border-2 ${
                        interests.includes(interest)
                          ? 'border-primary bg-primary text-white shadow-lg shadow-green-600/20'
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generatePlan}
                disabled={!canGenerate || loading}
                className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" 
                    />
                    <span className="text-lg font-black uppercase tracking-tighter">AI Synthesis in progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-black uppercase tracking-tighter">Generate AI Plan</span>
                  </>
                )}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-amber-700 font-bold text-sm italic"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!plan && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-[2.5rem] p-12 border-border border-dashed border-4 text-center flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">AI Neural Engine Ready</h3>
                  <p className="text-slate-500 font-medium italic max-w-sm">
                    Enter your trip parameters to see real-time AI predictions, budget modeling, and professional recommendations.
                  </p>
                </div>
              </motion.div>
            ) : plan && !isAuthenticated ? (
              <motion.div 
                key="login-gate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2.5rem] p-12 border-primary/20 bg-slate-900 text-white text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Map className="w-48 h-48" />
                </div>
                <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-600/40">
                  <ClipboardCheck className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tighter uppercase leading-none">Strategy Defined</h3>
                <p className="text-slate-400 font-medium italic mb-10 text-lg leading-relaxed">
                  A high-performance itinerary has been synthesized based on your specifications. Secure your access to view full logistics.
                </p>
                <div className="flex flex-col gap-4">
                  <Link
                    to="/login"
                    className="btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 group"
                  >
                    <span className="text-lg font-black uppercase tracking-tighter">Authenticate Access</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ) : plan && isAuthenticated ? (
              <motion.div 
                key="plan-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-12"
              >
                {/* AI Logistics Strategy */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-10">
                      <TrendingUp className="w-32 h-32" />
                   </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                       <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">AI Logistics Strategy</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Predicted Fare (RWF)</p>
                      <p className="text-4xl font-black text-primary">
                        {predictedPrice ? `~ ${predictedPrice.toLocaleString()}` : 'Calculating...'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Route Complexity</p>
                      <p className="text-3xl font-black">{demand} Demand</p>
                    </div>
                  </div>
                  <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 italic">
                      * Predicted price is based on machine learning modeling of historical data and current demand levels.
                    </p>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="glass rounded-[2.5rem] p-8 border-primary/20 bg-green-50/50">
                  <div className="flex items-center gap-3 mb-6">
                    <Bot className="w-6 h-6 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">AI Personal Recommendations</h3>
                  </div>
                  <div className="space-y-4">
                    {aiRecommendations.length > 0 ? (
                      aiRecommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-sm text-slate-600 font-medium italic">{rec}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic">Synthesizing personalized advice...</p>
                    )}
                  </div>
                </div>

                {/* Existing Plan Data */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass rounded-3xl p-6 border-border group transition-all hover:border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <CloudSun className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Live Weather</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-600 italic">
                      {plan.liveContext.weather.city}: {plan.liveContext.weather.temperature}°C, {plan.liveContext.weather.description}
                    </p>
                  </div>
                  <div className="glass rounded-3xl p-6 border-border group transition-all hover:border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Exchange (RWF)</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-600 italic">1 USD ≈ {plan.liveContext.exchangeRates.usdToRwf} RWF</p>
                  </div>
                </div>

                {[
                  { title: 'Accommodation Options', items: plan.accommodation, icon: Briefcase },
                  { title: 'Strategized Activities', items: plan.activities, icon: Map },
                  { title: 'Culinary Selection', items: plan.food, icon: Utensils },
                ].map((section, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass rounded-3xl p-8 border-border"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <section.icon className="w-5 h-5 text-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{section.title}</h3>
                    </div>
                    <ul className="grid gap-4">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-slate-600 italic">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}

                <Link
                  to="/my-itinerary"
                  className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 group shadow-2xl shadow-green-500/30"
                >
                  <span className="text-lg font-black uppercase tracking-tighter">Commit to Itinerary</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}

