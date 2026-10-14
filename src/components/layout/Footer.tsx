import type { MouseEvent } from 'react';
import { useLegal } from '../../context/legal';
import { MEDICAL_DISCLAIMER } from '../../data/legal';
import { NAV_LINKS, SITE } from '../../data/site';
import { scrollToSection } from '../../lib/format';
import type { PolicyKey } from '../../types';
import { Logo } from '../ui/Emblem';
import { PaymentLogos, SecurityBadges } from '../ui/PaymentBadges';
import { PhoneNumber } from '../ui/PhoneNumber';

const YEAR = new Date().getFullYear();

const LEGAL_LINKS: { key: PolicyKey; label: string }[] = [
  { key: 'kvkk', label: 'KVKK Aydınlatma Metni' },
  { key: 'terms', label: 'Kullanıcı Sözleşmesi' },
  { key: 'distance-sales', label: 'Mesafeli Satış Sözleşmesi' },
  { key: 'cookies', label: 'Çerez Politikası' },
  { key: 'returns', label: 'İade ve İptal Koşulları' },
];

const heading = 'mb-2.5 text-xs sm:mb-4 font-semibold tracking-widest text-white/40 uppercase';
const link = 'cursor-pointer text-left transition hover:text-white';

export const Footer = () => {
  const { openPolicy, openCookiePreferences } = useLegal();

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="bg-night text-white/70">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-7 py-9 sm:gap-10 sm:py-14 md:grid-cols-[1.3fr_0.8fr_1.1fr_1fr]">
        <div className="col-span-2 max-w-xs md:col-span-1">
          <Logo light />
          <p className="mt-3 text-sm leading-relaxed sm:mt-4">
            Horlama ve uyku apnesine yapay zeka destekli akıllı çözümler. İzmir'de geliştirildi.
          </p>
          <SecurityBadges tone="dark" className="mt-4 sm:mt-6" />
        </div>
        <nav aria-label="Alt menü">
          <p className={heading}>Sayfa</p>
          <ul className="space-y-1.5 text-sm sm:space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Yasal">
          <p className={heading}>Yasal</p>
          <ul className="space-y-1.5 text-sm sm:space-y-2.5">
            {LEGAL_LINKS.map((l) => (
              <li key={l.key}>
                <button type="button" onClick={() => openPolicy(l.key)} className={link}>
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={openCookiePreferences} className={link}>
                Çerez Tercihleri
              </button>
            </li>
          </ul>
        </nav>
        <div>
          <p className={heading}>Destek</p>
          <ul className="space-y-1.5 text-sm sm:space-y-2.5">
            <li>
              <a href={SITE.phoneHref} className={`${link} tabular-nums`}>
                <PhoneNumber />
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className={link}>
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp Destek
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-4 sm:gap-4 sm:py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-white/45">{MEDICAL_DISCLAIMER}</p>
          <PaymentLogos tone="dark" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-3.5 text-xs sm:py-5">
          <p>© {YEAR} Snoresis AI A.Ş. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};
