import { navigateTo } from '../router.js';

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;
  
  container.innerHTML = `
    <header class="header-main">
      <div class="logo-area" data-link href="/">
        <div class="logo-title">LA MUELA DEL DIABLO</div>
        <div class="logo-subtitle">y otros cuentos 🐰</div>
      </div>
      <nav class="nav-bar">
        <a href="/cuentos" class="nav-tab anim-bounce-hover" data-link>
          <span class="nav-icon">📚</span>
          <span class="nav-text">Cuentos</span>
        </a>
        <a href="/actividades" class="nav-tab anim-bounce-hover" data-link>
          <span class="nav-icon">🎈</span>
          <span class="nav-text">Actividades</span>
        </a>
        <a href="/chat" class="nav-tab anim-bounce-hover" data-link>
          <span class="nav-icon">💬</span>
          <span class="nav-text">Chats</span>
        </a>
      </nav>
    </header>
  `;
}
