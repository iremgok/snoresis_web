import { useEffect } from 'react';

const scrollToHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  // İlk açılışta animasyonsuz; bölümün scroll-margin-top'u sabit menüyü hesaba katar.
  document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
};

/**
 * Derin bağlantı (ör. mobil uygulamadan `/#siparis-takip`) ile açılışta ilgili bölüme gider.
 *
 * Tarayıcı anchor'a sayfa yüklenir yüklenmez kaydırmaya çalışır; SPA'da bölümler henüz
 * render edilmediği için sayfa en üstte kalır. Yazı tipleri hazır olunca (düzen oturunca)
 * ve görseller yüklenince (yükseklikler değişebilir) konum yeniden uygulanır.
 */
export const useHashScroll = () => {
  useEffect(() => {
    if (!window.location.hash) return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) requestAnimationFrame(scrollToHash);
    };
    document.fonts.ready.then(run);
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', run);
    };
  }, []);
};
