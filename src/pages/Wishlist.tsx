import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useWishlist } from '../context/WishlistContext';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <PageTransition>
      <div className="w-full relative bg-black-deep min-h-screen pt-32 pb-24 px-6 lg:px-12" dir="rtl">
        <div className="container mx-auto">
          <AnimatedTitle text="المفضلة" className="text-5xl md:text-7xl text-gold mb-12 text-center" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-black-card border border-white/5 rounded-xl overflow-hidden flex flex-col group hover:border-gold/30 transition-colors">
                <div className="h-48 relative overflow-hidden">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black-card to-transparent h-20"></div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-2xl font-serif text-gold">{item.name}</h3>
                       <span className="text-xs text-ivory/50 uppercase tracking-widest font-sans inline-block mt-1">
                         {item.category}
                       </span>
                     </div>
                     <button 
                       onClick={() => removeFromWishlist(item.id)}
                       className="text-ivory/40 hover:text-burgundy transition-colors p-2"
                     >
                       <Trash2 size={20} />
                     </button>
                   </div>
                   
                   <p className="text-xl text-ivory mb-6 mt-auto flex-grow" dir="ltr">{item.price.toLocaleString()} DZD</p>
                   
                   <Link 
                     to={`/order/${item.id}`}
                     className="w-full block text-center py-3 bg-white/5 border border-white/10 hover:border-gold text-gold font-serif transition-colors rounded"
                   >
                     اطلب الآن
                   </Link>
                </div>
              </div>
            ))}
          </div>
          
          {wishlist.length === 0 && (
             <div className="text-center py-32">
               <p className="text-ivory/50 font-serif text-2xl">المفضلة فارغة حالياً.</p>
               <Link to="/gallery" className="text-gold border-b border-gold pb-1 mt-6 inline-block font-serif">العودة للمعرض</Link>
             </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Wishlist;
