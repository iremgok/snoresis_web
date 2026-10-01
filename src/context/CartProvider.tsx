import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PRODUCTS } from '../data/products';
import type { CartItem, ColorOption, Product } from '../types';
import { CartContext, type CartContextValue, type Panel } from './cart';

const STORAGE_KEY = 'snoresis-cart-v1';

type StoredItem = { productId: string; colorName: string; quantity: number };

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as StoredItem[]).flatMap((s) => {
      const product = PRODUCTS.find((p) => p.id === s.productId);
      const color = product?.colors.find((c) => c.name === s.colorName);
      if (!product || !color || s.quantity < 1) return [];
      return [{ key: `${product.id}:${color.name}`, product, color, quantity: Math.min(s.quantity, 99) }];
    });
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    const stored: StoredItem[] = items.map((i) => ({
      productId: i.product.id,
      colorName: i.color.name,
      quantity: i.quantity,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Depolama kullanılamıyorsa sepet yalnızca bu oturumda tutulur.
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [panel, setPanel] = useState<Panel>('none');
  const [lastAdded, setLastAdded] = useState<CartContextValue['lastAdded']>(null);

  useEffect(() => saveCart(items), [items]);

  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(() => setLastAdded(null), 2600);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  const addItem = useCallback((product: Product, color: ColorOption) => {
    const key = `${product.id}:${color.name}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + 1, 99) } : i));
      }
      return [...prev, { key, product, color, quantity: 1 }];
    });
    setLastAdded({ key, product, color, quantity: 1, addedAt: Date.now() });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity < 1
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, 99) } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  const openPanel = useCallback((p: Panel) => setPanel(p), []);
  const closePanel = useCallback(() => setPanel('none'), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((n, i) => n + i.quantity * i.product.price, 0),
      panel,
      lastAdded,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openPanel,
      closePanel,
    }),
    [items, panel, lastAdded, addItem, setQuantity, removeItem, clear, openPanel, closePanel],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
