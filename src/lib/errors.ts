/** Kullanıcıya doğrudan gösterilebilecek, Türkçe açıklamalı hata. */
export class FriendlyError extends Error {
  readonly title?: string;
  constructor(message: string, title?: string) {
    super(message);
    this.name = 'FriendlyError';
    this.title = title;
  }
}

/** HTTP yanıtından türeyen hata; durum koduna göre açıklama üretilir. */
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message = `HTTP ${status}`) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const byStatus = (status: number) => {
  if (status === 400 || status === 422) return 'Bazı alanlar eksik ya da hatalı. Lütfen bilgilerinizi kontrol ediniz.';
  if (status === 401 || status === 403) return 'Bu işlem için yetkiniz bulunmuyor. Sayfayı yenileyip tekrar deneyiniz.';
  if (status === 404) return 'İstenen kaynak bulunamadı. Lütfen daha sonra tekrar deneyiniz.';
  if (status === 408) return 'İstek zaman aşımına uğradı. Lütfen bağlantınızı kontrol edip tekrar deneyiniz.';
  if (status === 429) return 'Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyiniz.';
  if (status >= 500) return 'Sunucularımızda geçici bir sorun var. Lütfen biraz sonra tekrar deneyiniz.';
  return null;
};

/** Ham hata nesnesini (ağ, HTTP, JS) kullanıcı dostu bir cümleye çevirir. */
export const toFriendlyMessage = (err: unknown, fallback: string) => {
  if (err instanceof FriendlyError) return err.message;
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'İnternet bağlantınız kesilmiş görünüyor. Bağlantınızı kontrol edip tekrar deneyiniz.';
  }
  if (err instanceof ApiError) return byStatus(err.status) ?? fallback;
  if (err instanceof DOMException && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
    return 'İstek zaman aşımına uğradı. Lütfen bağlantınızı kontrol edip tekrar deneyiniz.';
  }
  // fetch, ağ hatalarında TypeError ("Failed to fetch" / "NetworkError…") fırlatır
  if (err instanceof TypeError && /fetch|network|load failed/i.test(err.message)) {
    return 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol ediniz.';
  }
  return fallback;
};

const TIMEOUT_MS = 12_000;

/** JSON gönderen fetch sarmalayıcı: zaman aşımı + HTTP durumlarını ApiError'a çevirir. */
export const postJson = async (url: string, body: unknown) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new ApiError(res.status);
  return res;
};
