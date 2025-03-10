export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  discount?: number;
}