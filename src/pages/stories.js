import { storiesData } from '../data/stories.js';
import { navigateTo } from '../router.js';

export function renderStories(container) {
  const storiesHtml = storiesData.map(story => `
    <div class="story-card" data-route="/cuento/${story.id}" title="${story.title}">
      <div class="story-pergamino-container">
        <img class="story-pergamino-img" src="${story.pergaminoImage}" alt="${story.title}" />
      </div>
      <div class="story-cover-container">
        <img class="story-cover-img" src="${story.coverImage}" alt="Portada ${story.title}" />
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="stories-page-container anim-fade-in">
      <div class="stories-header-papiro">
        <img src="/assets/Papiros nombres/Slección cuentos.png" alt="¡Elige Tu Aventura!" class="stories-title-papiro" />
      </div>
      <div class="stories-grid">
        ${storiesHtml}
      </div>
    </div>
  `;

  // Añadir eventos a las tarjetas de cuentos
  container.querySelectorAll('.story-card').forEach(element => {
    element.addEventListener('click', e => {
      e.preventDefault();
      const route = element.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      }
    });
  });
}

