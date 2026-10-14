/** Sayfa mobil uygulamanın In-App WebView'inden (`?source=app`) mı açıldı? */
export const isEmbedded = () => new URLSearchParams(window.location.search).get('source') === 'app';
