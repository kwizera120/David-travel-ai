import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { MapPin, Star, Clock, DollarSign, TreePine, Waves, Building2, Mountain, Heart, Hotel, Sparkles, Map } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { attractionsAPI, type Attraction } from '../api/travelApi';
import { dummyPlaces } from '../utils/dummyData';
import { motion, AnimatePresence } from 'framer-motion';

export function Places() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [places, setPlaces] = useState<Attraction[]>(dummyPlaces as unknown as Attraction[]);
  const [stats, setStats] = useState({ parks: 4, lakes: 3, culture: 4, hotels: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'All', name: 'All', icon: Map },
    { id: 'Parks', name: 'Parks', icon: TreePine },
    { id: 'Lakes', name: 'Lakes', icon: Waves },
    { id: 'Cities', name: 'Cities', icon: Building2 },
    { id: 'Mountains', name: 'Mountains', icon: Mountain },
    { id: 'Culture', name: 'Culture', icon: Heart },
    { id: 'Hotels', name: 'Hotels', icon: Hotel },
  ];

  useEffect(() => {
    let active = true;

    async function loadPlaces() {
      try {
        setLoading(true);
        setError(null);
        const response = await attractionsAPI.getAll(selectedCategory);

        if (!active) return;

        let data = response.data;
        if (data.length === 0) {
          data = selectedCategory === 'All' 
            ? dummyPlaces 
            : dummyPlaces.filter(p => p.category === selectedCategory);
        }
        
        setPlaces(data as unknown as Attraction[]);
        setStats(response.stats || { parks: 4, lakes: 3, culture: 4, hotels: 5 });
      } catch {
        if (active) {
          // Fallback to dummy data on error
          const data = selectedCategory === 'All' 
            ? dummyPlaces 
            : dummyPlaces.filter(p => p.category === selectedCategory);
          setPlaces(data as unknown as Attraction[]);
          setStats({ parks: 4, lakes: 3, culture: 4, hotels: 5 });
          // Optional: still show a small warning instead of blocking the whole UI
          console.warn('Live destination data sync failed, using local cache.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPlaces();
    return () => { active = false; };
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
              <MapPin className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">The Destinations</h1>
              <p className="text-sm md:text-base text-slate-500 font-medium italic mt-2">Discover the soul of the thousand hills through our curated selection.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-300 border-2 ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-xl shadow-green-600/20'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Stats Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: 'Wildlife Parks', value: stats.parks, icon: TreePine, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Water Bodies', value: stats.lakes, icon: Waves, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Heritage Sites', value: stats.culture, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Premium Stays', value: stats.hotels, icon: Hotel, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-3xl p-6 border-border shadow-sm flex flex-col items-center justify-center text-center group transition-all hover:bg-white hover:shadow-xl">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass rounded-[2.5rem] overflow-hidden border-border animate-pulse">
                  <div className="h-72 bg-slate-100" />
                  <div className="p-10 space-y-6">
                    <div className="h-8 bg-slate-100 rounded-xl w-2/3" />
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-50 rounded-lg" />
                      <div className="h-4 bg-slate-50 rounded-lg w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[2.5rem] p-16 text-center border-red-100 max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sync Error</h3>
              <p className="text-slate-500 font-medium italic">{error}</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {places.map((place, idx) => (
                <motion.div
                  key={place.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 3) * 0.1, type: "spring", stiffness: 100 }}
                  className="card-lift glass rounded-[2.5rem] overflow-hidden border-border group bg-white hover:bg-slate-50/50"
                >
                  <div className="relative h-72 overflow-hidden">
                    <ImageWithFallback src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-6 left-6">
                       <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                        {place.category}
                      </span>
                    </div>

                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-2 px-3 flex items-center gap-1.5 shadow-2xl border border-white/20">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-slate-900">{place.rating}</span>
                    </div>

                    <div className="absolute bottom-6 left-8 right-8">
                       <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-md">
                        {place.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-10">
                    <p className="text-slate-500 font-medium text-sm mb-8 line-clamp-2 leading-relaxed italic">
                      {place.description}
                    </p>

                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{place.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <DollarSign className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{place.price}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Signature Experiences</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {place.activities.slice(0, 3).map((activity) => (
                          <span key={activity} className="px-4 py-2 rounded-xl text-[10px] font-bold bg-white text-slate-600 border border-slate-100 uppercase tracking-tighter transition-colors hover:border-primary/20 hover:bg-slate-50">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

import { AlertCircle } from 'lucide-react';


