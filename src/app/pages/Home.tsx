import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { LanguageChatbot } from '../components/LanguageChatbot';
import { Compass, MapPin, Utensils, ArrowRight, Sparkles, MessageCircle, ChevronLeft, ChevronRight, TreePine, Mountain, Heart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export function Home() {
  const [showChatbot, setShowChatbot] = useState(false);
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
      color: 'bg-green-600'
    },
    {
      icon: Utensils,
      title: 'Rwandan Flavors',
      description: 'Savor the authentic taste of tradition and modern cuisine.',
      link: '/food-guide',
      color: 'bg-orange-600'
    },
    {
      icon: Compass,
      title: 'Smart Planner',
      description: 'AI-crafted itineraries tailored to your unique travel style.',
      link: '/trip-planner',
      color: 'bg-blue-600'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Premium Hero Section */}
      <div className="relative h-[85vh] min-h-[600px] overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={heroImages[currentSlide].url}
              alt={heroImages[currentSlide].title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-white mb-8">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Next-Gen Travel Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              {heroImages[currentSlide].title.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase() === 'rwanda' ? 'text-primary' : ''}>{word}{' '}</span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 font-medium leading-relaxed max-w-2xl italic">
              Experience Rwanda like never before with AI-personalized journeys, cultural deep-dives, and seamless planning.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/trip-planner" className="btn-primary flex items-center gap-3 py-5 px-10 rounded-2xl">
                <span className="text-lg font-black uppercase tracking-tighter">Start Your Story</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              <button
                onClick={() => setShowChatbot(true)}
                className="glass text-white px-10 py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-white hover:text-slate-900 transition-all flex items-center gap-3"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Speak Kinyarwanda</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-12 right-12 flex gap-4 z-20">
          <button onClick={prevSlide} className="p-4 rounded-2xl glass text-white hover:bg-primary transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="p-4 rounded-2xl glass text-white hover:bg-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase">The Ultimate Platform</h2>
            <p className="text-xl text-slate-500 font-medium italic">Everything you need to navigate the heart of Africa with confidence and style.</p>
          </div>
          <div className="h-px flex-1 bg-slate-100 mb-6 hidden md:block" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className="card-lift glass rounded-[2.5rem] p-10 border-border group block h-full relative overflow-hidden"
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-xl shadow-slate-200 group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-10 italic">{feature.description}</p>
                  <div className="flex items-center text-primary font-black uppercase tracking-tighter gap-2">
                    Explore Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Why Rwanda - Premium Showcase */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-12 uppercase leading-none">
                Why <span className="text-primary">Rwanda</span>?
              </h2>
              <div className="grid gap-8">
                {[
                  { icon: TreePine, title: 'Mountain Gorillas', desc: 'Face-to-face with the gentle giants of Volcanoes National Park.' },
                  { icon: Mountain, title: 'Vivid Landscapes', desc: 'From misty peaks to the sparkling expanse of Lake Kivu.' },
                  { icon: Heart, title: 'Profound Heritage', desc: 'Deeply moving history and a future built on unity and warmth.' },
                  { icon: ShieldCheck, title: 'Premier Safety', desc: 'Recognized globally as one of the cleanest and safest nations.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{item.title}</h3>
                      <p className="text-slate-500 font-medium italic">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <ImageWithFallback src="/images/attractions/parks/volcanoes-park.jpg" alt="Gorilla" className="w-full h-80 object-cover rounded-[2rem] shadow-2xl card-lift" />
                <ImageWithFallback src="/images/attractions/lakes/lake-kivu.jpg" alt="Lake Kivu" className="w-full h-64 object-cover rounded-[2rem] shadow-2xl card-lift" />
              </div>
              <div className="space-y-4 pt-12">
                <ImageWithFallback src="/images/attractions/cities/kigali.jpg" alt="Kigali city" className="w-full h-64 object-cover rounded-[2rem] shadow-2xl card-lift" />
                <ImageWithFallback src="/images/attractions/parks/nyungwe-forest.jpg" alt="Nyungwe" className="w-full h-80 object-cover rounded-[2rem] shadow-2xl card-lift" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #16a34a 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-none">Your Rwanda Story Starts Here</h2>
            <p className="text-xl text-slate-400 mb-12 font-medium italic max-w-2xl mx-auto leading-relaxed">
              Don't just visit. Discover. Connect. Transform.
            </p>
            <Link to="/trip-planner" className="btn-primary inline-flex items-center gap-4 py-6 px-12 rounded-2xl">
              <Sparkles className="w-6 h-6" />
              <span className="text-xl font-black uppercase tracking-tighter">Plan Your Journey</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Language Chatbot Overlay */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <LanguageChatbot onClose={() => setShowChatbot(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Floating Button */}
      {!showChatbot && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-10 right-10 bg-primary text-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(22,163,74,0.3)] z-40 group flex items-center gap-3 overflow-hidden"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-black uppercase tracking-tighter">
            Speak Kinyarwanda
          </span>
        </motion.button>
      )}
    </div>
  );
}

}
