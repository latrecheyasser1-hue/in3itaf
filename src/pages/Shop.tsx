import React, { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, ShoppingBag, Eye, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Shop: React.FC = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [clothing, setClothing] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchClothing();
  }, []);

  const fetchClothing = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'clothing')
      .order('created_at', { ascending: false });
    
    if (data) setClothing(data);
    setLoading(false);
  };

  const filtered = clothing.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-32 pb-24 px-6 lg:px-12" dir="rtl">
        <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.02)_0%,transparent_50%)] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(201,168,76,0.02)_0%,transparent_50%)] pointer-events-none" />

        <div className="container mx-auto max-w-7xl">
          <div className="mb-20 space-y-6 text-center flex flex-col items-center">
            <div className="flex items-center space-x-4 space-x-reverse mb-4 opacity-50 justify-center">
                <div className="h-[1px] w-12 bg-gold"></div>
                <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-sans">Collection de Luxe</span>
                <div className="h-[1px] w-12 bg-gold"></div>
            </div>
            <AnimatedTitle text="أناقة وانعطاف" className="text-6xl md:text-8xl text-gold mb-6 justify-center" />
            <p className="text-xl text-ivory/60 font-serif max-w-2xl mx-auto leading-relaxed italic text-center">
              "حينما يلامس القماش حكايات الأصالة، تولد قطعة تليق بمقامك."
            </p>
          </div>

          <div className="flex justify-center mb-16 px-4">
            <div className="relative w-full max-w-3xl group">
              <div className="absolute inset-0 bg-gold/5 blur-xl group-focus-within:bg-gold/10 transition-all duration-500 rounded-full" />
              <div className="relative bg-black-card/50 backdrop-blur-md p-1 rounded-full border border-white/5 shadow-2xl flex items-center transition-all group-focus-within:border-gold/30">
                <Search size={22} className="mr-6 text-ivory/30 group-focus-within:text-gold transition-colors" />
                <input 
                  type="text" 
                  placeholder="ابحث عن قطعة أزياء حصرية..." 
                  className="w-full bg-transparent py-4 px-4 text-ivory focus:outline-none font-serif text-lg placeholder:text-ivory/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {[1,2,3,4].map(i => <div key={i} className="h-[550px] bg-black-card animate-pulse rounded-3xl border border-white/5" />)}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              <AnimatePresence>
                {filtered.map((item) => {
                  const isTotallySoldOut = Object.values(item.sizes_stock || {}).every(s => s === 0);
                  const mainImage = (item.images && item.images.length > 0) ? item.images[0] : 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000';
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      key={item.id}
                      className="group relative rounded-[2.5rem] overflow-hidden bg-black-card border border-white/5 hover:border-gold/20 transition-all duration-1000 shadow-2xl hover:shadow-gold/5 flex flex-col cursor-pointer"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <div className="relative h-[400px] overflow-hidden">
                        <img 
                            src={mainImage} 
                            alt={item.name} 
                            className="w-full h-full object-cover transform-gpu duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black-card via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute top-6 left-6 z-10">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); // Don't open modal
                                    toggleWishlist(item);
                                }}
                                className={`p-3.5 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 ${isInWishlist(item.id) ? 'bg-burgundy text-white border-burgundy' : 'bg-black-deep/40 text-ivory/40 hover:text-burgundy'}`}
                            >
                                <Heart size={20} className={isInWishlist(item.id) ? "fill-current" : ""} />
                            </button>
                        </div>

                        {isTotallySoldOut && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="px-8 py-3 border-2 border-burgundy text-burgundy font-bold tracking-[0.2em] uppercase -rotate-12 bg-black/40 backdrop-blur-md text-xs">
                                    En Rupture
                                </div>
                            </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3 translate-y-16 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                             <div className="flex gap-2 flex-wrap">
                                {Object.entries(item.sizes_stock || {}).map(([size, qty]) => (
                                    <span key={size} className={`px-2.5 py-1 text-[10px] rounded bg-ivory text-black-deep font-bold ${qty === 0 ? 'opacity-20 line-through' : 'shadow-lg shadow-black/50'}`}>
                                        {size}
                                    </span>
                                ))}
                             </div>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-grow relative bg-black-card">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Star size={10} className="text-gold fill-gold" />
                                <span className="text-[10px] text-ivory/30 uppercase tracking-[0.2em]">Exclusivité in3itaf</span>
                            </div>
                            <h3 className="text-2xl text-gold font-serif mb-3 leading-tight group-hover:tracking-wider transition-all duration-700">{item.name}</h3>
                            <p className="text-ivory/40 text-sm leading-relaxed line-clamp-1 italic font-serif">
                                {item.description}
                            </p>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-ivory/20 uppercase tracking-widest mb-1">Prix de la pièce</span>
                            <span className="text-xl text-ivory font-serif" dir="ltr">{item.price.toLocaleString()} DZD</span>
                          </div>
                          <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black-deep transition-all duration-700">
                            <Eye size={22} className="group-hover:scale-110 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-40 text-center space-y-12">
              <div className="relative inline-block">
                <ShoppingBag size={100} className="mx-auto text-gold/10" strokeWidth={0.5} />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full"
                />
              </div>
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-[1px] bg-gold/20 mb-6" />
                  <p className="text-ivory/60 font-serif text-3xl italic leading-relaxed max-w-3xl mx-auto px-6">
                    "مجموعة الأزياء الجديدة قيد التجهيز... كونوا على الموعد لأناقة تعكس جوهر انعطاف."
                  </p>
                  <div className="h-[1px] w-16 bg-gold/20 mt-6" />
                </div>
                <p className="text-gold/40 tracking-[0.6em] uppercase text-[10px] font-sans mt-8 animate-pulse">Coming Soon</p>
              </div>
            </div>
          )}
        </div>

        <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </PageTransition>
  );
};

export default Shop;
