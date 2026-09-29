import { useEffect } from 'react';
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router';

const NAV_ZONES = [
  { hash: 'seccion-cuentos', label: 'Cuentos' },
  { hash: 'seccion-juegos', label: 'Juegos' },
  { hash: 'seccion-chats', label: 'Chats' },
];

export function Layout() {
  const { hash, pathname, search } = useLocation();

  // Las zonas del navbar llevan a /#seccion-x; al llegar se hace scroll suave a esa sección.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, pathname]);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="banner-link" aria-label="Ir al inicio">
          <img
            src="/assets/ui/banner.webp"
            alt="La Muela del Diablo y otros cuentos"
            className="banner-img"
            width={2000}
            height={800}
            fetchPriority="high"
          />
        </Link>
        <nav className="site-nav" aria-label="Secciones">
          <img src="/assets/ui/navbar.webp" alt="" className="navbar-img" width={1600} height={400} />
          {NAV_ZONES.map((zone) => (
            <Link key={zone.hash} to={`/#${zone.hash}`} className={`nav-zone nav-zone-${zone.hash}`} aria-label={zone.label} />
          ))}
        </nav>
      </header>
      <main key={pathname + search} className="site-main anim-fade-in">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
}
