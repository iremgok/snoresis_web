import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CookieBanner } from '../components/legal/CookieBanner';
import { PolicyModal } from '../components/legal/PolicyModal';
import type { CookieConsent, PolicyKey } from '../types';
import { LegalContext, type LegalContextValue } from './legal';

const STORAGE_KEY = 'snoresis-cookie-consent-v1';

const loadConsent = (): CookieConsent | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
};

/** `cookieBanner={false}`: mobil uygulamanın WebView'inde (çerez kullanmayan ödeme sayfası) bant gösterilmez. */
export const LegalProvider = ({ children, cookieBanner = true }: { children: ReactNode; cookieBanner?: boolean }) => {
  const [policy, setPolicy] = useState<PolicyKey | null>(null);
  const [consent, setConsent] = useState<CookieConsent | null>(loadConsent);
  const [bannerMode, setBannerMode] = useState<'summary' | 'preferences' | null>(() =>
    loadConsent() ? null : 'summary',
  );

  const saveConsent = useCallback<LegalContextValue['saveConsent']>((choice) => {
    const next: CookieConsent = { necessary: true, ...choice, decidedAt: new Date().toISOString() };
    setConsent(next);
    setBannerMode(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Depolama kapalıysa tercih yalnızca bu oturum için geçerli olur.
    }
  }, []);

  const openCookiePreferences = useCallback(() => setBannerMode('preferences'), []);

  const value = useMemo<LegalContextValue>(
    () => ({ openPolicy: setPolicy, consent, saveConsent, openCookiePreferences }),
    [consent, saveConsent, openCookiePreferences],
  );

  return (
    <LegalContext.Provider value={value}>
      {children}
      {cookieBanner && bannerMode && (
        <CookieBanner
          mode={bannerMode}
          initial={consent}
          onModeChange={setBannerMode}
          onSave={saveConsent}
          onOpenPolicy={() => setPolicy('cookies')}
        />
      )}
      {/* Ödeme modalının ve çerez bandının üstünde açılır */}
      {policy && <PolicyModal policy={policy} onClose={() => setPolicy(null)} />}
    </LegalContext.Provider>
  );
};
