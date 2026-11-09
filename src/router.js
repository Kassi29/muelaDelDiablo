// Router SPA simple
import { renderHome } from './pages/home.js';
import { renderStories } from './pages/stories.js';
import { renderStoryReader } from './pages/story-reader.js';
import { renderActivities } from './pages/activities.js';
import { renderActivityOrder } from './pages/activity-order.js';
import { renderActivityDifferences } from './pages/activity-differences.js';
import { renderActivityFind } from './pages/activity-find.js';
import { renderChat } from './pages/chat.js';
import { renderDashboard } from './pages/dashboard.js';

const routes = {
  '/': renderHome,
  '/cuentos': renderStories,
  '/actividades': renderActivities,
  '/actividades/ordenar': renderActivityOrder,
  '/actividades/diferencias': renderActivityDifferences,
  '/actividades/zanahorias': renderActivityFind,
  '/chat': renderChat,
  '/metricas': renderDashboard
};

export function initRouter() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Header global persistente: Banner + Navbar -->
    <div id="global-header">
      <header class="home-header">
        <a href="/" data-link class="banner-link" aria-label="Ir a inicio">
          <img
            src="/assets/banner-pagina-final.png"
            alt="La Muela del Diablo y otros cuentos"
            class="banner-img"
          />
        </a>
      </header>
      <nav class="home-navbar">
        <div class="navbar-wrapper">
          <img src="/assets/navbar.png" alt="Navegación: CUENTOS | JUEGOS | CHATS" class="navbar-img" />
          <a href="#seccion-cuentos" class="nav-zone nav-zone-cuentos" aria-label="Cuentos"></a>
          <a href="#seccion-juegos" class="nav-zone nav-zone-juegos" aria-label="Juegos"></a>
          <a href="#seccion-chats" class="nav-zone nav-zone-chats" aria-label="Chats"></a>
        </div>
      </nav>
    </div>
    <main id="router-view" class="anim-fade-in"></main>
  `;

  // Escuchar navegación por botones/enlaces y hash
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('hashchange', handleRoute);

  // Atajo de teclado para administrador (Alt + M) para abrir métricas directamente
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'm' || e.key === 'M')) {
      e.preventDefault();
      navigateTo('/metricas');
    }
  });

  // Interceptar clicks en links con [data-link]
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
      e.preventDefault();
      const target = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
      navigateTo(target.getAttribute('href'));
    }
  });

  // Listener para las zonas del navbar global -> scroll a secciones o navegar a home
  document.querySelectorAll('#global-header .nav-zone').forEach(zone => {
    zone.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = zone.getAttribute('href').replace('#', '');
      const currentPath = window.location.pathname;

      if (currentPath === '/') {
        // Estamos en home, hacer scroll a la sección
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Estamos en otra página, navegar a home y luego scroll
        navigateTo('/');
        // Esperar a que el DOM se renderice
        setTimeout(() => {
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  });

  handleRoute();
}

export function navigateTo(url) {
  history.pushState(null, null, url);
  handleRoute();
}

function handleRoute() {
  let rawPath = window.location.pathname;

  // Soporte para hash routing (ej. #/metricas o #metricas)
  if (window.location.hash) {
    const cleanHash = window.location.hash.replace(/^#\/?/, '/');
    if (cleanHash && cleanHash !== '/') {
      rawPath = cleanHash;
    }
  }

  // Normalizar ruta: minúsculas, sin trailing slash y sin query params
  const cleanPath = (rawPath.toLowerCase().replace(/\/+$/, '') || '/').split('?')[0];
  const routerView = document.getElementById('router-view');
  if (!routerView) return;

  // Limpiar vista y aplicar animación de transición
  routerView.classList.remove('anim-fade-in');
  void routerView.offsetWidth; // Trigger reflow
  routerView.classList.add('anim-fade-in');

  // Renderizar según ruta (Soporte dinámico para /cuento/:id)
  routerView.innerHTML = '';

  const cuentoMatch = cleanPath.match(/^\/cuento\/(.+)$/);
  if (cuentoMatch) {
    renderStoryReader(routerView, cuentoMatch[1]);
  } else if (cleanPath === '/lector') {
    renderStoryReader(routerView);
  } else {
    const renderer = routes[cleanPath] || renderHome;
    renderer(routerView);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
