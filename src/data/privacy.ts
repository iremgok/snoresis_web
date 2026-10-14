import type { PolicyBlock } from '../types';
import { MEDICAL_DISCLAIMER } from './legal';
import { COMPANY } from './site';

// Snoresis AI mobil uygulaması + web sitesi Gizlilik Politikası (/gizlilik).
// Google Play "Sağlık Uygulamaları" beyanı ve Health Connect izin gerekçesi bu sayfayı açar
// (uygulama: PermissionsRationaleActivity / AppConstants.privacyPolicyUri).
// Health Connect veri türleri, uygulamanın AndroidManifest.xml'indeki izinlerle birebir aynı
// tutulmalıdır. Yayına almadan önce hukuk danışmanınızın onayından geçirin.

export const PRIVACY_UPDATED = '2026-10-14';

/** Health Connect'ten okunan veri türleri (yalnızca okuma; yazma izni istenmez). */
export const HEALTH_CONNECT_TYPES: { type: string; permission: string; purpose: string }[] = [
  {
    type: 'Oksijen satürasyonu (SpO₂)',
    permission: 'android.permission.health.READ_OXYGEN_SATURATION',
    purpose: 'Gece boyunca kandaki oksijen düşüşlerini (desatürasyon) tespit etmek ve uyku raporunda göstermek.',
  },
  {
    type: 'Kalp atış hızı (nabız)',
    permission: 'android.permission.health.READ_HEART_RATE',
    purpose: 'Apne olaylarına eşlik eden nabız değişimlerini analiz etmek ve uyku raporunda göstermek.',
  },
  {
    type: 'Uyku oturumları ve evreleri',
    permission: 'android.permission.health.READ_SLEEP',
    purpose:
      'Uyku süresini ve evrelerini, ölçümleri doğru gece ile eşleştirmek ve uyku kalitesi skorunu hesaplamak için kullanmak.',
  },
];

