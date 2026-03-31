import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import LuxuryIcon from '../ui/GoldenOrbitIcon';
import { useSettings } from '../../context/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="py-16 px-6 lg:px-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-[0.02]"></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 w-full text-right" dir="rtl">
        {/* Brand identity */}
        <div className="space-y-6">
          <Link to="/" className="text-4xl font-bold text-gold tracking-widest font-serif block">
            {settings.site_title || 'انعطاف'}
          </Link>
          <p className="text-ivory/70 leading-relaxed font-serif max-w-sm">
            {settings.hero_description || 'حيث يلتقي الفن بالكلمة والأناقة. انعطاف ليست مجرد علامة تجارية؛ إنها رحلة في عمق الثقافة والجمال الجزائري الممزوج بروح العصر.'}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-xl text-gold font-serif">روابط سريعة</h3>
          <ul className="space-y-3">
            <li><Link to="/gallery" className="text-ivory/80 hover:text-gold transition-colors block w-fit">المعرض الفني</Link></li>
            <li><Link to="/shop" className="text-ivory/80 hover:text-gold transition-colors block w-fit">المتجر</Link></li>
            <li><Link to="/book" className="text-ivory/80 hover:text-gold transition-colors block w-fit">الكتاب</Link></li>
            <li><Link to="/about" className="text-ivory/80 hover:text-gold transition-colors block w-fit">عن انعطاف</Link></li>
            <li><Link to="/contact" className="text-ivory/80 hover:text-gold transition-colors block w-fit">تواصل معنا</Link></li>
          </ul>
        </div>

        {/* Contact info & Socials */}
        <div className="space-y-6">
          <h3 className="text-xl text-gold font-serif">تواصل معنا</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 space-x-reverse text-ivory/80">
              <LuxuryIcon>
                <Phone size={18} className="text-gold" />
              </LuxuryIcon>
              <span dir="ltr" className="text-right">{settings.contact_phone || '+213 (0) 555 12 34 56'}</span>
            </li>
            <li className="flex items-center space-x-3 space-x-reverse text-ivory/80">
              <LuxuryIcon>
                <Mail size={18} className="text-gold" />
              </LuxuryIcon>
              <span>{settings.contact_email || 'contact@in3itaf.art'}</span>
            </li>
            <li className="flex items-center space-x-3 space-x-reverse text-ivory/80">
              <LuxuryIcon>
                <MapPin size={18} className="text-gold" />
              </LuxuryIcon>
              <span>{settings.contact_address || 'الجزائر العاصمة، الجزائر'}</span>
            </li>
          </ul>

          <div className="flex space-x-4 space-x-reverse pt-4">
            {settings.instagram_link && (
              <a href={settings.instagram_link} target="_blank" rel="noopener noreferrer" className="bg-black-deep p-2 rounded-full text-gold hover:bg-gold hover:text-black-deep transition-all duration-300">
                <LuxuryIcon>
                  <Instagram size={20} />
                </LuxuryIcon>
              </a>
            )}
            {settings.facebook_link && (
              <a href={settings.facebook_link} target="_blank" rel="noopener noreferrer" className="bg-black-deep p-2 rounded-full text-gold hover:bg-gold hover:text-black-deep transition-all duration-300">
                <LuxuryIcon>
                  <Facebook size={20} />
                </LuxuryIcon>
              </a>
            )}
            {settings.tiktok_link && (
              <a href={settings.tiktok_link} target="_blank" rel="noopener noreferrer" className="bg-black-deep p-2 rounded-full text-gold hover:bg-gold hover:text-black-deep transition-all duration-300 flex items-center justify-center w-9 h-9">
                <LuxuryIcon>
                  <span className="font-bold font-sans text-xs">TK</span>
                </LuxuryIcon>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-16 pt-8 border-t border-white/10 text-center relative z-10 w-full" dir="rtl">
        <p className="text-ivory/50 font-serif text-sm">
          جميع الحقوق محفوظة © {new Date().getFullYear()} {settings.site_title || 'انعطاف'}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
