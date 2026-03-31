import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isGallery = location.pathname === '/gallery';
  const isBook = location.pathname === '/book';
  const isShop = location.pathname === '/shop';
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [path, setPath] = useState('');
  const [topShape, setTopShape] = useState('');
  const [bottomShape, setBottomShape] = useState('');

  // Fixed Golden Timing (Seconds)
  const DOOR_DURATION = 1.8;

  useEffect(() => {
    if (!isGallery && !isBook && !isShop) {
      setIsTransitioning(false);
      return;
    }

    if (isGallery) {
      const y1 = 20 + Math.random() * 60;
      const y2 = 20 + Math.random() * 60;
      const curve = `C 30 ${y1}, 70 ${y2}, 105 50`;
      const reverseCurve = `C 70 ${y2}, 30 ${y1}, -5 50`;
      setPath(`M -5 50 ${curve}`);
      setTopShape(`M -5 -5 L 105 -5 L 105 50 ${reverseCurve} Z`);
      setBottomShape(`M -5 105 L 105 105 L 105 50 ${reverseCurve} Z`);
    }

    setIsTransitioning(true);
    const timeout = isShop ? (DOOR_DURATION + 0.2) * 1000 : isBook ? 1600 : 1800;
    const timer = setTimeout(() => setIsTransitioning(false), timeout);
    return () => clearTimeout(timer);
  }, [location.pathname, isGallery, isBook, isShop]);

  if (!isGallery && !isBook && !isShop) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {children}
      </motion.div>
    );
  }

  const swarmChars = ["أ", "ب", "ج", "د", "ر", "ز", "س", "ش", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي", "ط", "ظ", "ح", "خ"];
  const swarmData = Array.from({ length: 45 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 400 + Math.random() * 400;
    return {
        initialX: Math.cos(angle) * distance,
        initialY: Math.sin(angle) * distance,
        char: swarmChars[i % swarmChars.length],
        delay: Math.random() * 0.4,
        scale: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * 360
    };
  });

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-hidden perspective-[2000px]">
      {/* Underlying Content: Centered Prestige Zoom */}
      <motion.div 
        key={location.pathname + "-content"}
        initial={isShop ? { scale: 0.3, opacity: 0 } : { opacity: 1 }}
        animate={isShop ? { 
            scale: isTransitioning ? [0.3, 1] : 1, 
            opacity: 1,
            transition: { duration: DOOR_DURATION, ease: [0.76, 0, 0.24, 1] } 
        } : { opacity: 1 }}
        className="relative z-0"
      >
         {children}
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] pointer-events-none"
          >
            {/* --- GALLERY: Wavy Wavy Split --- */}
            {isGallery && (
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <motion.path d={topShape} fill="#0a0a0a" initial={{ y: 0 }} animate={{ y: [0, 0, -115] }} transition={{ duration: 1.8, times: [0, 0.4, 1], ease: [0.76, 0, 0.24, 1] }} />
                  <motion.path d={bottomShape} fill="#0a0a0a" initial={{ y: 0 }} animate={{ y: [0, 0, 115] }} transition={{ duration: 1.8, times: [0, 0.4, 1], ease: [0.76, 0, 0.24, 1] }} />
                  <motion.path d={path} fill="transparent" stroke="#c9a84c" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: 1.8, times: [0, 0.4, 1], ease: "easeInOut" }} />
               </svg>
            )}

            {/* --- BOOK: Ink Swarm --- */}
            {isBook && (
               <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black-deep">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 1.2 }} className="absolute inset-0 bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {swarmData.map((data, i) => (
                      <motion.span key={i} initial={{ opacity: 0, scale: 0, x: data.initialX, y: data.initialY, rotate: data.rotation }} animate={{ opacity: [0, 1, 0], scale: [0.2, data.scale, 0.2], x: 0, y: 0, rotate: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: data.delay }} className="absolute text-gold text-5xl font-serif drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]">{data.char}</motion.span>
                    ))}
                  </div>
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 60], opacity: [0, 1, 1, 0] }} transition={{ scale: { duration: 1.6, times: [0, 0.3, 1], ease: [0.76, 0, 0.24, 1] }, opacity: { duration: 1.6, times: [0, 0.1, 0.9, 1] } }} className="w-48 h-48 bg-[#050505] rounded-full shadow-[0_0_60px_rgba(201,168,76,0.6)] border-2 border-gold/30 flex items-center justify-center"><div className="absolute inset-0 rounded-full border border-gold/10 animate-spin-slow" /></motion.div>
                  <motion.h2 initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: [0, 1, 0], scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="absolute text-gold text-6xl font-arabic z-20 drop-shadow-[0_0_15px_rgba(201,168,76,0.9)]">انعطاف</motion.h2>
               </div>
            )}

            {/* --- SHOP: Original Palace Entry Appearance (Synced Logic) --- */}
            {isShop && (
               <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black-deep/50 overflow-hidden">
                  {/* Left Door Panel (Original V1 Look) */}
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -100 }}
                    transition={{ duration: DOOR_DURATION, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute left-0 w-1/2 h-full bg-[#0a0a0a] border-r border-gold/20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] origin-left z-20"
                  >
                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />
                     <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-gold/30 rounded-full blur-[2px]" />
                  </motion.div>

                  {/* Right Door Panel (Original V1 Look) */}
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 100 }}
                    transition={{ duration: DOOR_DURATION, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute right-0 w-1/2 h-full bg-[#0a0a0a] border-l border-gold/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] origin-right z-20"
                  >
                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />
                     <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-gold/30 rounded-full blur-[2px]" />
                  </motion.div>
                  
                  {/* Central Glow Burst */}
                  <motion.div 
                    initial={{ opacity: 1, scaleX: 0 }}
                    animate={{ opacity: [1, 0], scaleX: [0, 25] }}
                    transition={{ duration: DOOR_DURATION }}
                    className="absolute inset-y-0 w-4 bg-gold/30 blur-2xl z-10"
                  />
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
