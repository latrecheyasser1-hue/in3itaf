import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { supabase } from '../lib/supabase';
import { wilayas } from '../lib/mockData';
import { Product as ProductType } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShoppingCart, AlertCircle, MapPin, Truck } from 'lucide-react';

const Order: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    wilaya: '',
    delivery_type: 'bureau' as 'bureau' | 'domicile',
    notes: ''
  });
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const quantity = 1;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    const { data } = await supabase.from('products').select('*').eq('id', productId).single();
    if (data) setProduct(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    if (product.category === 'clothing' && !selectedSize) {
      alert('يرجى اختيار المقاس');
      return;
    }

    setSubmitting(true);

    const orderData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      wilaya: formData.wilaya,
      delivery_type: formData.delivery_type,
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      size: selectedSize || null,
      quantity: quantity,
      total_price: product.price * quantity,
      status: 'pending'
    };

    const { error } = await supabase.from('orders').insert(orderData);

    if (error) {
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
    } else {
        // Deduct stock immediately to prevent overselling
        if (product.category === 'book') {
            await supabase.from('products').update({ stock: Math.max(0, (product.stock || 0) - quantity) }).eq('id', product.id);
        } else if (product.category === 'clothing' && selectedSize) {
            const newStock = { ...product.sizes_stock };
            newStock[selectedSize] = Math.max(0, (newStock[selectedSize] || 0) - quantity);
            await supabase.from('products').update({ sizes_stock: newStock }).eq('id', product.id);
        } else if (product.category === 'artwork') {
             await supabase.from('products').update({ status: 'sold' }).eq('id', product.id);
        }

      setSuccess(true);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-transparent flex items-center justify-center text-gold">جاري التحميل...</div>;

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-ivory font-serif" dir="rtl">
        <h1 className="text-4xl text-gold mb-4">المنتج غير موجود</h1>
        <button onClick={() => navigate(-1)} className="flex items-center text-ivory/70 hover:text-gold transition-colors">
          <ArrowLeft className="ml-2" size={18} />
          العودة
        </button>
      </div>
    );
  }

  const isSoldOut = product.status === 'sold' || 
    (product.category === 'book' && (product.stock || 0) <= 0) ||
    (product.category === 'clothing' && Object.values(product.sizes_stock || {}).every(s => s === 0));

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-center px-4" dir="rtl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}>
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 mx-auto border border-gold/30">
                <CheckCircle2 size={50} className="text-gold" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl text-gold font-serif mb-6">شكراً ثقتك، تم استلام طلبك!</h1>
          <p className="text-xl text-ivory/60 font-serif max-w-lg mb-12">
            رقم طلبك سيتم استخدامه للتواصل معك هاتفياً في غضون 24 ساعة لتأكيد معلومات الشحن.
          </p>
          
          <button onClick={() => navigate('/')} className="px-10 py-4 bg-gold text-black-deep rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]">
            العودة للرئيسية
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-32 pb-24 px-6 lg:px-12" dir="rtl">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-16 relative">
          
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="w-full lg:w-3/5 relative z-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-ivory/40 hover:text-gold transition-colors mb-8 group">
               <ArrowLeft size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
               رجوع للمتجر
            </button>
            <h1 className="text-4xl lg:text-5xl text-gold font-serif mb-10 flex items-center">
                إتمام الطلبية
                <span className="w-12 h-[1px] bg-gold/30 mr-8 hidden md:block"></span>
            </h1>
            
            <form onSubmit={handleSubmit} className="bg-black-card p-8 lg:p-10 rounded-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-ivory/50 text-xs uppercase block">الاسم</label>
                  <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full bg-black-deep border border-white/10 rounded-xl px-5 py-4 text-ivory focus:border-gold outline-none transition-all placeholder:text-ivory/20" placeholder="مثال: محمد" />
                </div>
                <div className="space-y-3">
                  <label className="text-ivory/50 text-xs uppercase block">اللقب</label>
                  <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full bg-black-deep border border-white/10 rounded-xl px-5 py-4 text-ivory focus:border-gold outline-none transition-all placeholder:text-ivory/20" placeholder="مثال: الجزائري" />
                </div>
              </div>

              <div className="space-y-3 text-right">
                <label className="text-ivory/50 text-xs uppercase block">رقم الهاتف <span className="text-gold">*</span></label>
                <div className="relative">
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} dir="ltr" className="w-full bg-black-deep border border-white/10 rounded-xl px-5 py-4 text-ivory focus:border-gold outline-none transition-all text-right placeholder:text-ivory/20" placeholder="05 / 06 / 07 ..." />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-ivory/50 text-xs uppercase block">الولاية (التوصيل لـ 58 ولاية)</label>
                <div className="relative">
                    <select required value={formData.wilaya} onChange={e => setFormData({...formData, wilaya: e.target.value})} className="w-full bg-black-deep border border-white/10 rounded-xl px-5 py-4 text-ivory focus:border-gold outline-none transition-all appearance-none font-serif cursor-pointer">
                        <option value="">اختر الولاية...</option>
                        {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-ivory/50 text-xs uppercase block mb-4">طريقة التوصيل</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, delivery_type: 'bureau'})} className={`flex items-center justify-between p-5 border rounded-xl transition-all ${formData.delivery_type === 'bureau' ? 'border-gold bg-gold/5 text-gold' : 'border-white/10 bg-black-deep text-ivory/40 hover:border-white/30'}`}>
                    <div className="text-right">
                        <div className="text-sm font-bold">توصيل للمكتب</div>
                        <div className="text-[10px] mt-1 opacity-70 italic font-serif">يتم الاستلام من أقرب مكتب شحن</div>
                    </div>
                    <Truck size={20} />
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, delivery_type: 'domicile'})} className={`flex items-center justify-between p-5 border rounded-xl transition-all ${formData.delivery_type === 'domicile' ? 'border-gold bg-gold/5 text-gold' : 'border-white/10 bg-black-deep text-ivory/40 hover:border-white/30'}`}>
                    <div className="text-right">
                        <div className="text-sm font-bold">توصيل للمنزل</div>
                        <div className="text-[10px] mt-1 opacity-70 italic font-serif">يصلك المنتج حتى باب بيتك</div>
                    </div>
                    <MapPin size={20} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button 
                   disabled={submitting || isSoldOut}
                   type="submit" 
                   className={`w-full py-5 rounded-xl font-bold font-serif text-2xl transition-all relative overflow-hidden flex items-center justify-center space-x-4 space-x-reverse ${isSoldOut ? 'bg-white/5 text-ivory/20 cursor-not-allowed' : 'bg-gradient-to-r from-gold to-gold-light text-black-deep hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:scale-[1.02]'}`}
                >
                    {submitting ? 'جاري الإرسال...' : isSoldOut ? 'انتهت الكمية' : 'تأكيد الطلبية'}
                    {!submitting && !isSoldOut && <ShoppingCart size={22} />}
                </button>
                {isSoldOut && <p className="text-burgundy text-center mt-4 text-sm font-serif flex items-center justify-center"><AlertCircle size={14} className="ml-2"/> نعتذر، هذا المنتج لم يعد متوفراً حالياً.</p>}
              </div>
            </form>
          </div>

          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="sticky top-32 space-y-8">
                <div className="bg-black-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl group transition-all duration-700">
                    <div className="h-72 relative overflow-hidden">
                        <img src={(product.images && product.images.length > 0) ? product.images[0] : ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black-card via-transparent to-transparent"></div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-gold/50 text-[10px] uppercase block mb-2">{product.category === 'artwork' ? 'لوحة أصلية' : product.category === 'clothing' ? 'قطعة حصرية' : 'إصدار فاخر'}</span>
                                <h2 className="text-3xl text-gold font-serif">{product.name}</h2>
                            </div>
                            <div className="text-2xl text-ivory/90 font-serif" dir="ltr">{product.price.toLocaleString()} دج</div>
                        </div>
                        
                        {product.category === 'clothing' && (
                            <div className="mb-10">
                                <label className="text-ivory/50 text-xs uppercase block mb-4">اختر المقاس المتوفر</label>
                                <div className="flex flex-wrap gap-3">
                                    {(product.sizes || []).map(size => {
                                        const sizeQty = product.sizes_stock?.[size] || 0;
                                        const disabled = sizeQty === 0;
                                        return (
                                            <button 
                                                key={size}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[50px] h-[50px] flex flex-col items-center justify-center rounded-xl font-sans transition-all border ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : selectedSize === size ? 'bg-gold text-black-deep border-gold shadow-lg shadow-gold/20' : 'bg-black-deep text-ivory/70 border-white/10 hover:border-gold/50'}`}
                                            >
                                                <span className="text-sm font-bold">{size}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 text-ivory/30 text-[10px] uppercase">
                            <div className="flex items-center font-serif"><Truck size={14} className="ml-2"/> شحن آمن لـ 58 ولاية</div>
                            <div className="w-[1px] h-4 bg-white/10"></div>
                            <div className="font-serif">دفع عند الاستلام</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Order;
