import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Utensils, Star, MapPin, DollarSign, Sparkles, ChefHat, Info, Coffee } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { foodAPI, type Food, type Restaurant } from '../api/travelApi';
import { dummyFoods, dummyRestaurants } from '../utils/dummyData';
import { motion, AnimatePresence } from 'framer-motion';

export function FoodGuide() {
  const [foods, setFoods] = useState<Food[]>(dummyFoods as unknown as Food[]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(dummyRestaurants as Restaurant[]);
  const [tips, setTips] = useState<{
    etiquette: string[];
    streetFood: {
      bestAreas: string[];
      popularItems: string[];
      priceRange: string[];
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFoods() {
      try {
        setLoading(true);
        setError(null);
        const response = await foodAPI.getAll();

        if (!active) return;

        setFoods(response.dishes.length > 0 ? response.dishes : dummyFoods as unknown as Food[]);
        setRestaurants(response.restaurants.length > 0 ? response.restaurants : dummyRestaurants as Restaurant[]);
        setTips(response.tips || {
          etiquette: ['Wash hands before eating', 'Wait for the host to begin', 'Accept food with both hands'],
          streetFood: {
            bestAreas: ['Nyamirambo', 'Remera'],
            popularItems: ['Brochettes', 'Sambaza'],
            priceRange: ['$ - $$']
          }
        });
      } catch {
        if (active) {
          // Fallback to dummy data on error
          setFoods(dummyFoods as unknown as Food[]);
          setRestaurants(dummyRestaurants as Restaurant[]);
          setTips({
            etiquette: ['Wash hands before eating', 'Wait for the host to begin', 'Accept food with both hands'],
            streetFood: {
              bestAreas: ['Nyamirambo', 'Remera'],
              popularItems: ['Brochettes', 'Sambaza'],
              priceRange: ['$ - $$']
            }
          });
          console.warn('Live cuisine data sync failed, using local cache.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFoods();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
              <Utensils className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">The Cuisine</h1>
              <p className="text-sm md:text-base text-slate-500 font-medium italic mt-2">Savor the authentic culinary heritage and contemporary flavors of Rwanda.</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && foods.length === 0 ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="glass rounded-[2.5rem] overflow-hidden border-border animate-pulse h-72" />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[2.5rem] p-16 text-center border-red-100 max-w-2xl mx-auto"
            >
              <Info className="w-12 h-12 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sync Error</h3>
              <p className="text-slate-500 font-medium italic">{error}</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-24"
            >
              {/* Traditional Dishes */}
              <section>
                <div className="flex items-center gap-3 mb-10">
                  <ChefHat className="w-7 h-7 text-primary" />
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Iconic Dishes</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {foods.map((food, idx) => (
                    <motion.div 
                      key={food.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                      className="card-lift glass rounded-[2.5rem] overflow-hidden border-border group bg-white"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <ImageWithFallback src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {food.mustTry && (
                          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                            <Star className="w-3 h-3 fill-white" />
                            Premium Selection
                          </div>
                        )}
                        <div className="absolute bottom-4 left-6">
                           <h3 className="text-xl font-black text-white tracking-tighter uppercase">{food.name}</h3>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{food.category}</p>
                          <span className="text-slate-900 font-black text-sm">{food.price}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 italic leading-relaxed mb-8">{food.description}</p>
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                          {food.ingredients.slice(0, 3).map((ingredient) => (
                            <span key={ingredient} className="px-3 py-1.5 text-[9px] font-black rounded-lg bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-tighter hover:bg-white transition-colors">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Restaurants */}
              <section>
                <div className="flex items-center gap-3 mb-10">
                  <Coffee className="w-7 h-7 text-primary" />
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Elite Establishments</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restaurants.map((restaurant, idx) => (
                    <motion.div 
                      key={restaurant.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="card-lift glass rounded-[2.5rem] p-10 border-border shadow-sm group bg-white hover:bg-slate-50/50"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors tracking-tighter uppercase leading-none">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[9px]">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{restaurant.location}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 text-primary p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-500 italic mb-10 leading-relaxed border-l-4 border-primary/20 pl-4">{restaurant.specialty}</p>
                      <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} className={`w-3.5 h-3.5 ${index < Math.round(restaurant.rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{restaurant.rating} / 5.0</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Tips & Etiquette */}
              {tips && (
                <div className="grid md:grid-cols-2 gap-10 pt-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-[2.5rem] p-12 border-border relative overflow-hidden group bg-white"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-700">
                      <ChefHat className="w-40 h-40 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-tighter">
                      <Sparkles className="w-7 h-7 text-primary" />
                      Cultural Etiquette
                    </h3>
                    <ul className="space-y-6">
                      {tips.etiquette.map((item) => (
                        <li key={item} className="flex items-start gap-6 group/item">
                          <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0 group-hover/item:scale-150 transition-transform" />
                          <span className="text-slate-600 font-medium leading-relaxed italic text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-[2.5rem] p-12 border-slate-800 bg-slate-900 text-white relative overflow-hidden group shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                      <Utensils className="w-40 h-40 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
                      <Info className="w-7 h-7 text-primary" />
                      Street Logistics
                    </h3>
                    <div className="space-y-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Elite Hubs</p>
                        <p className="text-slate-300 font-medium italic text-lg leading-relaxed">{tips.streetFood.bestAreas.join(' • ')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Iconic Eats</p>
                        <p className="text-slate-300 font-medium italic text-lg leading-relaxed">{tips.streetFood.popularItems.join(' • ')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Capital Allocation</p>
                        <div className="flex flex-wrap gap-3">
                          {tips.streetFood.priceRange.map(price => (
                            <span key={price} className="px-5 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/20 transition-colors">{price}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}


