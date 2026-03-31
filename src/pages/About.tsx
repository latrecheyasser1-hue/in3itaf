import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const About: React.FC = () => {
  const { settings } = useSettings();
  
  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-32 pb-24 overflow-hidden" dir="rtl">
        {/* Background Patterns */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-burgundy/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Artist Photo */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="absolute -inset-4 border border-gold/30 rounded-2xl transform rotate-3 group-hover:rotate-1 transition-transform duration-700 pointer-events-none" />
            <div className="absolute -inset-4 border border-burgundy/30 rounded-2xl transform -rotate-3 group-hover:-rotate-1 transition-transform duration-700 pointer-events-none" />
            <div className="relative overflow-hidden rounded-2xl h-[500px] lg:h-[700px]">
              <img 
                src={settings.artist_image || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800"} 
                alt={settings.artist_name || "الفنانة"} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-deep to-transparent opacity-80" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <AnimatedTitle text={settings.about_title || "عن انعطاف"} className="text-5xl md:text-7xl text-gold mb-8 lg:mb-12" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-6 text-ivory/80 font-serif text-lg leading-relaxed lg:leading-[2.5]"
            >
              <div className="whitespace-pre-line space-y-6">
                <p>
                  {settings.about_p1 || "وُلدت «انعطاف» من شغف عميق بالفن الجزائري العريق وجماليات الخط العربي المدموج بروح المعاصرة. هي ليست مجرد علامة تجارية، بل فلسفة تنظر إلى الجمال في الزوايا التي يغفل عنها الكثيرون."}
                </p>
                <p>
                  {settings.about_p2 || "كل لوحة تُرسم هنا، كل قطعة أزياء تُحاك، وكل حرف يُخط داخل كتابنا، هو محاولة لإعادة تعريف الفخامة بروح محلية عالمية."}
                </p>
              </div>
              
              <div className="pt-8 border-t border-white/10 mt-8">
                <span className="text-gold text-2xl font-serif italic block mb-4">
                  "{settings.artist_quote || 'الإبداع هو الانعطاف نحو النور في أشد اللحظات عتمة.'}"
                </span>
                <span className="text-ivory/50">
                  {settings.artist_name || 'الفنانة المؤسسة'}
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default About;
