export interface ColorOption {
  name: string;
  hex: string;
}

export type ProductArt = 'ring' | 'dock' | 'case';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  price: number;
  art: ProductArt;
  colors: ColorOption[];
  featured?: boolean;
}

export interface CartItem {
  key: string;
  product: Product;
  color: ColorOption;
  quantity: number;
}
