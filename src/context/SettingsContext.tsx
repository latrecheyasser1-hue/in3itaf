import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
  site_title: string;
  site_subtitle: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_title: string;
  about_p1: string;
  about_p2: string;
  artist_quote: string;
  artist_name: string;
  artist_image: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  instagram_link: string;
  facebook_link: string;
  tiktok_link: string;
  card_artwork_title: string;
  card_artwork_desc: string;
  card_book_title: string;
  card_book_desc: string;
  card_clothing_title: string;
  card_clothing_desc: string;
}

const defaultSettings: Settings = {
  site_title: 'انعطاف',
  site_subtitle: 'فن · كلمة · أناقة',
  hero_title: 'انعطاف',
  hero_subtitle: 'الفن والإبداع',
  hero_description: 'منصة جزائرية تجمع بين جمال الخط العربي، أناقة الأزياء، وعمق الكلمات.',
  about_title: 'عن انعطاف',
  about_p1: 'انعطاف هي منصة فنية متكاملة تهدف إلى دمج التراث الجزائري العريق بلمسات معاصرة.',
  about_p2: 'نحن نؤمن أن الفن ليس مجرد لوحة بل هو أسلوب حياة، وانعطاف هو المكان الذي يلتقي فيه الخط العربي والأزياء العصرية.',
  artist_quote: 'الإبداع هو الانعطاف عن المألوف نحو الجمال المطلق.',
  artist_name: 'الفنان المؤسس',
  artist_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  contact_phone: '+213 (0) 555 12 34 56',
  contact_email: 'contact@in3itaf.art',
  contact_address: 'شارع ديدوش مراد، الجزائر العاصمة',
  instagram_link: 'https://instagram.com/in3itaf',
  facebook_link: 'https://facebook.com/in3itaf',
  tiktok_link: 'https://tiktok.com/@in3itaf',
  card_artwork_title: 'فن اللوحات',
  card_artwork_desc: 'اكتشف مجموعتنا الحصرية من اللوحات الفنية التي تمزج بين الخط العربي والأسلوب الحديث.',
  card_book_title: 'كلمة ومعنى',
  card_book_desc: 'إصدارات أدبية وفلسفية تغوص في عمق الوجدان الإنساني بكلمات من ذهب.',
  card_clothing_title: 'أناقة الأزياء',
  card_clothing_desc: 'أزياء راقية مستوحاة من الهوية الجزائرية، مصممة لمن يعشق التميز.'
};

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    
    if (data && !error) {
      const settingsMap: any = { ...defaultSettings };
      data.forEach((item: { key: string, value: string }) => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
