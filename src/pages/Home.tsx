import React, { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import EngravingText from '../components/ui/EngravingText';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, BookOpen, Shirt, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import LuxuryIcon from '../components/ui/GoldenOrbitIcon';

import { useSettings } from '../context/SettingsContext';

const Home: React.FC = () => {
  const { settings } = useSettings();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Hover states for the three main categories
  const [hoverGallery, setHoverGallery] = useState(false);
  const [hoverBook, setHoverBook] = useState(false);
  const [hoverShop, setHoverShop] = useState(false);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    const { data } = await supabase.from('products').select('*').eq('featured', true).limit(4);
    if (data) setFeatured(data);
  };

  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-20" dir="rtl">
        
        {/* Full screen HERO */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-pattern opacity-[0.03] z-0" />
          
          <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
            <EngravingText />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-2xl md:text-3xl text-ivory/80 font-serif mt-2"
            >
              {settings.hero_subtitle || 'فن · كلمة · أناقة'}
            </motion.p>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 2, duration: 1 }}
               className="mt-20 flex flex-col items-center hidden md:flex"
            >
              <span className="text-gold/50 text-[10px] tracking-widest uppercase mb-4 animate-bounce font-sans">اكتشف العوالم</span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 px-6 lg:px-12 relative z-10 overflow-hidden">

          <div className="container mx-auto">
            <div className="mb-20 text-center lg:text-right">
                <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-gold tracking-[0.4em] uppercase text-[10px] font-sans mb-4 block">Découvrir l'Essentiel</motion.span>
                <motion.h2 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-6xl md:text-7xl font-serif text-ivory text-center lg:text-right"
                >
                    عوالم <span className="text-gold">{settings.site_title || 'انعطاف'}</span>
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Category 1 */}
              <Link 
                to="/gallery" 
                className="group relative h-[600px] overflow-visible rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-1000 shadow-2xl"
                onMouseEnter={() => setHoverGallery(true)}
                onMouseLeave={() => setHoverGallery(false)}
              >
                <div className="w-full h-full flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-[2s] ease-out bg-black-card/30 rounded-3xl overflow-visible">
                  <LuxuryIcon isLarge={true} active={hoverGallery} glowColor="rgba(232, 201, 106, 0.4)">
                    <Palette size={180} className="text-gold/20 group-hover:text-gold/40 transition-colors duration-1000" strokeWidth={0.5} />
                  </LuxuryIcon>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/40 to-transparent rounded-3xl pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-10 flex flex-col items-start text-right z-30">
                  <h3 className="text-5xl text-gold font-serif mb-6 transform group-hover:-translate-y-4 transition-transform duration-1000">
                    {settings.card_artwork_title || 'الرسومات'}
                  </h3>
                  <p className="text-ivory/60 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-1000 delay-100 leading-relaxed italic">
                    "{settings.card_artwork_desc || 'حينما ينبعث الإبداع من سكون اللون، ليحاكي خبايا الروح في لوحات أصلية.'}"
                  </p>
                  <div className="mt-8 flex items-center space-x-3 space-x-reverse text-gold opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 border-b border-gold/20 pb-2">
                    <span className="text-lg font-serif">دخول المعرض</span>
                    <ArrowLeft size={20} />
                  </div>
                </div>
              </Link>

              {/* Category 2 */}
              <Link 
                to="/book" 
                className="group relative h-[600px] overflow-visible rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-1000 shadow-2xl"
                onMouseEnter={() => setHoverBook(true)}
                onMouseLeave={() => setHoverBook(false)}
              >
                <div className="w-full h-full flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-[2s] ease-out bg-black-card/30 rounded-3xl overflow-visible">
                  <LuxuryIcon isLarge={true} active={hoverBook} glowColor="rgba(232, 201, 106, 0.4)">
                    <BookOpen size={180} className="text-gold/20 group-hover:text-gold/40 transition-colors duration-1000" strokeWidth={0.5} />
                  </LuxuryIcon>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/40 to-transparent rounded-3xl pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-10 flex flex-col items-start text-right z-30">
                  <h3 className="text-5xl text-gold font-serif mb-6 transform group-hover:-translate-y-4 transition-transform duration-1000">
                    {settings.card_book_title || 'الكتاب'}
                  </h3>
                  <p className="text-ivory/60 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-1000 delay-100 leading-relaxed italic">
                    "{settings.card_book_desc || 'رحلة أدبية استثنائية بين المكتوب والمرسوم، صفحات تخبئ بين طياتها أسرار الفن.'}"
                  </p>
                  <div className="mt-8 flex items-center space-x-3 space-x-reverse text-gold opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 border-b border-gold/20 pb-2">
                    <span className="text-lg font-serif">تصفح الكتاب</span>
                    <ArrowLeft size={20} />
                  </div>
                </div>
              </Link>

              {/* Category 3 */}
              <Link 
                to="/shop" 
                className="group relative h-[600px] overflow-visible rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-1000 shadow-2xl"
                onMouseEnter={() => setHoverShop(true)}
                onMouseLeave={() => setHoverShop(false)}
              >
                <div className="w-full h-full flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-[2s] ease-out bg-black-card/30 rounded-3xl overflow-visible">
                  <LuxuryIcon isLarge={true} active={hoverShop} glowColor="rgba(232, 201, 106, 0.4)">
                    <Shirt size={180} className="text-gold/20 group-hover:text-gold/40 transition-colors duration-1000" strokeWidth={0.5} />
                  </LuxuryIcon>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/40 to-transparent rounded-3xl pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-10 flex flex-col items-start text-right z-30">
                  <h3 className="text-5xl text-gold font-serif mb-6 transform group-hover:-translate-y-4 transition-transform duration-1000">
                    {settings.card_clothing_title || 'الأناقة'}
                  </h3>
                  <p className="text-ivory/60 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-1000 delay-100 leading-relaxed italic">
                    "{settings.card_clothing_desc || 'حينما يصبح القماش لوحة، والموضة تعبيراً عن الهوية المتجذرة في الأصالة.'}"
                  </p>
                  <div className="mt-8 flex items-center space-x-3 space-x-reverse text-gold opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 border-b border-gold/20 pb-2">
                    <span className="text-lg font-serif">اكتشف المجموعة</span>
                    <ArrowLeft size={20} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        {featured.length > 0 && (
            <section className="py-32 px-6 lg:px-12 bg-black-card/10 backdrop-blur-sm border-y border-white/5 relative overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
                        <div className="text-right">
                             <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-sans mb-4 block">Sélection Exclusive</span>
                             <h2 className="text-6xl font-serif text-ivory">قطع <span className="text-gold">مختارة</span> بعناية</h2>
                        </div>
                        <Link to="/shop" className="text-gold hover:text-ivory transition-colors font-serif pb-2 border-b border-gold/30">مشاهدة الكل</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featured.map((item) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedProduct(item)}
                            >
                                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 mb-6">
                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black-deep/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4 p-2 bg-black-card/50 backdrop-blur-md rounded-full text-gold opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                                        <Star size={14} fill="currentColor" />
                                    </div>
                                    <div className="absolute bottom-6 flex justify-center w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                        <div className="bg-gold text-black-deep px-6 py-2 rounded-full font-bold text-xs flex items-center gap-2">
                                            عرض التفاصيل <ShoppingBag size={12} />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl text-gold font-serif mb-2">{item.name}</h3>
                                <div className="text-ivory/50 font-serif" dir="ltr">{item.price.toLocaleString()} DZD</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* Footer Ambient */}
        <div className="py-20 text-center pointer-events-none overflow-visible">
            <AnimatedTitle 
                text="جمالٌ في كل انعطاف" 
                className="text-6xl md:text-8xl justify-center text-gold-light drop-shadow-[0_0_50px_rgba(232,201,106,0.3)] leading-relaxed py-10 overflow-visible font-serif" 
            />
        </div>

        {/* Product Modal */}
        <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </PageTransition>
  );
};

export default Home;
