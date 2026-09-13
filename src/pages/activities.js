import { navigateTo } from '../router.js';

export function renderActivities(container) {
  container.innerHTML = `
    <div class="activities-page-container anim-fade-in">
      <div class="page-title-box">
        <h2 class="page-title">🎈 Zona de Juegos</h2>
        <p class="page-subtitle">Demuestra cuánto sabes del cuento del Conejito Llorón</p>
      </div>
      
      <div class="activities-grid">
        <div class="activity-card card-order anim-bounce-hover" data-target="/actividades/ordenar">
          <div class="activity-icon-wrapper">
            <span class="activity-icon">🧩</span>
          </div>
          <div class="activity-info">
            <h3 class="activity-title">1. Ordenar la Historia</h3>
            <p class="activity-desc">Arrastra y ordena las escenas del cuento en el orden correcto en que sucedieron.</p>
            <button class="btn-primary activity-btn">Jugar Ahora</button>
          </div>
        </div>

        <div class="activity-card card-differences anim-bounce-hover" data-target="/actividades/diferencias">
          <div class="activity-icon-wrapper">
            <span class="activity-icon">🔍</span>
          </div>
          <div class="activity-info">
            <h3 class="activity-title">2. Encuentra Diferencias</h3>
            <p class="activity-desc">Mira con mucha atención las dos imágenes y haz clic en las cosas que son distintas.</p>
            <button class="btn-nature activity-btn">Jugar Ahora</button>
          </div>
        </div>

        <div class="activity-card card-find anim-bounce-hover" data-target="/actividades/zanahorias">
          <div class="activity-icon-wrapper">
            <span class="activity-icon">🥕</span>
          </div>
          <div class="activity-info">
            <h3 class="activity-title">3. Encuentra las Zanahorias</h3>
            <p class="activity-desc">¡Ayuda al conejito! Busca y haz clic en todas las zanahorias escondidas en el bosque.</p>
            <button class="btn-secondary activity-btn">Jugar Ahora</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Evento para navegar a cada actividad al hacer click en la tarjeta o botón
  container.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      navigateTo(target);
    });
  });
}
