export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageIcon: string;
  colors?: { name: string; hex: string }[];
}

export interface CartItem {
  product: Product;
  selectedColor?: string;
  quantity: number;
}