export interface PrivacySection extends PolicyBlock {
  id: string;
  heading: string;
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'veri-sorumlusu',
    heading: '1. Veri Sorumlusu',
    paragraphs: [
      `Bu politika; Snoresis AI mobil uygulaması (Android ve iOS), snoresis cihazları ve bu web sitesi için geçerlidir. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu ${COMPANY.legalName}’dir.`,
    ],
    list: [`Adres: ${COMPANY.address}`, `E-posta: ${COMPANY.email}`, `Telefon: ${COMPANY.phone}`],
  },
  {
    id: 'toplanan-veriler',
    heading: '2. Topladığımız Veriler',
    list: [
      'Hesap bilgileri: e-posta adresi ve oturum bilgileri.',
      'Sağlık ve biyometrik veriler: SpO₂, nabız ve nabız değişkenliği, apne/hipopne olayları ve süreleri, uyku süresi ve uyku kalitesi skorları. Bu veriler KVKK m.6 uyarınca özel nitelikli kişisel veridir.',
      'Profil bilgileri: yaş, cinsiyet, boy ve kilo (vücut kitle indeksi hesabı için; isteğe bağlı).',
      'Horlama ses kesitleri: yalnızca açık rızanızla, en yüksek sesli 5 kesit; yalnızca cihazınızda saklanır, sunucularımıza gönderilmez.',
      'Konum: yalnızca “acil durumda konum paylaşımı” rızası verdiyseniz ve kritik bir olay anında, acil durum kişinizle paylaşmak için. Android’in Bluetooth cihaz taraması için istediği konum izni konum verisi toplamak için kullanılmaz.',
      'Sipariş ve iletişim bilgileri (web sitesi): ad, soyad, e-posta, telefon, teslimat adresi ve sipariş içeriği.',
      'Teknik veriler: IP adresi, cihaz/tarayıcı bilgisi ve hata kayıtları (güvenlik ve hata giderme için).',
    ],
    paragraphs: [
      'Kart bilgileriniz Snoresis tarafından görülmez ve saklanmaz; ödeme, lisanslı ödeme kuruluşu iyzico’nun güvenli sayfasında 3D Secure ile alınır.',
    ],
  },
  {
    id: 'health-connect',
    heading: '3. Health Connect Verileri',
    paragraphs: [
      'Android’de, izin vermeniz hâlinde Snoresis AI, Google Health Connect’ten aşağıdaki veri türlerini yalnızca OKUR. Uygulama Health Connect’e veri yazmaz, silmez veya değiştirmez. Her veri türü için izin ayrı ayrı istenir; vermediğiniz izinler olmadan da uygulamanın diğer özellikleri çalışır.',
      'Health Connect’ten alınan veriler yalnızca size uyku apnesi risk analizi ve kişisel uyku raporu sunmak için kullanılır. Bu veriler reklam, pazarlama, kredi değerlendirmesi veya veri madenciliği amacıyla kullanılmaz, satılmaz ve veri aracılarıyla paylaşılmaz. İnsanlar tarafından okunmaz; yalnızca siz talep ettiğinizde (ör. destek talebi), güvenlik amacıyla veya yasal zorunluluk hâlinde erişilebilir.',
      'Snoresis AI’ın Health Connect’ten aldığı bilgileri kullanımı ve başka uygulamalara aktarımı, Sınırlı Kullanım (Limited Use) şartları dâhil olmak üzere Health Connect İzinleri politikasına uygundur.',
      'İzinleri istediğiniz zaman Android Ayarlar > Health Connect > Uygulama izinleri > Snoresis AI yolundan veya uygulamada Hesabım > Gizlilik ve KVKK İzinleri bölümünden geri alabilirsiniz. İzin geri alındığında yeni veri okunmaz.',
    ],
  },
  {
    id: 'amaclar',
    heading: '4. İşleme Amaçları ve Hukuki Sebepler',
    list: [
      'Uyku apnesi risk analizi, kişisel uyku raporu ve talep ettiğinizde doktor raporu (PDF) oluşturmak — KVKK m.6/2, açık rıza.',
      'Kritik apne olaylarında sizi uyarmak ve rıza verdiyseniz acil durum kişinize bildirmek — KVKK m.6/2, açık rıza.',
      'Olay özetlerinizi şifreli bulut yedeğinde saklamak (isteğe bağlı) — KVKK m.6/2 ve m.9, açık rıza.',
      'Siparişin alınması, ödeme, teslimat, fatura, iade ve destek — KVKK m.5/2 (c) sözleşmenin ifası ve (ç) hukuki yükümlülük.',
      'Bilgi güvenliği ve hata giderme — KVKK m.5/2 (f) meşru menfaat.',
    ],
  },
  {
    id: 'saklama-guvenlik',
    heading: '5. Saklama ve Güvenlik',
    paragraphs: [
      'Sağlık verileriniz öncelikle cihazınızda şifreli olarak saklanır. Bulut yedeklemeye rıza verdiyseniz olay özetleriniz aktarım sırasında (TLS) ve depolamada şifrelenerek bulut altyapımızda tutulur; erişim satır düzeyinde yalnızca sizin hesabınızla sınırlandırılır.',
      'Veriler hesabınız aktif olduğu sürece saklanır. Hesabınızı sildiğinizde sağlık verileriniz kalıcı olarak silinir. Sipariş ve fatura kayıtları, vergi mevzuatı gereği yasal süre (10 yıl) boyunca saklanır ve süre sonunda imha edilir.',
    ],
  },
  {
    id: 'paylasim',
    heading: '6. Paylaşım ve Aktarım',
    paragraphs: [
      'Sağlık verileriniz üçüncü taraflara satılmaz ve reklam amacıyla paylaşılmaz. Verileriniz yalnızca aşağıdaki hizmet sağlayıcılarla, hizmetin gerektirdiği ölçüde paylaşılır:',
    ],
    list: [
      'Bulut altyapısı (Supabase): hesap, isteğe bağlı şifreli yedek ve sipariş kayıtları; sunucular yurt dışında olabilir, aktarım KVKK m.9 kapsamında açık rızanıza dayanır.',
      'Ödeme kuruluşu (iyzico): yalnızca web sitesinden verilen siparişlerin ödemesi için.',
      'Kargo şirketleri: yalnızca teslimat için ad, telefon ve adres.',
      'Doktorunuz veya acil durum kişiniz: yalnızca sizin açık talebiniz veya rızanızla.',
      'Yetkili kamu kurumları: yalnızca yasal zorunluluk hâlinde.',
    ],
  },
  {
    id: 'hesap-silme',
    heading: '7. Hesap ve Veri Silme',
    paragraphs: [
      'Hesabınızı ve tüm verilerinizi uygulamada Hesabım > Gizlilik & Verilerim > Hesabımı Sil yolundan silebilirsiniz. Uygulamaya erişiminiz yoksa /hesap-silme sayfasından e-posta adresinizle silme talebi oluşturabilirsiniz. Ayrıca verilerinizi uygulamadan JSON olarak dışa aktarabilirsiniz.',
    ],
  },
  {
    id: 'haklariniz',
    heading: '8. KVKK m.11 Kapsamındaki Haklarınız',
    paragraphs: [
      `Verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme, aktarıldığı üçüncü kişileri bilme, itiraz etme ve zararın giderilmesini talep etme haklarına sahipsiniz. Açık rızanızı dilediğiniz zaman geri alabilirsiniz. Başvurularınızı ${COMPANY.email} adresine iletebilirsiniz; talebiniz en geç 30 gün içinde ücretsiz sonuçlandırılır.`,
    ],
  },
  {
    id: 'cocuklar',
    heading: '9. Çocukların Gizliliği',
    paragraphs: [
      'Snoresis AI 18 yaşından küçükler için tasarlanmamıştır ve bilerek 18 yaş altı kişilerden veri toplamaz.',
    ],
  },
  {
    id: 'degisiklikler',
    heading: '10. Değişiklikler ve İletişim',
    paragraphs: [
      `Bu politika güncellendiğinde yeni sürüm bu sayfada yayımlanır ve önemli değişiklikler uygulama içinde bildirilir. Sorularınız için: ${COMPANY.email}.`,
      MEDICAL_DISCLAIMER,
    ],
  },
];
