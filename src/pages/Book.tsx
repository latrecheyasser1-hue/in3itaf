import React, { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';

const FALLBACK_QUOTES = [
  "الصمت لغة، والفن صوتها المسموع في ثنايا الروح.",
  "كل زاوية في هذه اللوحات تحكي قصة لم تكتب، بل رُسِمت.",
  "جمال الأشياء يكمن في انعطافاتها الخفية، حيث تلتقي الأضداد."
];

const Book: React.FC = () => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [book, setBook] = useState<Product | null>(null);

  useEffect(() => {
    fetchBook();
    const interval = setInterval(() => setQuoteIdx(q => (q + 1)), 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchBook = async () => {
    const { data } = await supabase.from('products').select('*').eq('category', 'book').single();
    if (data) setBook(data);
  };

  const activeQuotes = (book && book.quotes && book.quotes.length > 0) ? book.quotes : FALLBACK_QUOTES;
  const currentQuoteIdx = quoteIdx % activeQuotes.length;

  const nextQuote = () => setQuoteIdx((prev) => (prev + 1));
  const prevQuote = () => setQuoteIdx((prev) => (prev - 1 + activeQuotes.length));

  const isSoldOut = !book || book?.status === 'sold' || (book?.stock !== null && (book?.stock || 0) <= 0);
  const bookImage = (book?.images && book.images.length > 0) ? book.images[0] : null;

  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-32 pb-24 overflow-hidden" dir="rtl" key="book-page">
        {/* Background Decorative */}
        <div className="absolute inset-0 bg-transparent" />
        
        {/* Ambient Glows */}
        <div className="fixed top-20 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-20 left-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Content side */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-right">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold tracking-[0.4em] uppercase text-[10px] font-sans mb-4">إصدار خاص</motion.span>
            <AnimatedTitle text={book?.name || "قريباً: رحلة في عوالم انعطاف"} className="text-5xl md:text-8xl text-gold mb-10 leading-tight" />
            
            <motion.p 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-ivory/60 text-lg lg:text-xl font-serif leading-loose mb-12 max-w-xl italic"
            >
              " {book?.description || 'نعمل حالياً على تجهيز كتاب فني يجمع بين طياته رحلة بصرية وأدبية فريدة. ترقبوا الإعلان عن هذا العمل قريباً.'} "
            </motion.p>
            
            {/* Quotes Carousel */}
            <div className="relative w-full max-w-lg min-h-[180px] mb-12 bg-black-card/40 backdrop-blur-md p-10 border border-white/5 rounded-3xl flex items-center justify-center group shadow-2xl overflow-hidden">
              <button onClick={prevQuote} className="absolute right-4 text-gold/30 hover:text-gold transition-all duration-500 hover:scale-110 z-20">
                <ChevronRight size={24} />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIdx}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                  className="font-serif text-xl lg:text-2xl text-ivory/90 text-center italic tracking-wide px-12 leading-relaxed"
                >
                  "{activeQuotes[currentQuoteIdx]}"
                </motion.div>
              </AnimatePresence>

              <button onClick={nextQuote} className="absolute left-4 text-gold/30 hover:text-gold transition-all duration-500 hover:scale-110 z-20">
                <ChevronLeft size={24} />
              </button>
              
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/10 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/10 rounded-bl-3xl" />
            </div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[10px] tracking-[0.3em] text-ivory/30 font-sans mb-1 uppercase">PRIX DU LIVRE</span>
                <span className="text-3xl text-gold font-serif" dir="ltr">{book?.price?.toLocaleString() || '--'} DZD</span>
              </div>
              
              <Link 
                to={isSoldOut ? '#' : `/order/${book?.id}`}
                className={`px-12 py-5 rounded-2xl font-bold font-serif text-2xl transition-all duration-700 relative overflow-hidden flex items-center gap-4 ${isSoldOut ? 'bg-white/5 text-ivory/20 cursor-not-allowed' : 'bg-gold text-black-deep hover:shadow-[0_0_50px_rgba(201,168,76,0.3)] hover:scale-[1.05]'}`}
              >
                <span>{isSoldOut ? 'ترقبوا قريباً' : 'اطلب نسختك الآن'}</span>
                {!isSoldOut && <ShoppingCart size={22} />}
              </Link>
            </motion.div>
          </div>

          {/* Book 3D Model side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 40 }}
            className="w-full lg:w-1/2 flex justify-center perspective-[2000px]"
          >
            <div className="relative w-72 h-[450px] md:w-[450px] md:h-[650px] preserve-3d group cursor-pointer transition-transform duration-1000 ease-in-out hover:rotate-y-[15deg]">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/40 blur-2xl rounded-full" />
              
              {/* Cover */}
              <div className="absolute inset-0 bg-black-card shadow-[inset_0_0_100px_rgba(0,0,0,0.1),_40px_40px_80px_rgba(0,0,0,0.8)] border border-white/5 rounded-r-3xl rounded-l-md overflow-hidden z-20">
                {bookImage ? (
                  <img 
                    src={bookImage}
                    alt="Book Cover" 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-black-deep flex items-center justify-center p-12 text-center">
                    <div className="border border-gold/20 p-8 rounded-2xl">
                      <h3 className="text-gold font-serif text-3xl mb-4">انعطاف</h3>
                      <p className="text-gold/40 text-xs tracking-[0.3em] uppercase">Soon</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-transparent to-transparent opacity-90 p-12 flex flex-col justify-end">
                    <div className="w-12 h-[1px] bg-gold/50 mb-6 group-hover:w-24 transition-all duration-1000"></div>
                    <h3 className="text-3xl text-gold font-serif leading-tight mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">{book?.name || "تحت التجهيز"}</h3>
                    <p className="text-ivory/30 text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100">Collection in3itaf</p>
                </div>
              </div>
              
              {/* Pages side (Thickness) */}
              <div className="absolute top-4 bottom-4 -left-10 w-10 bg-[#d4d1cc] rounded-l-lg transform -translate-z-10 -rotate-y-90 origin-right flex items-center justify-center">
                 <div className="w-full h-full opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_3px)]" />
              </div>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 w-28 h-28 bg-gold/5 rounded-full border border-gold/20 backdrop-blur-md z-30 flex items-center justify-center text-center p-4 border-dashed"
              >
                <p className="text-gold/60 text-[7px] uppercase font-serif leading-relaxed">
                    إصدار حصري محدود<br/><span className="tracking-widest">Edition Limitée</span>
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Introduction Section (Appears if provided) */}
        <AnimatePresence>
          {book?.introduction && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="container mx-auto px-6 lg:px-12 mt-32 relative"
            >
              <div className="max-w-4xl mx-auto bg-black-card/30 backdrop-blur-sm border border-gold/10 p-12 lg:p-20 rounded-[3rem] shadow-3xl text-right">
                <div className="flex items-center justify-center mb-12">
                   <div className="h-[1px] w-20 bg-gold/20 mr-4" />
                   <h4 className="text-gold tracking-[0.5em] uppercase text-xs">مقدمة الكتاب</h4>
                   <div className="h-[1px] w-20 bg-gold/20 ml-4" />
                </div>
                <div className="prose prose-invert max-w-none">
                   <p className="text-ivory/80 text-xl lg:text-2xl leading-[2.2] font-serif whitespace-pre-wrap italic">
                     {book.introduction}
                   </p>
                </div>
                <div className="mt-12 flex justify-center">
                   <div className="w-16 h-16 border border-gold/10 rounded-full flex items-center justify-center opacity-30">
                      <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Book;
