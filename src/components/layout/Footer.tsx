import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-xl font-bold">Snoresis</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Uyku kalitenizi artırmak ve sağlıklı bir yaşam sürmeniz için geliştirilmiş giyilebilir teknoloji çözümleri.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Mobil Uygulamamızı İndirin</h4>
          <p className="text-slate-400 text-sm mb-6">
            Uykunuzu anlık olarak takip edin, raporları doktorunuza hemen sunun.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition">
              <span className="text-2xl">▶</span>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase">GET IT ON</span>
                <span className="text-xs font-bold">Google Play</span>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase">Download on the</span>
                <span className="text-xs font-bold">App Store</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">İletişim</h4>
          <p className="text-slate-400 text-sm mb-2">📧 info@snoresis.com</p>
          <p className="text-slate-400 text-sm mb-2">📞 +90 555 123 4567</p>
          <p className="text-slate-400 text-sm">📍 İzmir, Türkiye</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
        © 2026 Snoresis Inc. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};
