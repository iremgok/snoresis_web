import { useState, type FormEvent } from 'react';
import { CircleCheck, Mail, ShieldAlert, Smartphone, Trash2 } from 'lucide-react';
import { PageHeading, PageShell } from '../components/layout/PageShell';
import { Field } from '../components/ui/FormField';
import { useToast } from '../context/toast';
import { SITE } from '../data/site';
import { ApiError, FriendlyError, postJson, toFriendlyMessage } from '../lib/errors';
import { isEmbedded } from '../lib/route';

type Step = 'email' | 'code' | 'done';

const DELETED = [
  'Hesabınız ve oturum bilgileriniz',
  'Uyku, apne ve gece özeti kayıtlarınız',
  'Akıllı saat / Health Connect üzerinden alınıp saklanan ölçümleriniz',
  'Acil durum kayıtlarınız ve profil bilgileriniz (yaş, boy, kilo vb.)',
  'Şifreli bulut yedeğiniz',
];

const RETAINED = [
  'Sipariş ve fatura kayıtları, vergi mevzuatı gereği 10 yıl saklanır; bu kayıtlar sağlık verisi içermez.',
  'Telefonunuzdaki yerel veriler uygulamayı kaldırdığınızda silinir.',
  'Health Connect’teki kayıtlar Health Connect’e aittir; oradan ayrıca silebilirsiniz.',
];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const explain = (err: unknown) => {
  if (err instanceof ApiError && err.status === 400) {
    return new FriendlyError(
      'Kod hatalı ya da süresi dolmuş. Kodu kontrol edin veya yeni kod isteyin.',
      'Kod doğrulanamadı',
    );
  }
  if (err instanceof ApiError && err.status === 503) {
    return new FriendlyError(
      `Web üzerinden silme şu an kullanılamıyor. Talebinizi ${SITE.email} adresine kayıtlı e-postanızdan iletebilirsiniz.`,
      'Hizmet kullanılamıyor',
    );
  }
  return err;
};

const AccountDeletionPage = () => {
  const { notify } = useToast();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const fail = (err: unknown, fallback: string) => {
    const e = explain(err);
    notify({
      tone: 'error',
      title: e instanceof FriendlyError ? (e.title ?? 'İşlem tamamlanamadı') : 'İşlem tamamlanamadı',
      message: toFriendlyMessage(e, fallback),
    });
  };

  const requestCode = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!isEmail(email)) return setError('Geçerli bir e-posta girin');
    setError(undefined);
    setBusy(true);
    try {
      await postJson('/api/account-deletion', { action: 'request', email: email.trim() });
      setStep('code');
      notify({
        tone: 'success',
        title: 'Kod gönderildi',
        message: 'Bu adrese kayıtlı bir hesap varsa 6 haneli doğrulama kodu gönderdik.',
      });
    } catch (err) {
      fail(err, 'Kod gönderilemedi. Lütfen tekrar deneyiniz.');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError('E-postadaki 6 haneli kodu girin');
    if (!confirmed) return setError('Silme işlemini onaylamak için kutuyu işaretleyin');
    setError(undefined);
    setBusy(true);
    try {
      await postJson('/api/account-deletion', { action: 'confirm', email: email.trim(), code });
      setStep('done');
    } catch (err) {
      fail(err, 'Hesabınız silinemedi. Lütfen tekrar deneyiniz.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Hesap ve Veri Silme" embedded={isEmbedded()}>
      <PageHeading eyebrow="Hesap" title="Hesap ve Veri Silme">
        <p>
          Snoresis AI hesabınızı ve hesabınıza bağlı tüm verileri kalıcı olarak silebilirsiniz. Hesap sahibi olduğunuzu
          doğrulamak için kayıtlı e-posta adresinize tek kullanımlık bir kod göndeririz.
        </p>
      </PageHeading>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <section className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7" aria-live="polite">
          {step === 'done' ? (
            <div className="py-4 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white">
                <CircleCheck size={32} strokeWidth={2.2} />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-ink">Hesabınız silindi</h2>
              <p className="mt-2 text-sm text-slate-500">
                <span className="font-semibold text-ink">{email.trim()}</span> hesabı ve bağlı tüm sağlık verileri
                kalıcı olarak silindi. Uygulamayı telefonunuzdan kaldırarak yerel verileri de temizleyebilirsiniz.
              </p>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={requestCode} noValidate className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Mail size={18} />
                </span>
                <h2 className="text-lg font-semibold text-ink">1. E-posta adresiniz</h2>
              </div>
              <Field
                label="Uygulamada kayıtlı e-posta"
                type="email"
                inputMode="email"
                autoComplete="email"
                name="email"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
                className="[&_input]:text-base sm:[&_input]:text-sm"
              />
              <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
                {busy ? 'Gönderiliyor…' : 'Doğrulama Kodu Gönder'}
              </button>
            </form>
          ) : (
            <form onSubmit={confirm} noValidate className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-600">
                  <Trash2 size={18} />
                </span>
                <h2 className="text-lg font-semibold text-ink">2. Kodu girin ve onaylayın</h2>
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-ink">{email.trim()}</span> adresine gönderilen 6 haneli kodu girin.
              </p>
              <Field
                label="Doğrulama kodu"
                inputMode="numeric"
                autoComplete="one-time-code"
                name="code"
                placeholder="••••••"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="[&_input]:text-center [&_input]:font-mono [&_input]:text-lg [&_input]:tracking-[0.5em]"
              />
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-[0.82rem] leading-relaxed text-rose-900">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4.5 w-4.5 shrink-0 cursor-pointer accent-rose-600"
                />
                Hesabımın ve tüm sağlık verilerimin kalıcı olarak silineceğini, bu işlemin geri alınamayacağını
                anlıyorum.
              </label>
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="btn w-full bg-rose-600 py-3.5 text-white hover:bg-rose-700"
              >
                {busy ? 'Siliniyor…' : 'Hesabımı Kalıcı Olarak Sil'}
              </button>
              <div className="flex flex-wrap justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="cursor-pointer font-semibold text-slate-500 hover:text-ink"
                >
                  E-postayı değiştir
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => requestCode()}
                  className="cursor-pointer font-semibold text-brand disabled:opacity-50"
                >
                  Kodu yeniden gönder
                </button>
              </div>
            </form>
          )}
        </section>

        <aside className="space-y-4 text-sm">
          <div className="rounded-3xl border border-line bg-white p-5">
            <p className="font-semibold text-ink">Silinen veriler</p>
            <ul className="mt-2.5 space-y-1.5 text-slate-600">
              {DELETED.map((d) => (
                <li key={d} className="flex gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <ShieldAlert size={16} className="text-amber-500" /> Saklanan / ayrıca silinmesi gerekenler
            </p>
            <ul className="mt-2.5 space-y-1.5 text-slate-600">
              {RETAINED.map((d) => (
                <li key={d} className="flex gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-mist p-5 text-slate-600">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Smartphone size={16} className="text-brand" /> Uygulamadan silme
            </p>
            <p className="mt-1.5">
              Uygulamada{' '}
              <span className="font-semibold text-ink">Hesabım › Gizlilik &amp; Verilerim › Hesabımı Sil</span> yolunu
              da kullanabilirsiniz. Sorun yaşarsanız{' '}
              <a href={`mailto:${SITE.email}?subject=Hesap%20silme%20talebi`} className="font-semibold text-brand">
                {SITE.email}
              </a>{' '}
              adresine kayıtlı e-postanızdan yazın; talebiniz en geç 30 gün içinde sonuçlandırılır.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
};

export default AccountDeletionPage;
