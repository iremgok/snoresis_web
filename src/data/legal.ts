import type { Policy, PolicyKey } from '../types';
import { CLAIMS, COMPANY } from './site';

// Bu metinler mevzuata uygun bir başlangıç taslağıdır; yayına almadan önce hukuk danışmanınızın onayından geçirin.

export const MEDICAL_DISCLAIMER =
  'Snoresis AI web sitesi ve cihazları tıbbi teşhis amacı taşımaz. Sağlanan veriler bilgilendirme amaçlıdır.';

const UPDATED = '2026-10-01';

const sellerLines = [
  `Unvan: ${COMPANY.legalName}`,
  `Adres: ${COMPANY.address}`,
  `E-posta: ${COMPANY.email}`,
  `Telefon: ${COMPANY.phone}`,
  ...(COMPANY.mersis ? [`MERSİS No: ${COMPANY.mersis}`] : []),
  ...(COMPANY.taxNumber ? [`Vergi Dairesi / No: ${COMPANY.taxOffice} / ${COMPANY.taxNumber}`] : []),
];

export const POLICIES: Record<PolicyKey, Policy> = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    updated: UPDATED,
    blocks: [
      {
        paragraphs: [
          `6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla ${COMPANY.legalName} (“Snoresis AI”) tarafından aşağıda açıklanan kapsamda işlenmektedir.`,
        ],
      },
      {
        heading: '1. Veri Sorumlusu',
        list: sellerLines,
      },
      {
        heading: '2. İşlenen Kişisel Veriler',
        list: [
          'Kimlik bilgileri: ad, soyad.',
          'İletişim bilgileri: e-posta adresi, telefon numarası, teslimat ve fatura adresi.',
          'Müşteri işlem bilgileri: sipariş içeriği, sipariş numarası, fatura ve iade kayıtları.',
          'Anonim biyometrik uyku verileri: SpO₂, nabız, nefes duraksaması ve hareket ölçümleri. Bu veriler kimliğinizle eşleştirilmeden, anonimleştirilmiş olarak işlenir.',
          'İşlem güvenliği bilgileri: IP adresi, tarayıcı ve cihaz bilgileri, çerez kayıtları.',
        ],
        paragraphs: [
          'Kart bilgileriniz Snoresis AI tarafından görülmez ve saklanmaz; doğrudan lisanslı ödeme kuruluşu tarafından işlenir.',
        ],
      },
      {
        heading: '3. İşleme Amaçları',
        list: [
          'Siparişinizin alınması, ödemenin tahsili, ürünün teslimi ve faturalandırılması,',
          'Cayma, iade, garanti ve müşteri destek taleplerinizin yanıtlanması,',
          'Mobil uygulamada uyku raporlarınızın oluşturulması ve size sunulması,',
          'Anonim uyku verileriyle yapay zeka modellerimizin doğruluğunun geliştirilmesi,',
          'Yasal saklama ve bildirim yükümlülüklerimizin yerine getirilmesi, bilgi güvenliğinin sağlanması.',
        ],
      },
      {
        heading: '4. Hukuki Sebepler',
        paragraphs: [
          'Kişisel verileriniz KVKK m. 5/2 kapsamında; sözleşmenin kurulması ve ifası (c), hukuki yükümlülüğümüzün yerine getirilmesi (ç) ve meşru menfaatimiz (f) hukuki sebeplerine dayanılarak işlenir. Sağlık verisi niteliği taşıyabilecek uyku ölçümleriniz, KVKK m. 6 uyarınca yalnızca açık rızanız alınarak işlenir; rızanızı uygulama ayarlarından dilediğiniz zaman geri alabilirsiniz.',
        ],
      },
      {
        heading: '5. Aktarım',
        paragraphs: [
          'Verileriniz yalnızca yukarıdaki amaçlarla sınırlı olarak; kargo şirketleri, ödeme kuruluşları (iyzico, PayTR), bulut ve sunucu hizmet sağlayıcılarımız ile yetkili kamu kurum ve kuruluşlarına aktarılabilir. Verileriniz yurt dışına aktarılmaz; aktarım gerekirse KVKK m. 9’daki şartlara uyulur.',
        ],
      },
      {
        heading: '6. Haklarınız',
        paragraphs: [
          `KVKK m. 11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme, aktarıldığı üçüncü kişileri öğrenme ve zarara uğramanız hâlinde tazminat talep etme haklarına sahipsiniz. Başvurularınızı ${COMPANY.email} adresine iletebilirsiniz; talebiniz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
        ],
      },
      {
        heading: '7. Tıbbi Uyarı',
        paragraphs: [MEDICAL_DISCLAIMER],
      },
    ],
  },

  terms: {
    title: 'Kullanıcı Sözleşmesi',
    updated: UPDATED,
    blocks: [
      {
        heading: '1. Taraflar ve Kapsam',
        paragraphs: [
          `Bu sözleşme, snoresis.com web sitesini ve Snoresis AI mobil uygulamasını kullanan kişi (“Kullanıcı”) ile ${COMPANY.legalName} arasında, siteye erişim veya uygulamaya kayıt anında kurulmuş sayılır.`,
        ],
      },
      {
        heading: '2. Hizmetin Niteliği',
        paragraphs: [
          'Snoresis; uyku sırasında toplanan biyometrik ölçümleri analiz ederek bilgilendirme amaçlı raporlar sunar. Hizmet, bir hekim muayenesinin, tanısının veya tedavisinin yerini tutmaz.',
          MEDICAL_DISCLAIMER,
        ],
      },
      {
        heading: '3. Kullanıcının Yükümlülükleri',
        list: [
          'Kayıt ve sipariş sırasında doğru ve güncel bilgi vermek,',
          'Hesap bilgilerinin gizliliğini korumak ve hesabı üçüncü kişilerle paylaşmamak,',
          'Siteyi ve uygulamayı hukuka aykırı amaçlarla, otomatik yazılımlarla veya sisteme zarar verecek şekilde kullanmamak.',
        ],
      },
      {
        heading: '4. Fikri Mülkiyet',
        paragraphs: [
          'Site ve uygulamadaki tüm yazılım, tasarım, logo, metin ve görseller Snoresis AI’a aittir; izinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.',
        ],
      },
      {
        heading: '5. Sorumluluğun Sınırlandırılması',
        paragraphs: [
          'Raporlara dayanılarak hekime danışılmadan alınan sağlık kararlarından Snoresis AI sorumlu tutulamaz. Bakım, bağlantı veya mücbir sebeplerden doğan geçici hizmet kesintilerinde makul özen gösterilir.',
        ],
      },
      {
        heading: '6. Değişiklikler ve Uyuşmazlıklar',
        paragraphs: [
          'Snoresis AI bu sözleşmeyi güncelleyebilir; güncel metin bu sayfada yayımlandığı tarihte yürürlüğe girer. Uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır ve İzmir mahkemeleri ile icra daireleri yetkilidir; tüketici sıfatına sahip kullanıcıların Tüketici Hakem Heyeti ve Tüketici Mahkemelerine başvuru hakkı saklıdır.',
        ],
      },
    ],
  },

  'distance-sales': {
    title: 'Mesafeli Satış Sözleşmesi',
    updated: UPDATED,
    blocks: [
      {
        heading: '1. Taraflar',
        paragraphs: ['SATICI:'],
        list: sellerLines,
      },
      {
        paragraphs: [
          'ALICI: Ödeme sayfasında adı, iletişim ve teslimat bilgileri yer alan kişidir. Alıcı bilgileri sipariş özeti e-postasında ayrıca yer alır.',
        ],
      },
      {
        heading: '2. Konu',
        paragraphs: [
          'Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, Alıcı’nın snoresis.com üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.',
        ],
      },
      {
        heading: '3. Ürün, Fiyat ve Ödeme',
        paragraphs: [
          'Ürünlerin cinsi, rengi, adedi ve KDV dahil satış bedeli ödeme sayfasında ve sipariş özetinde gösterildiği gibidir. Kargo ücreti Alıcı’dan alınmaz. Ödeme; kredi kartı veya banka kartı ile, 3D Secure doğrulamasıyla lisanslı ödeme kuruluşu üzerinden tahsil edilir.',
        ],
      },
      {
        heading: '4. Teslimat',
        paragraphs: [
          `Ürün, ödemenin onaylanmasından itibaren en geç 24 saat içinde kargoya verilir ve Alıcı’nın bildirdiği adrese genellikle ${CLAIMS.deliveryDays} içinde teslim edilir. Teslimat süresi hiçbir durumda yasal üst sınır olan 30 günü aşamaz. Teslimatta hasarlı paketin kargo görevlisine tutanak tutturularak teslim alınmaması önerilir.`,
        ],
      },
      {
        heading: '5. Cayma Hakkı',
        paragraphs: [
          `Alıcı, ürünü teslim aldığı tarihten itibaren ${CLAIMS.returnDays} gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma bildirimi ${COMPANY.email} adresine yazılı olarak yapılır. Satıcı, bildirimin ulaşmasından itibaren 14 gün içinde toplam bedeli Alıcı’nın ödeme aracına iade eder. Alıcı ürünü cayma bildiriminden itibaren 10 gün içinde, Satıcı’nın anlaşmalı kargosuyla ücretsiz olarak geri gönderir.`,
        ],
      },
      {
        heading: '6. Garanti ve Ayıplı Mal',
        paragraphs: [
          'Ürünler 2 yıl yasal garanti kapsamındadır. Ayıplı mal durumunda Alıcı, 6502 sayılı Kanun’un 11. maddesindeki seçimlik haklarını (sözleşmeden dönme, bedel indirimi, ücretsiz onarım veya ayıpsız misli ile değişim) kullanabilir.',
        ],
      },
      {
        heading: '7. Uyuşmazlıklar',
        paragraphs: [
          'Bu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı’nca her yıl ilan edilen parasal sınırlar dahilinde Alıcı’nın yerleşim yerindeki Tüketici Hakem Heyetleri, bu sınırları aşan durumlarda Tüketici Mahkemeleri yetkilidir.',
        ],
      },
      {
        heading: '8. Yürürlük',
        paragraphs: [
          'Alıcı, ödeme sayfasındaki onay kutusunu işaretleyerek bu sözleşmenin ve Ön Bilgilendirme Formu’nun tüm koşullarını okuduğunu ve kabul ettiğini beyan eder. Sözleşme, siparişin tamamlanmasıyla yürürlüğe girer.',
        ],
      },
    ],
  },

  'pre-info': {
    title: 'Ön Bilgilendirme Formu',
    updated: UPDATED,
    blocks: [
      {
        heading: '1. Satıcı Bilgileri',
        list: sellerLines,
      },
      {
        heading: '2. Ürünün Temel Nitelikleri ve Fiyatı',
        paragraphs: [
          'Siparişinizdeki ürünlerin adı, rengi, adedi ve KDV dahil toplam fiyatı ödeme sayfasında yer alır. Gösterilen fiyatlara tüm vergiler dahildir; kargo ücretsizdir ve ek bir masraf yansıtılmaz.',
        ],
      },
      {
        heading: '3. Ödeme ve Teslimat',
        paragraphs: [
          `Ödeme; Visa, Mastercard veya TROY logolu kartlarla, iyzico / PayTR altyapısı üzerinden 3D Secure doğrulamasıyla alınır. Ürün 24 saat içinde kargoya verilir; tahmini teslim süresi ${CLAIMS.deliveryDays}dür.`,
        ],
      },
      {
        heading: '4. Cayma Hakkı',
        paragraphs: [
          `Teslimattan itibaren ${CLAIMS.returnDays} gün içinde gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Cayma hakkının nasıl kullanılacağı İade ve İptal Koşulları’nda açıklanmıştır.`,
        ],
      },
      {
        heading: '5. Şikâyet ve Başvuru',
        paragraphs: [
          `Şikâyetlerinizi ${COMPANY.email} adresine veya ${COMPANY.phone} numarasına iletebilirsiniz. Uyuşmazlık hâlinde Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvurabilirsiniz.`,
        ],
      },
      {
        heading: '6. Tıbbi Uyarı',
        paragraphs: [MEDICAL_DISCLAIMER],
      },
    ],
  },

  cookies: {
    title: 'Çerez Politikası',
    updated: UPDATED,
    blocks: [
      {
        paragraphs: [
          'Çerezler, ziyaret ettiğiniz sitenin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Snoresis AI olarak çerezleri sitenin çalışması, deneyiminizin iyileştirilmesi ve — onay vermeniz hâlinde — kampanyalarımızın ölçülmesi için kullanırız.',
        ],
      },
      {
        heading: 'Zorunlu Çerezler',
        paragraphs: [
          'Sepetinizin hatırlanması, ödeme adımlarının güvenle tamamlanması ve çerez tercihlerinizin saklanması için gereklidir. Bu çerezler kapatılamaz ve açık rızanıza tabi değildir.',
        ],
      },
      {
        heading: 'Analitik Çerezler',
        paragraphs: [
          'Hangi sayfaların ne kadar ziyaret edildiğini anonim olarak ölçerek siteyi geliştirmemize yardımcı olur. Yalnızca onay vermeniz hâlinde çalışır.',
        ],
      },
      {
        heading: 'Pazarlama Çerezleri',
        paragraphs: [
          'Size ilgi alanlarınıza uygun reklamlar gösterilmesini ve reklam kampanyalarımızın etkinliğinin ölçülmesini sağlar. Yalnızca onay vermeniz hâlinde çalışır.',
        ],
      },
      {
        heading: 'Tercihlerinizi Yönetme',
        paragraphs: [
          'Tercihlerinizi sayfanın altındaki “Çerez Tercihleri” bağlantısından dilediğiniz zaman değiştirebilirsiniz. Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz; ancak zorunlu çerezlerin engellenmesi sepet ve ödeme işlemlerinin çalışmasını engelleyebilir.',
        ],
      },
    ],
  },

  returns: {
    title: 'İade ve İptal Koşulları',
    updated: UPDATED,
    blocks: [
      {
        heading: 'Sipariş İptali',
        paragraphs: [
          `Siparişiniz kargoya verilmeden önce ${COMPANY.email} adresine sipariş numaranızla yazarak iptal edebilirsiniz. İptal edilen siparişlerin bedeli aynı gün iade sürecine alınır.`,
        ],
      },
      {
        heading: `${CLAIMS.returnDays} Gün Koşulsuz İade`,
        list: [
          `Ürünü teslim aldığınız günden itibaren ${CLAIMS.returnDays} gün içinde gerekçe göstermeden iade edebilirsiniz.`,
          'İade talebinizi sipariş numaranızla e-posta yoluyla iletin; size ücretsiz iade kargo kodu gönderilir.',
          'Ürünü faturası, kutusu, şarj ünitesi ve aksesuarlarıyla birlikte, mümkünse orijinal ambalajında gönderin.',
          'Ürün kontrol edildikten sonra bedel, cayma bildiriminizin ulaşmasından itibaren en geç 14 gün içinde ödeme yaptığınız karta iade edilir. Kartınıza yansıma süresi bankanıza göre değişebilir.',
        ],
      },
      {
        heading: 'İade Kabul Edilmeyen Durumlar',
        paragraphs: [
          'Olağan kullanım dışında hasar görmüş, darbe almış veya kullanıcı kaynaklı olarak işlevini yitirmiş ürünlerde değer kaybı bedeli talep edilebilir. Ürünü denemek için olağan şekilde kullanmanız iade hakkınızı ortadan kaldırmaz.',
        ],
      },
      {
        heading: 'Arızalı veya Hasarlı Ürün',
        paragraphs: [
          'Ürününüz hasarlı ulaştıysa ya da garanti süresi içinde arızalandıysa bize ulaşın; ücretsiz onarım, değişim veya bedel iadesi seçeneklerinden birini tercih edebilirsiniz. Tüm ürünler 2 yıl garantilidir.',
        ],
      },
    ],
  },
};
