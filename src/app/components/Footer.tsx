import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Experience',
      links: [
        { label: 'Destinations', href: '/places' },
        { label: 'Cuisine Guide', href: '/food-guide' },
        { label: 'Trip Planner', href: '/trip-planner' },
        { label: 'My Itinerary', href: '/my-itinerary' },
      ]
    },
    {
      title: 'Culture',
      links: [
        { label: 'Kinyarwanda Guide', href: '#' },
        { label: 'Local Etiquette', href: '#' },
        { label: 'Annual Events', href: '#' },
        { label: 'Travel Safety', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Sura Rwanda', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-white pt-10 md:pt-16 pb-6 md:pb-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 md:mb-6 group">
              <Logo />
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">
                Sura<span className="text-primary">Rwanda</span>
              </span>
            </Link>
            <p className="text-xs md:text-sm text-slate-400 font-medium italic mb-4 md:mb-6 leading-relaxed max-w-sm">
              The definitive digital companion for exploring the Land of a Thousand Hills. Powered by local insight and global technology.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: '#16a34a' }}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center group"
                    >
                      <div className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-1.5 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Visit Us</p>
              <p className="text-sm font-bold">Kigali, Rwanda</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Call Us</p>
              <p className="text-sm font-bold">+250 788 000 000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Email Us</p>
              <p className="text-sm font-bold text-xs md:text-sm">explore@surarwanda.rw</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium">
            © {currentYear} Sura Rwanda. All rights reserved. Made for the Rwanda Innovation Hackathon.
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Proudly Rwandan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
