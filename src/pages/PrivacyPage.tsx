import { HeartPulse } from 'lucide-react';
import { PageHeading, PageShell } from '../components/layout/PageShell';
import { HEALTH_CONNECT_TYPES, PRIVACY_SECTIONS, PRIVACY_UPDATED } from '../data/privacy';
import { isEmbedded } from '../lib/route';
import { useHashScroll } from '../lib/useHashScroll';

const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const HealthConnectTable = () => (
  <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
    <div className="flex items-center gap-2.5 border-b border-line bg-mist px-4 py-3">
      <HeartPulse size={17} className="shrink-0 text-brand" />
      <p className="text-sm font-semibold text-ink">Okunan Health Connect veri türleri</p>
    </div>
    <ul className="divide-y divide-line">
      {HEALTH_CONNECT_TYPES.map((t) => (
        <li key={t.permission} className="px-4 py-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-ink">{t.type}</p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700">
              Yalnızca okuma
            </span>
          </div>
          <p className="mt-1 text-[0.82rem] text-slate-600">{t.purpose}</p>
          <code className="mt-1.5 block font-mono text-[0.7rem] break-all text-slate-400">{t.permission}</code>
        </li>
      ))}
    </ul>
  </div>
);

const PrivacyPage = () => {
  // Health Connect izin ekranından /gizlilik#health-connect ile doğrudan bölüme gelinir.
  useHashScroll();
  return (
    <PageShell title="Gizlilik Politikası" embedded={isEmbedded()}>
      <PageHeading eyebrow="Yasal" title="Gizlilik Politikası ve KVKK Aydınlatma Metni">
        <p>
          Snoresis AI uygulaması, cihazları ve web sitesi kapsamında hangi verileri neden işlediğimizi, Health Connect
          verilerini nasıl kullandığımızı ve haklarınızı açıklar.
        </p>
        <p className="mt-2 text-xs text-slate-500">Son güncelleme: {dateFmt.format(new Date(PRIVACY_UPDATED))}</p>
      </PageHeading>

      <nav aria-label="İçindekiler" className="mb-10 rounded-2xl border border-line bg-white p-4 sm:p-5">
        <p className="mb-2.5 text-xs font-semibold tracking-widest text-slate-400 uppercase">İçindekiler</p>
        <ol className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {PRIVACY_SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-slate-600 transition hover:text-brand">
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="space-y-9 text-[0.92rem] leading-relaxed text-slate-600 sm:text-[0.95rem]">
        {PRIVACY_SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-normal text-ink sm:text-xl">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list && (
              <ul className="space-y-2 pl-1">
                {s.list.map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    <span className="min-w-0">{li}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.id === 'health-connect' && <HealthConnectTable />}
          </section>
        ))}
      </article>
    </PageShell>
  );
};

export default PrivacyPage;
