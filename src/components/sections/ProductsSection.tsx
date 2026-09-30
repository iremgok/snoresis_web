import React, { useState } from 'react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';

export const ProductsSection: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({
    '1': '#E2E8F0',
    '2': '#1E3A8A'
  });

  const handleColorSelect = (productId: string, hex: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: hex }));
  };

  return (
    <section id="products" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ürünlerimiz</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Bilimsel olarak test edilmiş, kullanıcı dostu ve etkili uyku sağlığı çözümlerimizi keşfedin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between border border-slate-100"
            >
              <div>
                <div className="text-6xl text-center mb-6">{product.imageIcon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-6 min-h-[40px]">
                  {product.description}
                </p>

                {product.colors && (
                  <div className="mb-6">
                    <span className="text-xs font-semibold text-slate-400 block mb-2">Renk Seçimi</span>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => handleColorSelect(product.id, color.hex)}
                          style={{ backgroundColor: color.hex }}
                          className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                            selectedColors[product.id] === color.hex
                              ? 'border-blue-600 scale-110'
                              : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-2xl font-black text-slate-900 mb-4">
                  {product.price.toLocaleString('tr-TR')} TL
                </div>
                <button
                  onClick={() => addToCart(product, selectedColors[product.id])}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
