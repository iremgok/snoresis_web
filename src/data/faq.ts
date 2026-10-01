import type { FaqItem } from '../types';
import { CLAIMS } from './site';

export const FAQ: FaqItem[] = [
  {
    id: 'nedir',
    question: 'Snoresis nedir ve ne işe yarar?',
    answer: [
      'Snoresis, horlama ve nefes duraksamalarını evde takip etmenizi sağlayan akıllı bir yüzük ve mobil uygulamadır. Gece boyunca SpO₂, nabız ve nefes ritminizi ölçer; sabah size okunabilir bir uyku raporu sunar.',
    ],
  },
  {
    id: 'kullanim',
    question: 'Snoresis Cihazı ve şarj ünitesi nasıl kullanılır?',
    answer: [
      'Yatmadan önce yüzüğü işaret ya da orta parmağınıza takın ve uygulamada “Uykuyu Başlat”a dokunun. Sabah yüzüğü manyetik şarj ünitesine bırakmanız yeterli; mıknatıs yüzüğü kendiliğinden hizalar ve veriler telefonunuza otomatik aktarılır.',
    ],
  },
  {
    id: 'dogruluk',
    question: 'Doğruluk oranı nedir?',
    answer: [
      `Yapay zeka algoritmamız uyku verilerinizi ${CLAIMS.accuracy}’e varan analitik doğrulukla işleyerek nefes duraksamalarını tespit eder.`,
      'Ancak Snoresis AI, uyku sağlığınızı takip etmenize yardımcı olan destekleyici bir sağlıklı yaşam (wellness) teknolojisidir; klinik teşhis için sertifikalandırılmış bir tıbbi cihaz değildir. Raporunuzda dikkat çeken bir bulgu varsa bir uzman hekime danışmanızı öneririz.',
    ],
  },
  {
    id: 'sarj',
    question: 'Şarjı ne kadar süre dayanır?',
    answer: [
      `Tam dolu bir yüzük ${CLAIMS.batteryNights} geceye kadar dayanır ve yaklaşık ${CLAIMS.chargeHours.toLocaleString('tr-TR')} saatte tamamen şarj olur. Pil azaldığında uygulama sizi akşamdan uyarır.`,
    ],
  },
  {
    id: 'teslimat',
    question: 'Sipariş ettiğim ürün kaç günde teslim edilir ve kargo ücreti var mıdır?',
    answer: [
      `Kargo ücretsizdir. Siparişiniz 24 saat içinde kargoya verilir ve genellikle ${CLAIMS.deliveryDays} içinde elinizde olur. Siparişinizin nerede olduğunu Sipariş Takip bölümünden görebilirsiniz.`,
    ],
  },
];
