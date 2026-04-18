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
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-10 tracking-tighter leading-[1.1] md:leading-[0.85] uppercase">
              {heroImages[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className={['rwanda', 'hills', 'gorillas', 'kivu', 'kigali'].includes(word.toLowerCase()) ? 'text-primary block md:inline' : ''}>{word}{' '}</span>
              ))}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 md:mb-14 font-medium leading-relaxed max-w-3xl italic font-serif">
              "Witness the transformation of a nation through personalized, high-tech exploration."
            </p>
            
            <div className="flex flex-wrap gap-4 md:gap-8">
              <Link to="/trip-planner" className="btn-primary flex items-center gap-3 md:gap-4 py-4 md:py-6 px-8 md:px-12 rounded-2xl md:rounded-[2rem] group shadow-[0_20px_50px_rgba(22,163,74,0.4)]">
                <span className="text-lg md:text-xl font-black uppercase tracking-tighter">Start AI Planning</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-3 transition-transform" />
              </Link>
              <Link to="/places" className="glass text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-tighter hover:bg-white hover:text-slate-900 transition-all flex items-center gap-3 md:gap-4">
                <Globe className="w-5 h-5 md:w-6 md:h-6" />
                <span>Explore Map</span>
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
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 text-primary mb-4 md:mb-6">
              <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Core Ecosystem</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6 md:mb-8 uppercase leading-none">The Future of <span className="text-primary italic">Sura</span></h2>
            <p className="text-lg md:text-2xl text-slate-500 font-medium italic leading-relaxed">Redefining the Rwandan experience with a blend of cultural authenticity and cutting-edge intelligence.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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
                  className="card-lift glass rounded-3xl md:rounded-[3rem] p-8 md:p-12 border-slate-100 group block h-full relative overflow-hidden bg-slate-50/50"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${feature.color} flex items-center justify-center mb-6 md:mb-10 shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-6`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  
                  {feature.ai && (
                    <div className="absolute top-6 md:top-8 right-6 md:right-8 bg-indigo-100 text-indigo-700 px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Bot className="w-3 h-3" />
                      Neural Engine
                    </div>
                  )}

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4 md:mb-6 group-hover:text-primary transition-colors uppercase tracking-tighter">{feature.title}</h3>
                  <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-12 italic">{feature.description}</p>
                  
                  <div className="flex items-center text-primary font-black uppercase tracking-tighter gap-3 text-xs md:text-sm">
                    Enter Platform
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-4 transition-transform duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Why Rwanda - Premium Showcase */}
      <section className="py-16 md:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-blue-600/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-12 md:mb-16 uppercase leading-[1.1] md:leading-[0.9]">
                Why <span className="text-primary italic underline decoration-white/20 underline-offset-8">Rwanda</span>?
              </h2>
              <div className="grid gap-8 md:gap-10">
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
                    className="flex gap-6 md:gap-8 items-start group"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white text-slate-400 transition-all duration-500">
                      <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2 md:mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-slate-400 text-base md:text-lg font-medium italic leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <div className="relative grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="overflow-hidden rounded-2xl md:rounded-[3rem] shadow-2xl border-2 md:border-4 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/parks/volcanoes-park.jpg" alt="Gorilla" className="w-full h-64 md:h-[450px] object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="overflow-hidden rounded-2xl md:rounded-[3rem] shadow-2xl border-2 md:border-4 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/lakes/lake-kivu.jpg" alt="Lake Kivu" className="w-full h-48 md:h-80 object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
              </div>
              <div className="space-y-4 md:space-y-6 pt-12 md:pt-24">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="overflow-hidden rounded-2xl md:rounded-[3rem] shadow-2xl border-2 md:border-4 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/cities/kigali.jpg" alt="Kigali city" className="w-full h-48 md:h-80 object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="overflow-hidden rounded-2xl md:rounded-[3rem] shadow-2xl border-2 md:border-4 border-white/5"
                >
                  <ImageWithFallback src="/images/attractions/parks/nyungwe-forest.jpg" alt="Nyungwe" className="w-full h-64 md:h-[450px] object-cover hover:scale-110 transition-transform duration-1000" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-white py-20 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right scale-110" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 md:mb-10 tracking-tighter uppercase leading-[1.1] md:leading-[0.9]">Synthesize Your <span className="text-primary italic">Epic</span> Journey</h2>
            <p className="text-lg md:text-2xl text-slate-500 mb-12 md:mb-16 font-medium italic max-w-3xl mx-auto leading-relaxed">
              Unlock the power of AI to curate a travel experience that resonates with your soul.
            </p>
            <Link to="/trip-planner" className="btn-primary inline-flex items-center gap-4 md:gap-6 py-5 md:py-8 px-10 md:px-16 rounded-2xl md:rounded-[2.5rem] group shadow-[0_30px_60px_rgba(22,163,74,0.4)]">
              <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">Enter Strategy Room</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-4 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
