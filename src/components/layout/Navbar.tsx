import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/cart';
import { NAV_LINKS } from '../../data/site';
import { scrollToSection } from '../../lib/format';
import { Logo } from '../ui/Emblem';

const useActiveSection = (ids: readonly string[]) => {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
};

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export const Navbar = () => {
  const { count, openPanel } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
    history.replaceState(null, '', `#${id}`);
  };

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'border-b border-line/80 bg-white/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-18">
        <a href="#top" onClick={(e) => go(e, 'top')} aria-label="Snoresis AI ana sayfa">
          <Logo light={!solid} />
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition xl:px-4 ${
                  solid
                    ? isActive
                      ? 'text-ink'
                      : 'text-slate-500 hover:text-ink'
                    : isActive
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 xl:inset-x-4 h-0.5 rounded-full bg-brand transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openPanel('cart')}
            className="relative inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand py-2.5 pr-3 pl-4 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgb(0_102_255/0.7)] transition hover:bg-brand-deep active:scale-[0.97]"
            aria-label={`Sepet, ${count} ürün`}
          >
            <ShoppingBag size={17} strokeWidth={2.2} />
            <span>Sepet</span>
            <span
              key={count}
              className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[0.7rem] font-bold tabular-nums ${
                count > 0 ? 'animate-pop bg-white text-brand' : 'bg-white/20 text-white'
              }`}
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full lg:hidden ${
              solid ? 'text-ink hover:bg-mist' : 'text-white hover:bg-white/10'
            }`}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-in border-t border-line bg-white lg:hidden" aria-label="Mobil menü">
          <div className="container-x flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                className={`flex items-center justify-between rounded-xl px-3 py-3.5 font-display text-lg font-semibold ${
                  active === link.id ? 'text-brand' : 'text-ink'
                }`}
              >
                {link.label}
                <span className="text-slate-300">→</span>
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
