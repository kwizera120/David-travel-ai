import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { MapPin, Star, Clock, DollarSign, TreePine, Waves, Building2, Mountain, Heart, Hotel, Sparkles } from 'lucide-react';
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
    { id: 'All', name: 'All', icon: MapPin },
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

        setPlaces(response.data);
        setStats(response.stats);
      } catch {
        if (active) setError('We could not load live destination data right now.');
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Explore Rwanda</h1>
              <p className="text-slate-500 font-medium">Discover the hidden gems of the thousand hills</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-green-600/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Stats Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Parks', value: stats.parks, icon: TreePine, color: 'text-green-600' },
            { label: 'Lakes', value: stats.lakes, icon: Waves, color: 'text-blue-600' },
            { label: 'Culture', value: stats.culture, icon: Heart, color: 'text-pink-600' },
            { label: 'Hotels', value: stats.hotels, icon: Hotel, color: 'text-violet-600' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 border-border shadow-sm flex flex-col items-center justify-center text-center group transition-all hover:border-primary/20">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
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
                <div key={index} className="glass rounded-3xl overflow-hidden border-border animate-pulse">
                  <div className="h-64 bg-slate-100" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-slate-100 rounded-full w-2/3" />
                    <div className="h-4 bg-slate-50 rounded-full" />
                    <div className="h-4 bg-slate-50 rounded-full w-5/6" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-12 text-center border-red-100"
            >
              <p className="text-red-500 font-bold">{error}</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {places.map((place, idx) => (
                <motion.div
                  key={place.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 3) * 0.1 }}
                  className="card-lift glass rounded-3xl overflow-hidden border-border group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-xl">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-black text-slate-900">{place.rating}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {place.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                      {place.name}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm mb-6 line-clamp-2 leading-relaxed italic">
                      {place.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4 text-primary/60" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{place.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign className="w-4 h-4 text-primary/60" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{place.price}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Must Experience</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {place.activities.slice(0, 3).map((activity) => (
                          <span key={activity} className="px-3 py-1 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100 uppercase tracking-wider">
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
    </div>
  );
}

