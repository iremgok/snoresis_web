import { createContext, useContext } from 'react';
import type { CookieConsent, PolicyKey } from '../types';

export interface LegalContextValue {
  openPolicy: (key: PolicyKey) => void;
  /** null: kullanıcı henüz seçim yapmadı (çerez bandı görünür) */
  consent: CookieConsent | null;
  saveConsent: (choice: Pick<CookieConsent, 'analytics' | 'marketing'>) => void;
  /** Çerez bandını tercihler görünümüyle yeniden açar */
  openCookiePreferences: () => void;
}

export const LegalContext = createContext<LegalContextValue | null>(null);

export const useLegal = () => {
  const ctx = useContext(LegalContext);
  if (!ctx) throw new Error('useLegal must be used within LegalProvider');
  return ctx;
};
