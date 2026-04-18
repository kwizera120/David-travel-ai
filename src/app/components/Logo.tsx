import { motion } from 'motion/react';

export function Logo() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden group">
      <motion.img
        src="/logo.webp"
        alt="Sura Rwanda Logo"
        className="w-full h-full object-contain"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      />
    </div>
  );
}
