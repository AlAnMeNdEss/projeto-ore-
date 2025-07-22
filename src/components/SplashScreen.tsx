import { motion } from 'framer-motion';

export function SplashScreen() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 100%)',
      }}
    >
      <h1
        className="font-logo text-7xl select-none"
        style={{ color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}
      >
        Ore<span className="text-white/80">+</span>
      </h1>
    </motion.section>
  );
} 