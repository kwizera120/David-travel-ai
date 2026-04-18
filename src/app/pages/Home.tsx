import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Map, MapPin, Utensils, ArrowRight, Globe, MessageCircle, ChevronLeft, ChevronRight, TreePine, Mountain, Heart, ShieldCheck, Ticket, Sparkles, Zap, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    { url: '/images/hero/hero-1.jpg', title: 'Discover the Land of a Thousand Hills' },
    { url: '/images/hero/hero-2.jpg', title: 'Meet the Majestic Mountain Gorillas' },
    { url: '/images/hero/hero-3.jpg', title: 'Find Serenity at Lake Kivu' },
    { url: '/images/hero/hero-4.jpg', title: 'Experience the Pulse of Kigali' },
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Iconic Places',
      description: 'Journey through volcanoes, rainforests, and vibrant cityscapes.',
      link: '/places',
      color: 'bg-emerald-600',
      ai: false
    },
    {
      icon: Utensils,
      title: 'Rwandan Flavors',
      description: 'Savor the authentic taste of tradition and modern cuisine.',
      link: '/food-guide',
      color: 'bg-amber-600',
      ai: false
    },
    {
      icon: Sparkles,
      title: 'AI Smart Planner',
      description: 'Neural-powered itineraries tailored to your unique travel style.',
      link: '/trip-planner',
      color: 'bg-indigo-600',
      ai: true
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <Navigation />
      
      {/* Premium Hero Section */}
      <div className="relative h-[92vh] min-h-[700px] overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={heroImages[currentSlide].url}
              alt={heroImages[currentSlide].title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/20 text-white mb-10"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-primary flex items-center justify-center text-[8px] font-bold">
                    AI
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI-Driven Travel Innovation</span>
            </motion.div>
            
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-6 tracking-tighter leading-[1.1] md:leading-[0.85] uppercase">
              {heroImages[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className={['rwanda', 'hills', 'gorillas', 'kivu', 'kigali'].includes(word.toLowerCase()) ? 'text-primary block md:inline' : ''}>{word}{' '}</span>
              ))}
            </h1>
            
            <p className="text-sm md:text-base text-slate-300 mb-5 md:mb-8 font-medium leading-relaxed max-w-xl italic font-serif">
              "Witness the transformation of a nation through personalized, high-tech exploration."
            </p>
            
            <div className="flex flex-wrap gap-2.5 md:gap-5">
              <Link to="/trip-planner" className="btn-primary flex items-center gap-2 py-2.5 md:py-3 px-5 md:px-8 rounded-lg md:rounded-xl group shadow-[0_12px_30px_rgba(22,163,74,0.25)]">
                <span className="text-sm md:text-base font-black uppercase tracking-tighter">Start AI Planning</span>
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link to="/places" className="glass text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-black uppercase tracking-tighter hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 text-xs md:text-sm">
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Explore Destinations</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Indicators */}
        <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex gap-3 z-20">
          {heroImages.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 md:w-12 bg-primary' : 'w-3 md:w-4 bg-white/30 hover:bg-white/50'}`} 
            />
          ))}
        </div>

        {/* Slide Controls - Hidden on very small screens */}
        <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 hidden sm:flex gap-4 z-20">
          <button onClick={prevSlide} className="p-3 md:p-5 rounded-full glass text-white hover:bg-primary transition-all hover:scale-110 active:scale-90">
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
          </button>
          <button onClick={nextSlide} className="p-3 md:p-5 rounded-full glass text-white hover:bg-primary transition-all hover:scale-110 active:scale-90">
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-14 gap-4 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2.5 text-primary mb-2 md:mb-4">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Core Ecosystem</span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-3 md:mb-5 uppercase leading-none">The Future of <span className="text-primary italic">Sura</span></h2>
            <p className="text-sm md:text-lg text-slate-500 font-medium italic leading-relaxed">Redefining the Rwandan experience with a blend of cultural authenticity and cutting-edge intelligence.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.link}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Link
                  to={feature.link}
                  className="card-lift glass rounded-xl md:rounded-2xl p-5 md:p-8 border-slate-100 group block h-full relative overflow-hidden bg-slate-50/50"
                >
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl ${feature.color} flex items-center justify-center mb-3 md:mb-6 shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:rotate-6`}>
                    <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  
                  {feature.ai && (
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-indigo-100 text-indigo-700 px-2.5 md:px-3 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Bot className="w-2.5 h-2.5" />
                      Neural Engine
                    </div>
                  )}

                  <h3 className="text-lg md:text-xl lg:text-2xl font-black text-slate-900 mb-2 md:mb-4 group-hover:text-primary transition-colors uppercase tracking-tighter">{feature.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-5 md:mb-8 italic">{feature.description}</p>
                  
                  <div className="flex items-center text-primary font-black uppercase tracking-tighter gap-2 text-[10px] md:text-xs">
                    Enter Platform
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Why Rwanda - Premium Showcase */}
      <section className="py-12 md:py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-blue-600/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8 md:mb-12 uppercase leading-[1.1] md:leading-[0.9]">
                Why <span className="text-primary italic underline decoration-white/20 underline-offset-8">Rwanda</span>?
              </h2>
              <div className="grid gap-6 md:gap-8">
                {[
                  { icon: TreePine, title: 'Mountain Gorillas', desc: 'Face-to-face with the gentle giants in high-altitude rainforests.' },
                  { icon: Mountain, title: 'Vivid Landscapes', desc: 'Mist-covered peaks and the volcanic majesty of the Virungas.' },
                  { icon: Heart, title: 'Profound Heritage', desc: 'A journey of resilience, unity, and unparalleled hospitality.' },
                  { icon: ShieldCheck, title: 'Premier Safety', desc: 'Globally ranked as one of the safest and cleanest nations on Earth.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4 md:gap-6 items-start group"
                  >
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white text-slate-400 transition-all duration-500">
                      <item.icon className="w-5 h-5 md:w-7 md:h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-1.5 md:mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-slate-400 text-sm md:text-base font-medium italic leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <div className="relative grid grid-cols-2 gap-3 md:gap-5">
              <div className="space-y-3 md:space-y-5">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="overflow-hidden rounded-xl md:rounded-[2rem] shadow-xl border md:border-2 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/parks/volcanoes-park.jpg" alt="Gorilla" className="w-full h-48 md:h-[350px] object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="overflow-hidden rounded-xl md:rounded-[2rem] shadow-xl border md:border-2 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/lakes/lake-kivu.jpg" alt="Lake Kivu" className="w-full h-36 md:h-60 object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
              </div>
              <div className="space-y-3 md:space-y-5 pt-8 md:pt-16">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="overflow-hidden rounded-xl md:rounded-[2rem] shadow-xl border md:border-2 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/cities/kigali.jpg" alt="Kigali city" className="w-full h-36 md:h-60 object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="overflow-hidden rounded-xl md:rounded-[2rem] shadow-xl border md:border-2 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/parks/nyungwe-forest.jpg" alt="Nyungwe" className="w-full h-48 md:h-[350px] object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right scale-110" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter uppercase leading-[1.1] md:leading-[0.9]">Synthesize Your <span className="text-primary italic">Epic</span> Journey</h2>
            <p className="text-base md:text-xl text-slate-500 mb-8 md:mb-12 font-medium italic max-w-2xl mx-auto leading-relaxed">
              Unlock the power of AI to curate a travel experience that resonates with your soul.
            </p>
            <Link to="/trip-planner" className="btn-primary inline-flex items-center gap-3 md:gap-4 py-4 md:py-6 px-8 md:px-12 rounded-xl md:rounded-2xl group shadow-[0_20px_40px_rgba(22,163,74,0.3)]">
              <span className="text-lg md:text-xl font-black uppercase tracking-tighter">Enter Strategy Room</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-3 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
