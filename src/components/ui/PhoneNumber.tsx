import { SITE } from '../../data/site';

// Numara ve dahili ayrı satırlara yalnızca "/" noktasında bölünür.
export const PhoneNumber = () => (
  <>
    <span className="whitespace-nowrap">{SITE.phone}</span>{' '}
    <span className="whitespace-nowrap">/ Dahili: {SITE.phoneExt}</span>
  </>
);
