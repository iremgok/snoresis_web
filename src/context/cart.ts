import { createContext, useContext } from 'react';
import type { CartItem, ColorOption, Product } from '../types';

export type Panel = 'none' | 'cart' | 'checkout';

export interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  panel: Panel;
  lastAdded: (CartItem & { addedAt: number }) | null;
  addItem: (product: Product, color: ColorOption) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  openPanel: (panel: Panel) => void;
  closePanel: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
