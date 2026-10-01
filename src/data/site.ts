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

// Satıcı bilgileri Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu'nda gösterilir.
// MERSİS ve vergi bilgileri boş bırakılırsa metinlerde yer almaz — yayından önce mutlaka doldurun.
export const COMPANY = {
  legalName: 'Snoresis AI A.Ş.',
  address: SITE.address,
  email: SITE.email,
  phone: SITE.phone,
  mersis: '',
  taxOffice: '',
  taxNumber: '',
};

export const NAV_LINKS = [
  { id: 'hakkimizda', label: 'Hakkımızda' },
  { id: 'urunler', label: 'Ürünler' },
  { id: 'ozellikler', label: 'Özellikler' },
  { id: 'uygulama', label: 'Uygulama' },
  { id: 'sss', label: 'SSS' },
  { id: 'siparis-takip', label: 'Sipariş Takip' },
  { id: 'iletisim', label: 'Bize Ulaşın' },
] as const;

// Ürün iddiaları tek yerde: SSS ve ürün kartları buradan okur.
// Yayından önce kendi doğrulama testlerinizin ve donanım ölçümlerinizin sonuçlarıyla eşleştirin.
export const CLAIMS = {
  accuracy: '%95',
  batteryNights: 7,
  chargeHours: 1.5,
  returnDays: 14,
  deliveryDays: '1–3 iş günü',
};
