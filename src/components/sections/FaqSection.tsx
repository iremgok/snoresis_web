import { useState } from 'react';
import { Mail, Plus } from 'lucide-react';
import { FAQ } from '../../data/faq';
import { SITE } from '../../data/site';
import { scrollToSection } from '../../lib/format';

export const FaqSection = () => {
  const [open, setOpen] = useState<string | null>(FAQ[0].id);

  return (
    <section id="sss" className="py-24 md:py-32" aria-labelledby="sss-title">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow text-brand">
            <span className="h-px w-8 bg-brand" />
            SSS
          </span>
          <h2 id="sss-title" className="section-title text-ink">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-slate-600">
            Cihaz, teslimat ve iade hakkında en çok merak edilenleri derledik. Aradığınızı bulamazsanız ekibimiz bir
            mesaj uzağınızda.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#iletisim"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('iletisim');
              }}
              className="btn-primary"
            >
              Soru Sorun
            </a>
            <a href={`mailto:${SITE.email}`} className="btn-ghost">
              <Mail size={16} /> {SITE.email}
            </a>
          </div>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {FAQ.map((item, i) => {
            const isOpen = open === item.id;
            const panelId = `sss-${item.id}`;
            return (
              <li key={item.id}>
                <h3 className="tracking-normal">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full cursor-pointer items-start gap-4 py-5 text-left sm:gap-5 sm:py-6"
                  >
                    <span className="mt-0.5 w-6 shrink-0 font-display text-sm font-semibold text-slate-400 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-display text-[1.05rem] leading-snug font-semibold transition sm:text-lg ${
                        isOpen ? 'text-brand' : 'text-ink group-hover:text-brand'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition duration-300 ${
                        isOpen ? 'rotate-45 border-brand bg-brand text-white' : 'border-line text-slate-500 group-hover:border-brand/40'
                      }`}
                    >
                      <Plus size={16} strokeWidth={2.4} />
                    </span>
                  </button>
                </h3>
                {/* grid-rows hilesi: yükseklik ölçmeden yumuşak açılıp kapanma */}
                <div
                  id={panelId}
                  role="region"
                  aria-label={item.question}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <div className="space-y-3 pr-2 pb-6 pl-10 sm:pr-12 text-[0.95rem] leading-relaxed text-slate-600 sm:pl-11">
                      {item.answer.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
