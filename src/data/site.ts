// İletişim ve mağaza bağlantıları — yayına almadan önce gerçek değerlerle güncelleyin.
export const SITE = {
  email: 'destek@snoresis.com',
  // Örnek numara — yayından önce gerçek santral numarasıyla doğrulayın.
  phone: '+90 (232) 488 20 00',
  phoneExt: '4025',
  // Virgül, aramada santral bağlandıktan sonra dahili numarayı tuşlar.
  phoneHref: 'tel:+902324882000,4025',
  whatsappUrl: 'https://wa.me/905xxxxxxxxx',
  address: 'İzmir Bakırçay Üniversitesi Teknoloji Geliştirme Bölgesi / İzmir, Türkiye',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('İzmir Bakırçay Üniversitesi Teknoloji Geliştirme Bölgesi'),
  appStoreUrl: 'https://apps.apple.com/',
  googlePlayUrl: 'https://play.google.com/store/apps',
};

export const NAV_LINKS = [
  { id: 'hakkimizda', label: 'Hakkımızda' },
  { id: 'urunler', label: 'Ürünler' },
  { id: 'ozellikler', label: 'Özellikler' },
  { id: 'uygulama', label: 'Uygulama' },
  { id: 'iletisim', label: 'İletişim' },
] as const;
