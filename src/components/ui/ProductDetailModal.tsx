import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Info, CheckCircle, Package, Quote, BookOpen } from 'lucide-react';
import { Product } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentImageIndex(0);
    setCurrentQuoteIndex(0);
    setIsZoomed(false);
  }, [product]);

  if (!product) return null;

  // Safe checks for arrays
  const images = product.images || [];
  const quotes = product.quotes || [];
  const hasImages = images.length > 0;
  const hasQuotes = quotes.length > 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextQuote = () => {
      if (hasQuotes) setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const isArt = product.category === 'artwork';
  const isBook = product.category === 'book';

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-8 xl:p-12 overflow-hidden"
          dir="rtl"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className={`bg-black-card w-full lg:h-[95vh] lg:max-w-7xl rounded-none lg:rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col ${isArt ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button UI */}
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 z-[110] p-4 bg-white/5 hover:bg-gold hover:text-black-deep text-ivory rounded-full transition-all duration-500 border border-white/10"
            >
              <X size={24} />
            </button>

            {/* Visual Experience Section */}
            <div className={`w-full ${isBook ? 'lg:w-[45%]' : 'lg:w-[60%]'} h-[50vh] lg:h-full relative overflow-hidden flex items-center justify-center bg-black-deep/40 group`}>
              {hasImages ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: isArt ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isArt ? 50 : -50 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="w-full h-full p-6 lg:p-16"
                    >
                      <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className={`w-full h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-transform duration-1000 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                        onClick={() => setIsZoomed(!isZoomed)}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Slider Controls */}
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={prevImage} className="p-4 bg-black/50 text-gold rounded-full border border-gold/10 hover:bg-gold hover:text-black transition-all backdrop-blur-md">
                          <ChevronRight size={24} />
                        </button>
                        <button onClick={nextImage} className="p-4 bg-black/50 text-gold rounded-full border border-gold/10 hover:bg-gold hover:text-black transition-all backdrop-blur-md">
                          <ChevronLeft size={24} />
                        </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-ivory/20">
                    <Info size={48} className="mb-4" />
                    <span>لا توجد صور متوفرة</span>
                </div>
              )}

              {/* Status & Category Badge */}
              <div className="absolute top-10 right-10 flex flex-col gap-3 items-end">
                <div className={`px-5 py-2 rounded-full text-[10px] tracking-widest font-sans border backdrop-blur-xl shadow-2xl flex items-center space-x-2 space-x-reverse ${product.status === 'sold' ? 'bg-burgundy/20 text-burgundy border-burgundy/30' : 'bg-gold/10 text-gold border-gold/30'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.status === 'sold' ? 'bg-burgundy' : 'bg-gold'}`} />
                    <span>{product.status === 'sold' ? 'SOLD OUT' : 'AVAILABLE NOW'}</span>
                </div>
                {isBook && <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[10px] tracking-widest text-ivory/40">LITERARY COLLECTION</div>}
              </div>
            </div>

            {/* Information Section */}
            <div className={`w-full ${isBook ? 'lg:w-[55%]' : 'lg:w-[40%]'} p-8 lg:p-16 flex flex-col h-full bg-black-card overflow-y-auto relative ${isArt ? 'lg:border-r' : 'lg:border-l'} border-white/5`}>
                <div className="relative z-10 flex flex-col min-h-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-gold/30 text-[10px] tracking-[0.6em] uppercase mb-4 block font-sans">
                            IN3ITAF CREATION
                        </span>
                        
                        <h2 className="text-4xl lg:text-6xl font-serif text-ivory mb-6 leading-tight whitespace-pre-wrap">
                            {product.name}
                        </h2>
                        
                        <div className="flex items-center gap-6 mb-12">
                            <div className="text-4xl text-gold font-serif">
                                {product.price.toLocaleString()} <span className="text-sm font-sans opacity-50">DZD</span>
                            </div>
                            {isBook && <div className="h-8 w-[1px] bg-white/10" />}
                            {isBook && (
                                <div className="flex items-center gap-2 text-ivory/40 text-xs">
                                    <BookOpen size={16} />
                                    <span>إصدار محدود</span>
                                </div>
                            )}
                        </div>

                        {/* Content Blocks */}
                        <div className="space-y-12">
                            {/* Detailed Introduction for Books */}
                            {isBook && product.introduction && (
                                <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-inner relative overflow-hidden">
                                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 blur-3xl rounded-full" />
                                     <h4 className="text-gold/60 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Info size={14}/> مقدمة الكتاب
                                     </h4>
                                     <p className="text-ivory/80 font-serif leading-loose text-lg text-justify">
                                        {product.introduction}
                                     </p>
                                </div>
                            )}

                            {/* Custom Quotes Carousel for Books */}
                            {isBook && hasQuotes && (
                                <div className="pt-6">
                                     <h4 className="text-gold/40 text-[10px] uppercase tracking-widest mb-8 text-center">إقتباسات من الكتاب</h4>
                                     <div className="relative cursor-pointer" onClick={nextQuote}>
                                         <AnimatePresence mode="wait">
                                             <motion.div
                                                key={currentQuoteIndex}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.05 }}
                                                transition={{ duration: 0.5 }}
                                                className="flex flex-col items-center text-center px-10"
                                             >
                                                 <Quote size={40} className="text-gold opacity-10 mb-6" />
                                                 <p className="text-xl lg:text-2xl font-serif text-ivory/90 leading-relaxed italic">
                                                     "{quotes[currentQuoteIndex]}"
                                                 </p>
                                                 <div className="mt-8 flex gap-1 justify-center">
                                                     {quotes.map((_, i) => (
                                                         <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentQuoteIndex ? 'w-4 bg-gold' : 'w-1 bg-white/10'}`} />
                                                     ))}
                                                 </div>
                                             </motion.div>
                                         </AnimatePresence>
                                     </div>
                                </div>
                            )}

                            {/* Default Description */}
                            {(!isBook || !product.introduction) && (
                                <div>
                                    <h4 className="text-gold/60 text-[10px] uppercase tracking-widest mb-6 border-b border-white/5 pb-2">التفاصيل</h4>
                                    <p className="text-ivory/60 font-serif leading-relaxed text-lg">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Interaction Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.4 }}
                        className="mt-auto pt-16"
                    >
                        <button 
                            disabled={product.status === 'sold' || (isBook && (product.stock || 0) <= 0)}
                            onClick={() => navigate(`/order/${product.id}`)}
                            className={`w-full py-6 rounded-[1.5rem] font-serif text-2xl transition-all duration-500 relative flex items-center justify-center gap-4 ${product.status === 'sold' ? 'bg-white/5 text-ivory/10' : 'bg-gold text-black-deep hover:bg-gold-light hover:shadow-[0_0_40px_rgba(201,168,76,0.2)]'}`}
                        >
                            <span>{product.status === 'sold' ? 'Sold Out' : 'اطلبه الآن'}</span>
                            <ShoppingCart size={24} />
                        </button>
                        
                        <div className="mt-6 flex justify-center gap-4 opacity-30 text-[9px] uppercase tracking-[0.3em]">
                            <IconLabel icon={Package} text="شحن موثوق" />
                            <IconLabel icon={CheckCircle} text="ضمان الجودة" />
                        </div>
                    </motion.div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const IconLabel = ({ icon: Icon, text }: any) => (
    <div className="flex items-center gap-2"><Icon size={12}/>{text}</div>
);

export default ProductDetailModal;
