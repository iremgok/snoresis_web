import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, CircleCheck, Mail, MapPin, MessageCircle, Phone, Send, type LucideIcon } from 'lucide-react';
import { useToast } from '../../context/toast';
import { SITE } from '../../data/site';
import { sendContactMessage } from '../../lib/contact';
import { Field, TextAreaField } from '../ui/FormField';
import { PhoneNumber } from '../ui/PhoneNumber';
import { SnoresisLoading } from '../ui/SnoresisLoading';

const CHANNELS: { icon: LucideIcon; label: string; value: ReactNode; href: string; external?: boolean; accent: string }[] = [
  {
    icon: Phone,
    label: 'Dahili Tel',
    value: <PhoneNumber />,
    href: SITE.phoneHref,
    accent: 'bg-brand/10 text-brand',
  },
  {
    icon: Mail,
    label: 'E-posta',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    accent: 'bg-sky-500/10 text-sky-600',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp Destek Hattı',
    value: 'Hemen yazın',
    href: SITE.whatsappUrl,
    external: true,
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: MapPin,
    label: 'Adres',
    value: SITE.address,
    href: SITE.mapsUrl,
    external: true,
    accent: 'bg-violet/10 text-violet',
  },
];

type Form = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { name: '', email: '', message: '' };
const LABELS: Record<keyof Form, string> = { name: 'Ad Soyad', email: 'E-posta', message: 'Mesaj' };

const validate = (f: Form): Errors => {
  const e: Errors = {};
  if (f.name.trim().length < 3) e.name = 'Lütfen adınızı ve soyadınızı girin';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Geçerli bir e-posta adresi girin';
  if (f.message.trim().length < 10) e.message = 'Mesajınız en az 10 karakter olmalı';
  return e;
};

const SEND_FAILED = 'Mesajınız gönderilemedi';

const ContactForm = () => {
  const { notify, notifyError } = useToast();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [sentTo, setSentTo] = useState('');

  const bind = (key: keyof Form) => ({
    name: key,
    value: form[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      notify({
        tone: 'error',
        title: SEND_FAILED,
        message: `Eksik ya da hatalı alanlar: ${Object.keys(found)
          .map((k) => LABELS[k as keyof Form])
          .join(', ')}. Lütfen işaretli alanları kontrol ediniz.`,
      });
      return;
    }
    setStatus('sending');
    const email = form.email.trim();
    try {
      await sendContactMessage({ name: form.name.trim(), email, message: form.message.trim() });
      setSentTo(email);
      setForm(EMPTY);
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      notifyError(err, SEND_FAILED, 'Mesajınız gönderilemedi. Lütfen internet bağlantınızı ve alanları kontrol ediniz.');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white">
          <CircleCheck size={32} />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-ink">Mesajınız alındı!</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
          Teşekkürler. Ekibimiz en kısa sürede <span className="font-semibold text-ink">{sentTo}</span> adresinden size
          dönüş yapacak.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-6">
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={status === 'sending'} className="relative space-y-4">
      {status === 'sending' && <SnoresisLoading variant="overlay" label="Mesajınız gönderiliyor..." />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad Soyad" autoComplete="name" placeholder="Adınız Soyadınız" {...bind('name')} />
        <Field label="E-posta Adresi" type="email" autoComplete="email" placeholder="ornek@eposta.com" {...bind('email')} />
      </div>
      <TextAreaField label="Mesajınız" rows={5} placeholder="Size nasıl yardımcı olabiliriz?" {...bind('message')} />
      <div className="flex flex-col-reverse items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Bilgileriniz yalnızca size dönüş yapmak için kullanılır.</p>
        <button type="submit" disabled={status === 'sending'} className="btn-primary px-8 py-3.5">
          {status === 'sending' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Gönderiliyor…
            </>
          ) : (
            <>
              Gönder <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export const ContactSection = () => (
  <section id="iletisim" className="pb-24 md:pb-32">
    <div className="container-x">
      <div className="max-w-2xl">
        <span className="eyebrow text-brand">
          <span className="h-px w-8 bg-brand" />
          Bize Ulaşın
        </span>
        <h2 className="section-title text-ink">Bizimle İletişime Geçin</h2>
        <p className="mt-5 max-w-lg leading-relaxed text-slate-600">
          Ürünler, siparişiniz ya da uygulama hakkında sorularınız mı var? Formu doldurun ya da doğrudan arayın; ekibimiz
          size yardımcı olmaktan mutluluk duyar.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-soft sm:p-8">
          <h3 className="text-xl font-bold text-ink">Mesaj Gönderin</h3>
          <p className="mt-1 mb-6 text-sm text-slate-500">Tüm alanların doldurulması gerekir.</p>
          <ContactForm />
        </div>

        <ul className="grid content-start gap-3">
          {CHANNELS.map(({ icon: Icon, label, value, href, external, accent }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lift sm:p-5"
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent}`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</span>
                  <span className="mt-0.5 block font-display leading-snug font-semibold break-words text-ink tabular-nums sm:text-lg">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
