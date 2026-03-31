import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  // IMPORTANT: For Arabic, we must NOT split by letters because it's a cursive script.
  // Splitting by letters breaks the connection between them.
  // We split by words instead.
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 80,
      },
    },
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 80,
      },
    },
  };

  return (
    <motion.h1
      className={`font-serif flex flex-wrap gap-x-[0.3em] overflow-visible ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
    >
      {words.map((word, index) => (
        <motion.span 
            variants={child} 
            key={index} 
            className="inline-block relative whitespace-nowrap"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default AnimatedTitle;
