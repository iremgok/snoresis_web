// POST /api/account-deletion   (Google Play "web üzerinden hesap silme" şartı)
//
//   { action: "request", email }        → e-postaya 6 haneli doğrulama kodu gönderilir
//   { action: "confirm", email, code }  → kod doğrulanır, mobil uygulamanın `delete-account`
//                                         Edge Function'ı kullanıcının kendi oturumuyla çağrılır
//
// Hesap sahipliği e-posta koduyla kanıtlanmadan hiçbir veri silinmez. Hesabın var olup olmadığı
// yanıtlardan anlaşılmaz (e-posta keşfine karşı "request" her zaman 200 döner).
//
// Ortam: SUPABASE_URL, SUPABASE_ANON_KEY (mobil uygulamanın Supabase projesi).

import { json, readJson } from './_lib/http.js';

interface Body {
  action?: string;
  email?: string;
  code?: string;
}

const config = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const anonKey = process.env.SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
};

const supabase = (cfg: { url: string; anonKey: string }, path: string, body: unknown, bearer?: string) =>
  fetch(`${cfg.url}${path}`, {
    method: 'POST',
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${bearer ?? cfg.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

export async function POST(req: Request) {
  const cfg = config();
  if (!cfg) {
    console.error('[account-deletion] SUPABASE_URL / SUPABASE_ANON_KEY tanımlı değil');
    return json(503, { error: 'not_configured' });
  }

  const body = await readJson<Body>(req);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return json(400, { error: 'invalid_email' });

  if (body?.action === 'request') {
    // create_user: false → kayıtlı olmayan adrese hesap açılmaz, kod da gönderilmez.
    const res = await supabase(cfg, '/auth/v1/otp', { email, create_user: false });
    if (res.status === 429) return json(429, { error: 'rate_limited' });
    if (!res.ok && res.status >= 500) return json(502, { error: 'auth_unavailable' });
    return json(200, { ok: true });
  }

  if (body?.action === 'confirm') {
    const code = typeof body.code === 'string' ? body.code.replace(/\D/g, '') : '';
    if (!/^\d{6}$/.test(code)) return json(400, { error: 'invalid_code' });

    const verify = await supabase(cfg, '/auth/v1/verify', { type: 'email', email, token: code });
    if (verify.status === 429) return json(429, { error: 'rate_limited' });
    if (!verify.ok) return json(400, { error: 'invalid_code' });
    const session = (await verify.json()) as { access_token?: string };
    if (!session.access_token) return json(400, { error: 'invalid_code' });

    const del = await supabase(cfg, '/functions/v1/delete-account', {}, session.access_token);
    if (!del.ok) {
      console.error('[account-deletion] delete-account başarısız', del.status, await del.text().catch(() => ''));
      return json(502, { error: 'delete_failed' });
    }
    console.info('[account-deletion] hesap silindi');
    return json(200, { ok: true });
  }

  return json(400, { error: 'invalid_action' });
}
