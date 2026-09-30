import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Uykunuzun Kontrolü <br />
            Artık Sizde
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Snoresis ile horlama ve uyku apnesini teknolojinin gücüyle kontrol edin.
            Daha kaliteli uykular için gelişmiş çözümler.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="bg-white text-slate-900 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-lg"
            >
              Ürünleri Keşfet
            </a>
            <a
              href="#about"
              className="border border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition"
            >
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-600/30 rounded-full flex items-center justify-center text-8xl md:text-9xl shadow-2xl backdrop-blur-md animate-pulse">
            😴
          </div>
        </div>
      </div>
    </section>
  );
};
