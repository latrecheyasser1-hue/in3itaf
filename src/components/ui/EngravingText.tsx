import React, { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const EngravingText: React.FC = () => {
  const { settings } = useSettings();
  const flashControls = useAnimation();
  const textControls = useAnimation();

  // Create 80 dense particles targeting random horizontal locations exclusively tracking the literal width of the word
  const particles = useMemo(() => Array.from({ length: 80 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const startRadius = 300 + Math.random() * 400; // start exceptionally far away
    
    // Distribute targets strictly mapping the exact physical bounds of the text 
    // (centering flawlessly owing to the w-max tracking the word's authentic width)
    const targetX = (Math.random() - 0.5) * 360; 
    const targetY = (Math.random() - 0.5) * 100; // slightly thicker vertically at the center

    return {
      id: i,
      startX: Math.cos(angle) * startRadius,
      startY: Math.sin(angle) * startRadius,
      targetX,
      targetY,
      size: Math.random() * 3.5 + 1.5,
      delay: Math.random() * 0.4, 
      duration: 0.8 + Math.random() * 0.4, // ultra-fast gathering (max 1.2s total flight avoiding premature text showing)
    };
  }), []);

  useEffect(() => {
    const sequence = async () => {
      // 1. Wait for precisely 1.0s ensuring the dense swarming hits maximum convergence
      await new Promise(r => setTimeout(r, 1000));
      
      // 2. A massive blinding flash ignites EXACTLY bridging the fast particles transitioning flawlessly into the text outline
      flashControls.start({
        scale: [0, 1.5, 3, 0],
        opacity: [0, 0.9, 1, 0],
        transition: { 
            duration: 0.8, // plays out strictly from 1.0s to 1.8s
            ease: "easeInOut",
            times: [0, 0.4, 0.7, 1] 
        }
      });

      // 3. Just as the flash hits peak blinding intensity (t=1.3s), instantly spawn the word completely hidden inside the brightness
      await new Promise(r => setTimeout(r, 300));
      
      await textControls.start({
        opacity: [0, 1, 1], // Popping in seamlessly within the opaque flash layer
        filter: [
            // Combine drop-shadow into string to preserve rendering during filter transitions
            "drop-shadow(2px 4px 6px rgba(0,0,0,0.8)) blur(20px) brightness(4)",  // Blindingly bright transforming from pure light
            "drop-shadow(2px 4px 6px rgba(0,0,0,0.8)) blur(4px) brightness(2)",   // Forging into rigid shape rapidly
            "drop-shadow(2px 4px 6px rgba(0,0,0,0.8)) blur(0px) brightness(1)"    // Settling into pure crisp majestic gold styling
        ],
        scale: [0.9, 1.05, 1], // Explosive majestic pop locking straight into final layout width
        transition: { 
            duration: 1.0,  // finishes settling perfectly at t=2.3s
            ease: "easeOut",
            times: [0, 0.4, 1] 
        }
      });

      // 4. Start the infinite "Wamiidh" (pulsing/shimmering glow) looping endlessly gracefully
      textControls.start({
        filter: [
            "drop-shadow(2px 4px 5px rgba(0,0,0,0.8)) blur(0px) brightness(1)", 
            "drop-shadow(2px 4px 10px rgba(0,0,0,0.8)) blur(1px) brightness(1.25)", // The Wamiidh glow surges softly
            "drop-shadow(2px 4px 5px rgba(0,0,0,0.8)) blur(0px) brightness(1)"
        ],
        transition: { 
            duration: 3.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
        }
      });
    };

    // Firing the precision engine implicitly
    sequence();
  }, [flashControls, textControls]);

  return (
    // 'pointer-events-none' removed from parent to permit hover interactions explicitly on the word
    <div className="relative font-bold mt-4 mb-4 select-none w-max h-[250px] mx-auto text-center flex items-center justify-center overflow-visible">
      
      {/* 1. Flawlessly centered golden dust array swooping inwards covering text length strictly */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.startX, y: p.startY, scale: 0, opacity: 0 }}
          animate={{ x: p.targetX, y: p.targetY, scale: [0, 1, 1.5, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn", times: [0, 0.1, 0.8, 1] }}
          className="absolute top-1/2 left-1/2 rounded-full bg-[#E8C96A] shadow-[0_0_12px_#E8C96A] z-20 pointer-events-none"
          style={{
            width: p.size, height: p.size,
            marginTop: -p.size/2, marginLeft: -p.size/2,
          }}
        />
      ))}

      {/* 2. Expanding flare seamlessly masking the transition precisely across the Arabic letters perfectly tracking 'w-max' */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={flashControls}
        className="absolute inset-0 m-auto w-[90%] h-[120px] bg-gradient-to-r from-transparent via-[#E8C96A] to-transparent rounded-full blur-[40px] mix-blend-screen z-10 pointer-events-none"
      />

      {/* 3. Hover Interactions Wrapping the Core Form */}
      <motion.div
        className="relative z-30 cursor-pointer"
        initial={{ 
          scale: 1, 
          // Baseline state perfectly defining rest properties for flawless seamless hover un-rendering
          filter: "drop-shadow(0px 0px 0px rgba(232, 201, 106, 0)) brightness(1)" 
        }}
        whileHover={{ 
          scale: 1.05, 
          // Enormous royal golden aura and brightness spike exclusive to the exact moment of physical interaction
          filter: "drop-shadow(0px 0px 30px rgba(232, 201, 106, 0.8)) brightness(1.3)" 
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={textControls}
          className="text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] font-serif tracking-wider w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-light via-gold to-burgundy bg-clip-text text-transparent"
          style={{
            filter: "drop-shadow(2px 4px 5px rgba(0,0,0,0.8))"
          }}
        >
          {settings.hero_title || 'انعطاف'}
        </motion.h2>
      </motion.div>

    </div>
  );
};

export default EngravingText;
