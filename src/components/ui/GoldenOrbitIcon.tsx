import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryIconProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  isLarge?: boolean;
  active?: boolean;
}

const LuxuryIcon: React.FC<LuxuryIconProps> = ({ 
  children, 
  className = '',
  glowColor = 'rgba(232, 201, 106, 0.5)',
  isLarge = false,
  active
}) => {
  const [isInternalHovered, setIsInternalHovered] = useState(false);
  const isHovered = active !== undefined ? active : isInternalHovered;

  // Dynamic values based on icon size - BOOSTED VERSION
  const particleCount = isLarge ? 12 : 6;
  const liftAmount = isLarge ? -25 : -10;
  const shadowScale = isLarge ? 2.2 : 1.6;

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      onMouseEnter={() => setIsInternalHovered(true)}
      onMouseLeave={() => setIsInternalHovered(false)}
    >
      {/* 1. Dynamic Shadow/Aura Underneath (BOOSTED) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: shadowScale, 
              y: isLarge ? 45 : 12,
              transition: { duration: 0.5, ease: "backOut" }
            }}
            exit={{ opacity: 0, scale: 0.2, y: 0 }}
            className="absolute rounded-full blur-2xl pointer-events-none z-0"
            style={{ 
              width: '100%', 
              height: '14px', 
              backgroundColor: glowColor,
              boxShadow: `0 0 70px 25px ${glowColor}`
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. Floating Golden Particles (BOOSTED) */}
      <AnimatePresence>
        {isHovered && Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.3, 0.5],
              x: (Math.random() - 0.5) * (isLarge ? 260 : 90),
              y: (Math.random() - 0.5) * (isLarge ? 260 : 90),
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.1 + Math.random(), 
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeOut"
            }}
            className="absolute w-[3.5px] h-[3.5px] bg-gold rounded-full z-20 pointer-events-none"
            style={{ 
              boxShadow: '0 0 14px 4px rgba(232, 201, 106, 0.9)',
              backgroundColor: '#E8C96A'
            }}
          />
        ))}
      </AnimatePresence>

      {/* 3. The Icon itself (Clean & Free) */}
      <motion.div
        animate={isHovered ? { y: liftAmount, scale: isLarge ? 1.08 : 1.15 } : { y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 220, 
          damping: 18
        }}
        className="relative z-10 overflow-visible"
      >
        {/* The Actual Icon Component - No more overflow-hidden or shimmer! */}
        <div className={isHovered ? "drop-shadow-[0_0_25px_rgba(232,201,106,0.7)] transition-all duration-300" : ""}>
          {children}
        </div>
      </motion.div>

      {/* Forced Global Styles for Stroke Glowing (More intense) */}
      <style>{`
        .group:hover svg {
          stroke: #E8C96A !important;
          filter: drop-shadow(0 0 15px rgba(232, 201, 106, 0.7));
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
};

export default LuxuryIcon;
