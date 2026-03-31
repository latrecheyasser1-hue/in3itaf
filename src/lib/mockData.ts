import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'همسات في الظلام',
    description: 'لوحة فنية أصلية تعبر عن صخب الروح وهدوء العقل باستخدام ألوان أكريليك داكنة مع لمسات ذهبية.',
    price: 45000,
    category: 'artwork',
    images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=800'],
    sizes: null,
    status: 'available',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'تلاطم',
    description: 'خط عربي كلاسيكي على قماش كانفاس إيطالي مدمج مع فن تجريدي معاصر.',
    price: 32000,
    category: 'artwork',
    images: ['https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&q=80&w=800'],
    sizes: null,
    status: 'sold',
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'شذرات الذهب',
    description: 'لوحة تجريدية تبرز اللون البورغندي العميق مع خطوط ذهبية بارزة.',
    price: 55000,
    category: 'artwork',
    images: ['https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=800'],
    sizes: null,
    status: 'reserved',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'معطف ليالي الأندلس',
    description: 'معطف شتوي فاخر مصمم بلمسات من الثقافة الجزائرية والأندلسية، مصنوع من الصوف الخالص المبطن.',
    price: 28000,
    category: 'clothing',
    images: ['https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'available',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'فستان القصبة',
    description: 'فستان أسود أنيق مستوحى من الهندسة المعمارية للقصبة العتيقة في الجزائر، مطرز بخيوط ذهبية.',
    price: 19500,
    category: 'clothing',
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800'],
    sizes: ['XS', 'S', 'M'],
    status: 'available',
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'كتاب "رحلة الظل والنور"',
    description: 'ديوان شعري مدمج برسومات حصرية ومقتطفات من مذكرات الفنانة. طبعة فاخرة بغلاف مقوى.',
    price: 3500,
    category: 'book',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'],
    sizes: null,
    status: 'available',
    featured: true,
    created_at: new Date().toISOString()
  }
];

export const wilayas = [
  '01-أدرار', '02-الشلف', '03-الأغواط', '04-أم البواقي', '05-باتنة', '06-بجاية', '07-بسكرة', '08-بشار', '09-البليدة', '10-البويرة',
  '11-تمنراست', '12-تبسة', '13-تلمسان', '14-تيارت', '15-تيزي وزو', '16-الجزائر', '17-الجلفة', '18-جيجل', '19-سطيف', '20-سعيدة',
  '21-سكيكدة', '22-سيدي بلعباس', '23-عنابة', '24-قالمة', '25-قسنطينة', '26-المدية', '27-مستغانم', '28-المسيلة', '29-معسكر', '30-ورقلة',
  '31-وهران', '32-البيض', '33-إليزي', '34-برج بوعريريج', '35-بومرداس', '36-الطارف', '37-تندوف', '38-تيسمسيلت', '39-الوادي', '40-خنشلة',
  '41-سوق أهراس', '42-تيبازة', '43-ميلة', '44-عين الدفلى', '45-النعامة', '46-عين تيموشنت', '47-غرداية', '48-غليزان', '49-تيميمون', '50-تالة حمزة',
  '51-عين صالح', '52-عين قزام', '53-توقرت', '54-برج باجي مختار', '55-بولوغين ابن زيري', '56-جانت', '57-المغير', '58-المنيعة'
];
