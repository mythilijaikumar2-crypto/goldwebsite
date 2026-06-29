import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LuxuryLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 600); // Wait for progress bar to settle
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-luxury-bg select-none"
        >
          {/* Subtle moving particles in backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative flex flex-col items-center">
            {/* Elegant SVG Crown/Jewel Outline Draw */}
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-8"
            >
              <motion.path
                d="M50 15L65 40L90 45L70 65L75 90L50 75L25 90L30 65L10 45L35 40L50 15Z"
                stroke="#D4AF37"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.circle
                cx="50"
                cy="15"
                r="3"
                fill="#F5D78E"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              <motion.circle
                cx="90"
                cy="45"
                r="3"
                fill="#F5D78E"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
              <motion.circle
                cx="10"
                cy="45"
                r="3"
                fill="#F5D78E"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              />
            </motion.svg>

            {/* Brand Title */}
            <motion.h1
              initial={{ letterSpacing: '0.4em', opacity: 0 }}
              animate={{ letterSpacing: '0.2em', opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="font-heading text-3xl md:text-4xl font-light text-gold-light uppercase"
            >
              JKS Jewels
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-luxury text-sm md:text-base italic text-luxury-white mt-2 tracking-widest"
            >
              Timeless Elegance, Crafted in Gold
            </motion.p>
          </div>

          {/* Loader bar */}
          <div className="absolute bottom-20 w-64 h-px bg-neutral-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: 'easeInOut' }}
              className="h-full bg-linear-to-r from-gold-dark via-gold-primary to-gold-light"
            />
          </div>

          {/* Progress Percent */}
          <motion.span
            className="absolute bottom-12 font-body text-xs text-gold-primary tracking-widest uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Heritage {Math.min(progress, 100)}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default LuxuryLoader;
