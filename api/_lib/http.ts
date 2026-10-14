// Vercel Functions (Web Request/Response) için küçük yardımcılar.

export const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const redirect = (location: string) =>
  new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } });

/** Ödemeyi yapan kişinin IP'si (iyzico `buyer.ip` ve iptal isteği için zorunlu). */
export const clientIp = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';

/**
 * Sitenin kök adresi. iyzico geri dönüş adresi buradan üretildiği için üretimde
 * PUBLIC_SITE_URL tanımlanmalıdır (istek başlığına güvenilmez).
 */
export const siteUrl = (req: Request) => (process.env.PUBLIC_SITE_URL ?? new URL(req.url).origin).replace(/\/$/, '');

export const readJson = async <T>(req: Request): Promise<T | null> => {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
};
