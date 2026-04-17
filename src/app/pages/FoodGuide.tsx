import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Utensils, Star, MapPin, DollarSign, Sparkles, ChefHat, Info } from 'lucide-react';
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

        setFoods(response.dishes);
        setRestaurants(response.restaurants);
        setTips(response.tips);
      } catch {
        if (active) setError('We could not load live cuisine data right now.');
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Rwandan Flavors</h1>
              <p className="text-slate-500 font-medium">Experience the authentic culinary heritage of Rwanda</p>
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
                <div key={index} className="glass rounded-3xl overflow-hidden border-border animate-pulse h-64" />
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
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              {/* Traditional Dishes */}
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <ChefHat className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Must-Try Dishes</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {foods.map((food, idx) => (
                    <motion.div 
                      key={food.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="card-lift glass rounded-3xl overflow-hidden border-border group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        {food.mustTry && (
                          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                            <Star className="w-3 h-3 fill-white" />
                            Elite Choice
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-black text-slate-900">{food.name}</h3>
                          <span className="text-primary font-black text-sm">{food.price}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{food.category}</p>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 italic leading-relaxed mb-6">{food.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {food.ingredients.slice(0, 3).map((ingredient) => (
                            <span key={ingredient} className="px-3 py-1 text-[10px] font-bold rounded-lg bg-slate-50 text-slate-600 border border-slate-100 uppercase tracking-wider">
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
                <div className="flex items-center gap-2 mb-8">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Top Dining Spots</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restaurants.map((restaurant, idx) => (
                    <motion.div 
                      key={restaurant.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="card-lift glass rounded-3xl p-8 border-border shadow-sm group transition-all hover:border-primary/20"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors tracking-tight">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            <MapPin className="w-4 h-4 text-primary/60" />
                            <span>{restaurant.location}</span>
                          </div>
                        </div>
                        <div className="bg-primary/10 text-primary p-2 rounded-xl">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-500 italic mb-6 leading-relaxed">{restaurant.specialty}</p>
                      <div className="flex items-center gap-1.5 pt-6 border-t border-slate-100">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className={`w-4 h-4 ${index < Math.round(restaurant.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}`} />
                        ))}
                        <span className="ml-2 text-xs font-black text-slate-900">{restaurant.rating}/5</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Tips & Etiquette */}
              {tips && (
                <div className="grid md:grid-cols-2 gap-8 pt-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-3xl p-10 border-border relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                      <ChefHat className="w-32 h-32 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-primary" />
                      Dining Etiquette
                    </h3>
                    <ul className="space-y-4">
                      {tips.etiquette.map((item) => (
                        <li key={item} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-slate-600 font-medium leading-relaxed italic">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-3xl p-10 border-border bg-slate-900 text-white relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                      <Utensils className="w-32 h-32 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <Info className="w-6 h-6 text-primary" />
                      Street Food Guide
                    </h3>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Elite Hubs</p>
                        <p className="text-slate-300 font-medium italic">{tips.streetFood.bestAreas.join(' • ')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Iconic Eats</p>
                        <p className="text-slate-300 font-medium italic">{tips.streetFood.popularItems.join(' • ')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Value Range</p>
                        <div className="flex flex-wrap gap-2">
                          {tips.streetFood.priceRange.map(price => (
                            <span key={price} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">{price}</span>
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
    </div>
  );
}

