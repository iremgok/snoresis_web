import { useEffect } from 'react';
import { SITE } from '../../data/site';
import { Modal } from './Modal';

export type PolicyKey = 'kvkk' | 'privacy';

// Yer tutucu metinler — yayına almadan önce hukuk danışmanınızın onayladığı metinlerle değiştirin.
const POLICIES: Record<PolicyKey, { title: string; body: string[] }> = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    body: [
      '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, Snoresis AI olarak veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.',
      'Sipariş ve iletişim süreçlerinde paylaştığınız ad, iletişim ve adres bilgileriniz; siparişin yerine getirilmesi ve size destek sağlanması amaçlarıyla işlenir.',
      `Kanun'un 11. maddesi kapsamındaki haklarınıza ilişkin başvurularınızı ${SITE.email} adresine iletebilirsiniz.`,
    ],
  },
  privacy: {
    title: 'Gizlilik Politikası',
    body: [
      'Snoresis AI, kullanıcılarının gizliliğine önem verir. Uyku ve biyometrik verileriniz yalnızca size hizmet sunmak amacıyla işlenir.',
      'Verileriniz açık rızanız olmadan üçüncü taraflarla paylaşılmaz. Doktor raporları yalnızca sizin paylaşmayı seçtiğiniz kişilere iletilir.',
      `Sorularınız için ${SITE.email} adresinden bize ulaşabilirsiniz.`,
    ],
  },
};

export const PolicyModal = ({ policy, onClose }: { policy: PolicyKey; onClose: () => void }) => {
  const { title, body } = POLICIES[policy];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3 overflow-y-auto px-6 pb-7 text-sm leading-relaxed text-slate-600">
        {body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Modal>
  );
};
