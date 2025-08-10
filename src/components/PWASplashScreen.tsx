import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PWASplashScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#22c55e] text-white"
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-widest">ORE+</div>
              <div className="opacity-90 mt-2">Carregando...</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 