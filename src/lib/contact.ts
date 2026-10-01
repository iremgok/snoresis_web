import { postJson } from './errors';

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

export type ContactMessage = { name: string; email: string; message: string };

/** İletişim formunu gönderir. VITE_CONTACT_ENDPOINT tanımlı değilse gönderim simüle edilir. */
export const sendContactMessage = async (data: ContactMessage) => {
  if (ENDPOINT) {
    await postJson(ENDPOINT, data);
    return;
  }
  // TODO: Gerçek API / e-posta servisi bağlanana kadar simülasyon. Çevrimdışıyken fetch gibi hata verir.
  await new Promise((r) => window.setTimeout(r, 900));
  if (!navigator.onLine) throw new TypeError('Failed to fetch');
};
