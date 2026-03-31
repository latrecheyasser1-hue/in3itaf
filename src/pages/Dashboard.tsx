import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Order, OrderStatus, Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { 
  ShoppingBag, 
  Image as ImageIcon, 
  BookOpen, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Trash2, 
  LogOut, 
  TrendingUp, 
  X,
  PlusCircle,
  Upload,
  Loader2,
  Quote,
  MessageSquarePlus,
  Settings as SettingsIcon,
  Save
} from 'lucide-react';

type DashboardTab = 'orders' | 'gallery' | 'shop' | 'books' | 'settings';

const Dashboard: React.FC = () => {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const [orderFilter] = useState<OrderStatus | 'all'>('all'); // Keeping for potential state filtering later
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, totalSales: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [] as string[],
    category: 'artwork' as Category,
    stock: '1',
    sizes: '',
    sizes_stock: {} as Record<string, number>,
    featured: false,
    introduction: '',
    quotes: [] as string[]
  });

  const { settings, refreshSettings } = useSettings();
  const [settingsFormData, setSettingsFormData] = useState<any>({});

  useEffect(() => {
    if (auth) {
        fetchData();
        setSettingsFormData(settings);
    }
  }, [auth, settings]);

  const fetchData = async () => {
    setLoading(true);
    
    // Auto-cleanup expired orders for artworks (older than 24h)
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: expiredOrders } = await supabase
            .from('orders')
            .select('*')
            .eq('product_category', 'artwork')
            .eq('status', 'pending')
            .lt('created_at', twentyFourHoursAgo);

        if (expiredOrders && expiredOrders.length > 0) {
            for (const order of expiredOrders) {
                // Return artwork to available
                await supabase.from('products').update({ status: 'available' }).eq('id', order.product_id);
                // Mark order as cancelled
                await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
            }
        }
    } catch (e) {
        console.error("Cleanup error:", e);
    }

    const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: productData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    if (orderData) setOrders(orderData);
    if (productData) setProducts(productData);

    if (orderData) {
      const pending = orderData.filter(o => o.status === 'pending').length;
      const confirmed = orderData.filter(o => o.status === 'confirmed').length;
      const totalSales = orderData.filter(o => o.status === 'confirmed').reduce((acc, curr) => acc + (curr.total_price || 0), 0);
      setStats({ pending, confirmed, totalSales });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const urls: string[] = [...formData.images];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Upload error:", uploadError);
            alert(`خطأ في رفع الصورة (${file.name}): ` + uploadError.message);
            continue;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        if (data) urls.push(data.publicUrl);
    }

    setFormData({ ...formData, images: urls });
    setUploading(false);
  };

  const removeImage = (index: number) => {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const price = parseFloat(formData.price);
    const stock = formData.category === 'artwork' ? 1 : parseInt(formData.stock || '0');

    if (isNaN(price)) {
        alert('يرجى إدخال سعر صحيح');
        setLoading(false);
        return;
    }

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: price,
      category: formData.category,
      images: formData.images,
      featured: formData.featured,
      stock: stock,
      sizes: formData.category === 'clothing' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : null,
      sizes_stock: formData.category === 'clothing' ? formData.sizes_stock : null,
      introduction: formData.category === 'book' ? formData.introduction : null,
      quotes: formData.category === 'book' ? formData.quotes : null,
      status: editingProduct ? editingProduct.status : 'available'
    };

    try {
        let error;
        if (editingProduct) {
            const { error: err } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('products').insert([productPayload]);
            error = err;
        }

        if (error) {
            throw error;
        } else {
            alert(editingProduct ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
            setIsModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        }
    } catch (err: any) {
        console.error("Save error:", err);
        alert('خطأ في الحفظ: ' + (err.message || 'فشل الاتصال بقاعدة البيانات'));
    } finally {
        setLoading(false);
    }
  };

  const handleStatusUpdate = async (order: Order, newStatus: OrderStatus) => {
    // If we're cancelling a previously pending or confirmed order, we should RESTORE stock
    if (newStatus === 'cancelled' && order.status !== 'cancelled') {
        const { data: product } = await supabase.from('products').select('*').eq('id', order.product_id).single();
        if (product) {
            if (product.category === 'book') {
                await supabase.from('products').update({ stock: (product.stock || 0) + (order.quantity || 1) }).eq('id', product.id);
            } else if (product.category === 'clothing' && order.size) {
                const newStock = { ...product.sizes_stock };
                newStock[order.size] = (newStock[order.size] || 0) + (order.quantity || 1);
                await supabase.from('products').update({ sizes_stock: newStock }).eq('id', product.id);
            } else if (product.category === 'artwork') {
                await supabase.from('products').update({ status: 'available' }).eq('id', product.id);
            }
        }
    }

    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
    if (!error) fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };

  const handleSaveSettings = async (keys: string[]) => {
    setLoading(true);
    try {
        const updates = keys.map(key => ({
            key,
            value: settingsFormData[key]
        }));
        
        const { error } = await supabase.from('site_settings').upsert(updates);
        if (error) throw error;
        
        alert('تم حفظ الإعدادات بنجاح');
        await refreshSettings();
    } catch (err: any) {
        alert('خطأ في الحفظ: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettingsFormData({ ...settingsFormData, [key]: value });
  };

  const handleSettingsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `settings/${key}_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        if (data) updateSetting(key, data.publicUrl);
    } catch (err: any) {
        alert('خطأ في الرفع: ' + err.message);
    } finally {
        setUploading(false);
    }
  };

  const openAddModal = (cat: Category) => {
    setEditingProduct(null);
    setFormData({
        name: '', description: '', price: '', images: [], category: cat,
        stock: '1', sizes: cat === 'clothing' ? 'S,M,L,XL' : '',
        sizes_stock: cat === 'clothing' ? { S: 10, M: 10, L: 10, XL: 10 } : {},
        featured: false, introduction: '', quotes: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
      setFormData({
          name: p.name || '',
          description: p.description || '',
          price: (p.price || 0).toString(),
          images: p.images || [],
          category: p.category,
          stock: (p.stock || 1).toString(),
          sizes: (p.sizes || []).join(','),
          sizes_stock: p.sizes_stock || {},
          featured: p.featured || false,
          introduction: p.introduction || '',
          quotes: p.quotes || []
      });
      setEditingProduct(p);
      setIsModalOpen(true);
  };

  const addQuote = () => setFormData({ ...formData, quotes: [...formData.quotes, ''] });
  const updateQuote = (idx: number, val: string) => {
      const nq = [...formData.quotes];
      nq[idx] = val;
      setFormData({ ...formData, quotes: nq });
  };
  const removeQuote = (idx: number) => {
      const nq = [...formData.quotes];
      nq.splice(idx, 1);
      setFormData({ ...formData, quotes: nq });
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-black-deep flex items-center justify-center p-6" dir="rtl">
        <form onSubmit={(e) => { e.preventDefault(); if(password === 'in3itaf2025') setAuth(true); else alert('خطأ'); }} className="bg-black-card p-12 rounded-3xl border border-gold/30 max-w-md w-full shadow-2xl">
          <h1 className="text-3xl text-gold font-serif text-center mb-8">إدارة انعطاف</h1>
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black-deep border border-white/10 text-center rounded-xl px-4 py-4 text-ivory mb-4 outline-none focus:border-gold transition-all" />
          <button type="submit" className="w-full py-4 bg-gold text-black-deep rounded-xl font-bold">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-deep text-ivory flex font-serif overflow-hidden" dir="rtl">
      <aside className="w-72 bg-black-card border-l border-white/10 flex flex-col relative z-20">
        <div className="p-8">
          <div className="text-2xl text-gold mb-12 font-bold tracking-widest text-right whitespace-nowrap">IN3ITAF ADMIN</div>
          <nav className="flex flex-col space-y-2">
            {[
              { id: 'orders', label: 'الطلبات المستلمة', icon: ShoppingBag },
              { id: 'gallery', label: 'إدارة اللوحات', icon: ImageIcon },
              { id: 'shop', label: 'إدارة الأزياء', icon: Package },
              { id: 'books', label: 'إدارة الكتب', icon: BookOpen },
              { id: 'settings', label: 'إعدادات الموقع', icon: SettingsIcon },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as DashboardTab)} className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-gold/10 text-gold border-r-4 border-gold shadow-lg shadow-gold/5' : 'text-ivory/60 hover:bg-white/5 hover:text-ivory'}`}>
                <tab.icon size={20} />
                <span className="text-md">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-white/5">
          <button onClick={() => setAuth(false)} className="flex items-center space-x-3 space-x-reverse text-burgundy hover:text-red-400 transition-colors"><LogOut size={20} /><span>تسجيل الخروج</span></button>
        </div>
      </aside>
      
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative z-10">
        <div className="fixed top-0 right-0 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard label="طلبات جديدة" val={stats.pending} icon={Clock} color="text-yellow-500" />
            <StatCard label="طلبات مؤكدة" val={stats.confirmed} icon={CheckCircle} color="text-gold" />
            <StatCard label="الإيرادات الكلية" val={stats.totalSales.toLocaleString() + ' دج'} icon={TrendingUp} color="text-green-500" />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-black-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-right text-sm">
                    <thead className="bg-black-deep/50 border-b border-white/10 text-ivory/40">
                        <tr><th className="p-6 text-right">الزبون</th><th className="p-6 text-right">المنتج</th><th className="p-6 text-right">التفاصيل</th><th className="p-6 text-right">الإجمالي</th><th className="p-6 text-right">الحالة</th><th className="p-6 text-right">الإجراء</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.filter(o => orderFilter === 'all' || o.status === orderFilter).map(o => (
                            <tr key={o.id} className="hover:bg-white/5 transition-all group">
                                <td className="p-6 text-right"><div className="font-bold">{o.first_name} {o.last_name}</div><div className="text-[10px] text-gold/60">{o.wilaya} | {o.phone}</div></td>
                                <td className="p-6 text-right"><div>{o.product_name}</div></td>
                                <td className="p-6 text-right">{o.size && <span className="bg-white/5 px-2 rounded text-[10px] ml-2">M: {o.size}</span>}<span>×{o.quantity}</span></td>
                                <td className="p-6 text-right text-gold">{(o.total_price || 0).toLocaleString()} <span className="text-[10px]">دج</span></td>
                                <td className="p-6 text-right"><StatusTag status={o.status} /></td>
                                <td className="p-6 text-right flex items-center justify-end space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleStatusUpdate(o, 'confirmed')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"><CheckCircle size={14}/></button>
                                    <button onClick={() => handleStatusUpdate(o, 'cancelled')} className="p-2 bg-burgundy/10 text-burgundy rounded-lg hover:bg-burgundy hover:text-white transition-all"><XCircle size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === 'settings' ? (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                {/* 1. GENERAL INFO */}
                <SettingsSection title="المعلومات الأساسية" onSave={() => handleSaveSettings(['site_title', 'site_subtitle'])}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="عنوان الموقع الأساسي"><input value={settingsFormData.site_title || ''} onChange={e => updateSetting('site_title', e.target.value)} className="form-input" /></FormItem>
                        <FormItem label="الوصف القصير (Tagline)"><input value={settingsFormData.site_subtitle || ''} onChange={e => updateSetting('site_subtitle', e.target.value)} className="form-input" /></FormItem>
                    </div>
                </SettingsSection>

                {/* 2. HERO SECTION */}
                <SettingsSection title="قسم الترحيب (Hero Section)" onSave={() => handleSaveSettings(['hero_title', 'hero_subtitle', 'hero_description'])}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormItem label="العنوان الكبير"><input value={settingsFormData.hero_title || ''} onChange={e => updateSetting('hero_title', e.target.value)} className="form-input" /></FormItem>
                            <FormItem label="العنوان الفرعي"><input value={settingsFormData.hero_subtitle || ''} onChange={e => updateSetting('hero_subtitle', e.target.value)} className="form-input" /></FormItem>
                        </div>
                        <FormItem label="نص الوصف"><textarea rows={3} value={settingsFormData.hero_description || ''} onChange={e => updateSetting('hero_description', e.target.value)} className="form-input resize-none" /></FormItem>
                    </div>
                </SettingsSection>

                {/* 3. ABOUT PAGE */}
                <SettingsSection title="صفحة من نحن (About)" onSave={() => handleSaveSettings(['about_title', 'about_p1', 'about_p2', 'artist_quote', 'artist_name', 'artist_image'])}>
                    <div className="space-y-6">
                        <FormItem label="عنوان الصفحة"><input value={settingsFormData.about_title || ''} onChange={e => updateSetting('about_title', e.target.value)} className="form-input" /></FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormItem label="الفقرة الأولى"><textarea rows={4} value={settingsFormData.about_p1 || ''} onChange={e => updateSetting('about_p1', e.target.value)} className="form-input resize-none" /></FormItem>
                            <FormItem label="الفقرة الثانية"><textarea rows={4} value={settingsFormData.about_p2 || ''} onChange={e => updateSetting('about_p2', e.target.value)} className="form-input resize-none" /></FormItem>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormItem label="مقولة الفنان"><textarea rows={2} value={settingsFormData.artist_quote || ''} onChange={e => updateSetting('artist_quote', e.target.value)} className="form-input resize-none" /></FormItem>
                            <FormItem label="اسم كاتب المقولة"><input value={settingsFormData.artist_name || ''} onChange={e => updateSetting('artist_name', e.target.value)} className="form-input" /></FormItem>
                        </div>
                        <div className="space-y-4">
                            <label className="text-ivory/40 text-[10px] uppercase block">صورة الفنان</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-black-deep">
                                    <img src={settingsFormData.artist_image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <label className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition-all flex items-center gap-3">
                                    <Upload size={18} className="text-gold" />
                                    <span>تغيير الصورة</span>
                                    <input type="file" onChange={e => handleSettingsImageUpload(e, 'artist_image')} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* 4. CONTACT PAGE */}
                <SettingsSection title="معلومات التواصل" onSave={() => handleSaveSettings(['contact_phone', 'contact_email', 'contact_address', 'instagram_link', 'facebook_link', 'tiktok_link'])}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormItem label="رقم الهاتف"><input value={settingsFormData.contact_phone || ''} onChange={e => updateSetting('contact_phone', e.target.value)} className="form-input" /></FormItem>
                        <FormItem label="البريد الإلكتروني"><input value={settingsFormData.contact_email || ''} onChange={e => updateSetting('contact_email', e.target.value)} className="form-input" /></FormItem>
                        <FormItem label="العنوان"><input value={settingsFormData.contact_address || ''} onChange={e => updateSetting('contact_address', e.target.value)} className="form-input" /></FormItem>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <FormItem label="رابط انستغرام"><input value={settingsFormData.instagram_link || ''} onChange={e => updateSetting('instagram_link', e.target.value)} className="form-input" placeholder="https://..." /></FormItem>
                        <FormItem label="رابط فيسبوك"><input value={settingsFormData.facebook_link || ''} onChange={e => updateSetting('facebook_link', e.target.value)} className="form-input" placeholder="https://..." /></FormItem>
                        <FormItem label="رابط تيك توك"><input value={settingsFormData.tiktok_link || ''} onChange={e => updateSetting('tiktok_link', e.target.value)} className="form-input" placeholder="https://..." /></FormItem>
                    </div>
                </SettingsSection>

                {/* 5. SECTION CARDS */}
                <SettingsSection title="بطاقات الفئات (الصفحة الرئيسية)" onSave={() => handleSaveSettings(['card_artwork_title', 'card_artwork_desc', 'card_book_title', 'card_book_desc', 'card_clothing_title', 'card_clothing_desc'])}>
                    <div className="space-y-8">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                            <h4 className="text-gold text-xs mb-4 uppercase tracking-widest">فئة اللوحات</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="العنوان"><input value={settingsFormData.card_artwork_title || ''} onChange={e => updateSetting('card_artwork_title', e.target.value)} className="form-input" /></FormItem>
                                <FormItem label="الوصف"><textarea rows={2} value={settingsFormData.card_artwork_desc || ''} onChange={e => updateSetting('card_artwork_desc', e.target.value)} className="form-input resize-none" /></FormItem>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                            <h4 className="text-gold text-xs mb-4 uppercase tracking-widest">فئة الكتب</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="العنوان"><input value={settingsFormData.card_book_title || ''} onChange={e => updateSetting('card_book_title', e.target.value)} className="form-input" /></FormItem>
                                <FormItem label="الوصف"><textarea rows={2} value={settingsFormData.card_book_desc || ''} onChange={e => updateSetting('card_book_desc', e.target.value)} className="form-input resize-none" /></FormItem>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                            <h4 className="text-gold text-xs mb-4 uppercase tracking-widest">فئة الأزياء</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="العنوان"><input value={settingsFormData.card_clothing_title || ''} onChange={e => updateSetting('card_clothing_title', e.target.value)} className="form-input" /></FormItem>
                                <FormItem label="الوصف"><textarea rows={2} value={settingsFormData.card_clothing_desc || ''} onChange={e => updateSetting('card_clothing_desc', e.target.value)} className="form-input resize-none" /></FormItem>
                            </div>
                        </div>
                    </div>
                </SettingsSection>
            </motion.div>
          ) : (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center bg-black-card p-6 rounded-2xl border border-white/5">
                <div><h2 className="text-2xl text-gold">{activeTab === 'gallery' ? 'إدارة اللوحات' : activeTab === 'shop' ? 'إدارة الأزياء' : 'إدارة الكتب'}</h2></div>
                <button onClick={() => openAddModal(activeTab === 'gallery' ? 'artwork' : activeTab === 'shop' ? 'clothing' : 'book')} className="flex items-center space-x-2 space-x-reverse bg-gold text-black-deep px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"><Plus size={18}/><span>إضافة منتج</span></button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {products.filter(p => p.category === (activeTab === 'gallery' ? 'artwork' : activeTab === 'shop' ? 'clothing' : 'book')).map(p => (
                    <ProductRow key={p.id} p={p} onEdit={() => openEditModal(p)} onDelete={() => handleDeleteProduct(p.id)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-black-card w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-2xl text-gold">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-ivory/50 hover:text-white p-2 bg-white/5 rounded-full"><X size={24}/></button>
                        </div>
                        
                        <form onSubmit={handleSaveProduct} className="p-8 space-y-8 overflow-y-auto">
                            <div className="space-y-4">
                                <label className="text-ivory/40 text-[10px] uppercase tracking-widest block">صور المنتج (PC/Mobile Upload)</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {formData.images.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                            <img src={url} className="w-full h-full object-cover" alt="" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-burgundy rounded-full text-white opacity-0 group-hover:opacity-100"><X size={10}/></button>
                                        </div>
                                    ))}
                                    <label className={`aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                                        {uploading ? <Loader2 size={18} className="animate-spin text-gold" /> : <><Upload size={18} className="text-gold/50 mb-1" /><span className="text-[10px] text-ivory/30">رفع</span></>}
                                        <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormItem label="اسم المنتج"><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" /></FormItem>
                                <FormItem label="السعر (DZD)"><input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="form-input" /></FormItem>
                            </div>
                            
                            <FormItem label="الوصف العام"><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input resize-none" /></FormItem>
                            
                            {formData.category === 'book' && (
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <FormItem label="مقدمة الكتاب (Introduction)"><textarea rows={4} value={formData.introduction} onChange={e => setFormData({...formData, introduction: e.target.value})} className="form-input resize-none" placeholder="اكتب مقدمة الكتاب هنا..." /></FormItem>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-ivory/40 text-[10px] uppercase tracking-widest">إقتباسات من الكتاب (Quotes)</label>
                                            <button type="button" onClick={addQuote} className="flex items-center gap-1 text-[10px] text-gold border border-gold/20 px-2 py-1 rounded-lg hover:bg-gold/10"><MessageSquarePlus size={12}/> إضافة إقتباس</button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.quotes.map((q, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 text-gold/30"><Quote size={12}/></div>
                                                    <textarea value={q} onChange={e => updateQuote(idx, e.target.value)} className="form-input py-2 text-sm resize-none" placeholder={`إقتباس رقم ${idx+1}`} rows={2} />
                                                    <button type="button" onClick={() => removeQuote(idx)} className="p-2 text-burgundy hover:bg-burgundy/10 rounded-lg self-center"><Trash2 size={16}/></button>
                                                </div>
                                            ))}
                                            {formData.quotes.length === 0 && <div className="text-center py-4 text-ivory/20 text-xs italic">لا توجد إقتباسات مضافة</div>}
                                        </div>
                                    </div>

                                    <FormItem label="الكمية المتوفرة"><input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="form-input" /></FormItem>
                                </div>
                            )}

                            {formData.category === 'clothing' && (
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                                    <FormItem label="المقاسات (S,M,L...)"><input value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="form-input" /></FormItem>
                                    <div className="grid grid-cols-4 gap-4">
                                        {formData.sizes.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                                            <div key={s} className="flex flex-col gap-1 items-center">
                                                <span className="text-[10px] text-gold uppercase">{s}</span>
                                                <input type="number" value={formData.sizes_stock[s] || 0} onChange={e => {
                                                    const ns = { ...formData.sizes_stock, [s]: parseInt(e.target.value) };
                                                    setFormData({...formData, sizes_stock: ns});
                                                }} className="w-full bg-black-card text-center text-xs py-2 border border-white/10 rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} id="feat" className="accent-gold w-4 h-4" />
                                <label htmlFor="feat" className="text-xs text-ivory/60">تمييز المنتج في الصفحة الرئيسية</label>
                            </div>

                            <button type="submit" disabled={loading || uploading} className="w-full py-5 bg-gold text-black-deep font-bold rounded-2xl hover:scale-[1.01] transition-all disabled:opacity-50 text-lg shadow-xl shadow-gold/20">
                                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const StatCard = ({ label, val, icon: Icon, color }: any) => (
    <div className="glass-card p-6 rounded-3xl flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="relative z-10"><p className="text-ivory/40 text-[10px] uppercase tracking-[0.2em] mb-1">{label}</p><h3 className={`text-4xl font-bold font-sans ${color}`}>{val}</h3></div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center opacity-20 transform group-hover:scale-110 transition-transform ${color.replace('text', 'bg')}`}><Icon size={24}/></div>
    </div>
);

const StatusTag = ({ status }: { status: OrderStatus }) => (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] border ${status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : status === 'cancelled' ? 'bg-burgundy/10 text-burgundy border-burgundy/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
        {status === 'confirmed' ? 'مؤكد' : status === 'cancelled' ? 'ملغى' : 'معلق'}
    </span>
);

const FormItem = ({ label, children }: any) => (
    <div className="space-y-2"><label className="text-ivory/40 text-[10px] uppercase tracking-widest block pr-2">{label}</label>{children}</div>
);

const ProductRow = ({ p, onEdit, onDelete }: { p: Product, onEdit: any, onDelete: any }) => (
    <div className="bg-black-card border border-white/5 rounded-[2rem] p-5 flex gap-6 group hover:border-gold/20 transition-all shadow-xl">
        <div className="w-24 h-24 bg-black-deep rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
            {p.images && p.images[0] ? (
                <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gold/10">
                    <ImageIcon size={32} />
                </div>
            )}
        </div>
        <div className="flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg text-gold">{p.name}</h3>
                <span className="text-xs font-sans opacity-50">{p.price.toLocaleString()} DZD</span>
            </div>
            <div className="mt-1 text-[10px] text-ivory/20 flex gap-4">
                 {p.category === 'artwork' ? <span>قطعة فريدة</span> : <span>Stock: {p.stock}</span>}
                 {p.quotes && <span>{p.quotes.length} إقتباسات</span>}
            </div>
            <div className="mt-auto flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button onClick={onEdit} className="p-2 text-ivory/40 hover:text-gold"><PlusCircle size={14}/></button>
                <button onClick={onDelete} className="p-2 text-ivory/40 hover:text-burgundy"><Trash2 size={14}/></button>
            </div>
        </div>
    </div>
);

const SettingsSection = ({ title, onSave, children }: any) => (
    <div className="bg-black-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl text-gold font-bold">{title}</h3>
            <button onClick={onSave} className="flex items-center space-x-2 space-x-reverse bg-gold text-black-deep px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all">
                <Save size={16}/>
                <span>حفظ القسم</span>
            </button>
        </div>
        <div className="p-8 space-y-6">
            {children}
        </div>
    </div>
);

export default Dashboard;
