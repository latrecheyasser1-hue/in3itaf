import React, { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import ProductDetailModal from '../components/ui/ProductDetailModal';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Expand, Image as ImageIcon, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const Gallery: React.FC = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [artworks, setArtworks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setLoading(true);
    // Auto-cleanup expired orders before fetching
    await cleanupExpiredOrders();
    
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'artwork')
      .eq('status', 'available') // Only show non-sold/non-reserved ones
      .order('created_at', { ascending: false });
    
    if (data) setArtworks(data);
    setLoading(false);
  };

  const cleanupExpiredOrders = async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Find pending orders for artworks older than 24h
      const { data: expiredOrders } = await supabase
        .from('orders')
        .select('*, product_id')
        .eq('product_category', 'artwork')
        .eq('status', 'pending')
        .lt('created_at', twentyFourHoursAgo);

      if (expiredOrders && expiredOrders.length > 0) {
        for (const order of expiredOrders) {
          // Update order to cancelled
          await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
          // Restore product to available
          await supabase.from('products').update({ status: 'available' }).eq('id', order.product_id);
        }
      }
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  };

  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-32 pb-24 px-6 lg:px-12" dir="rtl">
        {/* Ambient Glows */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <AnimatedTitle text="معرض الرسومات" className="text-6xl md:text-8xl text-gold mb-6 justify-center" />
            <p className="text-xl text-ivory/70 font-serif max-w-2xl mx-auto leading-relaxed">
              تأمل اللوحات الفنية التي تجسد عمق المشاعر والأفكار عبر خطوط وألوان تنبض بالحياة، كل لوحة تحكي قصة "انعطاف" فريدة.
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-black-card animate-pulse rounded-2xl border border-white/5" />)}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {artworks.map((artwork) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={artwork.id}
                    className="group relative rounded-2xl overflow-hidden bg-black-card border border-white/5 hover:border-gold/30 transition-all duration-700 ease-out cursor-pointer shadow-xl hover:shadow-gold/5"
                    onClick={() => setSelectedProduct(artwork)}
                  >
                    {/* Image Container */}
                    <div className="relative h-[450px] overflow-hidden">
                      <img 
                        src={(artwork.images && artwork.images.length > 0) ? artwork.images[0] : 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000'} 
                        alt={artwork.name} 
                        className="w-full h-full object-cover transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black-deep/90 via-transparent to-transparent opacity-80" />
                      
                      {/* Top Overlay Icons */}
                      <div className="absolute top-5 right-5 flex flex-col gap-3 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(artwork);
                          }}
                          className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition-all transform scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 ${isInWishlist(artwork.id) ? 'bg-burgundy text-white border-burgundy' : 'bg-black-deep/40 text-gold/80 hover:text-gold hover:bg-black-deep'}`}
                        >
                          <Heart size={18} className={isInWishlist(artwork.id) ? "fill-current" : ""} />
                        </button>
                        <div className="p-3 rounded-full bg-black-deep/40 backdrop-blur-md border border-white/10 text-gold/80 hover:text-gold hover:bg-black-deep transition-all opacity-0 group-hover:opacity-100 transform translate-x-10 group-hover:translate-x-0 transition-transform duration-500">
                          <Expand size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl text-gold font-serif transform transition-transform group-hover:-translate-y-1 duration-500">{artwork.name}</h3>
                        <span className="text-xl text-ivory font-serif" dir="ltr">{artwork.price.toLocaleString()} دج</span>
                      </div>
                      <p className="text-ivory/40 text-sm mb-8 line-clamp-2 leading-relaxed italic">{artwork.description}</p>
                      
                      <div className="flex justify-center mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center text-gold/60 group-hover:text-gold transition-colors space-x-3 space-x-reverse">
                            <ShoppingCart size={18} />
                            <span className="font-serif">اطلب هذه اللوحة الآن</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && artworks.length === 0 && (
            <div className="py-32 text-center space-y-8">
              <div className="relative inline-block">
                <ImageIcon className="mx-auto text-gold/10 mb-6" size={80} strokeWidth={0.5} />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/5 blur-3xl rounded-full"
                />
              </div>
              <div className="space-y-4">
                <p className="text-gold tracking-[0.3em] uppercase text-[10px] font-sans">Coming Soon</p>
                <p className="text-ivory/60 font-serif text-2xl lg:text-3xl italic leading-relaxed max-w-2xl mx-auto">
                  "نعمل حالياً على رسم ملامح إبداعية جديدة... انتظروا انبعاث الفن في مجموعتنا القادمة."
                </p>
              </div>
            </div>
          )}
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

export default Gallery;
