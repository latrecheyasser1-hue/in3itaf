export type Category = 'artwork' | 'book' | 'clothing';
export type ProductStatus = 'available' | 'sold' | 'reserved';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  sizes: string[] | null;
  sizes_stock: Record<string, number> | null;
  stock: number | null;
  introduction: string | null;
  quotes: string[] | null;
  status: ProductStatus;
  featured: boolean;
  created_at: string;
}

export type DeliveryType = 'bureau' | 'domicile';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Order {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  wilaya: string;
  delivery_type: DeliveryType;
  product_id: string;
  product_name: string;
  product_category: string;
  size: string | null;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  session_id: string;
  product_id: string;
  created_at: string;
}
