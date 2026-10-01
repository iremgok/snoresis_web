import { useState, type MouseEvent } from 'react';
import { NAV_LINKS, SITE } from '../../data/site';
import { scrollToSection } from '../../lib/format';
import { Logo } from '../ui/Emblem';
import { PhoneNumber } from '../ui/PhoneNumber';
import { PolicyModal, type PolicyKey } from '../ui/PolicyModal';

const YEAR = new Date().getFullYear();

export const Footer = () => {
  const [policy, setPolicy] = useState<PolicyKey | null>(null);

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="bg-night text-white/70">
      <div className="container-x grid grid-cols-2 gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="col-span-2 max-w-xs md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            Horlama ve uyku apnesine yapay zeka destekli akıllı çözümler. İzmir'de geliştirildi.
          </p>
        </div>
        <nav aria-label="Alt menü">
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Sayfa</p>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Destek</p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href={SITE.phoneHref} className="tabular-nums hover:text-white">
                <PhoneNumber />
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp Destek
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Snoresis AI. Tüm Hakları Saklıdır.</p>
          <div className="flex gap-5">
            <button type="button" onClick={() => setPolicy('kvkk')} className="cursor-pointer hover:text-white">
              KVKK Aydınlatma Metni
            </button>
            <button type="button" onClick={() => setPolicy('privacy')} className="cursor-pointer hover:text-white">
              Gizlilik Politikası
            </button>
          </div>
        </div>
      </div>

      {policy && <PolicyModal policy={policy} onClose={() => setPolicy(null)} />}
    </footer>
  );
};
