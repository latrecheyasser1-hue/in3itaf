import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Contact: React.FC = () => {
  const { settings } = useSettings();

  return (
    <PageTransition>
      <div className="w-full relative min-h-screen pt-32 pb-24 px-6 lg:px-12" dir="rtl">
        <div className="container mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 h-full">
          
          {/* Info Side */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <AnimatedTitle text="تواصل معنا" className="text-5xl md:text-7xl text-gold mb-8" />
            <p className="text-ivory/70 font-serif text-xl mb-12 max-w-lg leading-loose">
              نحن هنا للاستماع لأسئلتكم، واستفساراتكم حول الأعمال الفنية والمشتريات. يسعدنا دائماً بناء جسور التواصل.
            </p>

            <ul className="space-y-8">
              <li className="flex items-start space-x-6 space-x-reverse group">
                <div className="bg-black-card p-4 rounded-full border border-white/5 group-hover:border-gold/50 transition-colors">
                  <Phone size={24} className="text-gold" />
                </div>
                <div>
                  <h4 className="text-ivory text-xl font-serif mb-1">الهاتف</h4>
                  <p className="text-ivory/50" dir="ltr">{settings.contact_phone || '+213 (0) 555 12 34 56'}</p>
                </div>
              </li>
              <li className="flex items-start space-x-6 space-x-reverse group">
                <div className="bg-black-card p-4 rounded-full border border-white/5 group-hover:border-gold/50 transition-colors">
                  <Mail size={24} className="text-gold" />
                </div>
                <div>
                  <h4 className="text-ivory text-xl font-serif mb-1">البريد الإلكتروني</h4>
                  <p className="text-ivory/50">{settings.contact_email || 'contact@in3itaf.art'}</p>
                </div>
              </li>
              <li className="flex items-start space-x-6 space-x-reverse group">
                <div className="bg-black-card p-4 rounded-full border border-white/5 group-hover:border-gold/50 transition-colors">
                  <MapPin size={24} className="text-gold" />
                </div>
                <div>
                  <h4 className="text-ivory text-xl font-serif mb-1">العنوان</h4>
                  <p className="text-ivory/50">{settings.contact_address || 'شارع ديدوش مراد، الجزائر العاصمة'}</p>
                </div>
              </li>
            </ul>

            <div className="flex space-x-6 space-x-reverse mt-12 pt-8 border-t border-white/10">
              {settings.instagram_link && (
                <a href={settings.instagram_link} target="_blank" rel="noopener noreferrer" className="text-ivory hover:text-gold transition-colors p-2 bg-black-card rounded-full shadow-lg">
                  <Instagram size={28} />
                </a>
              )}
              {settings.facebook_link && (
                <a href={settings.facebook_link} target="_blank" rel="noopener noreferrer" className="text-ivory hover:text-gold transition-colors p-2 bg-black-card rounded-full shadow-lg">
                  <Facebook size={28} />
                </a>
              )}
              {settings.tiktok_link && (
                <a href={settings.tiktok_link} target="_blank" rel="noopener noreferrer" className="text-ivory hover:text-gold transition-colors p-3 bg-black-card rounded-full shadow-lg flex items-center justify-center font-bold tracking-tighter text-xs">
                  TikTok
                </a>
              )}
            </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <form className="bg-black-card p-8 lg:p-12 rounded-2xl border border-white/5 shadow-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-ivory/80 font-serif text-sm">الاسم الكامل <span className="text-burgundy">*</span></label>
                <input required type="text" className="w-full bg-black-deep border border-white/10 rounded px-4 py-4 text-ivory focus:border-gold outline-none transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-ivory/80 font-serif text-sm">البريد الإلكتروني <span className="text-burgundy">*</span></label>
                <input required type="email" dir="ltr" className="w-full bg-black-deep border border-white/10 rounded px-4 py-4 text-ivory focus:border-gold outline-none transition-colors text-right" />
              </div>
              
              <div className="space-y-2">
                <label className="text-ivory/80 font-serif text-sm">الموضوع</label>
                <input type="text" className="w-full bg-black-deep border border-white/10 rounded px-4 py-4 text-ivory focus:border-gold outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-ivory/80 font-serif text-sm">الرسالة <span className="text-burgundy">*</span></label>
                <textarea required rows={5} className="w-full bg-black-deep border border-white/10 rounded px-4 py-4 text-ivory focus:border-gold outline-none transition-colors resize-none"></textarea>
              </div>

              <button type="button" className="w-full py-4 bg-transparent border border-gold text-gold font-bold font-serif text-xl rounded mt-6 hover:bg-gold hover:text-black-deep transition-all duration-300">
                إرسال الرسالة
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
