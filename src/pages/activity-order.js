import { navigateTo } from '../router.js';
import { storiesData } from '../data/stories.js';

// Helper para leer storyId de la URL
function getStoryId() {
  return new URLSearchParams(window.location.search).get('story') || 'conejito-lloron';
}

export function renderActivityOrder(container) {
  const storyId = getStoryId();
  const story = storiesData.find(s => s.id === storyId) || storiesData.find(s => s.id === 'conejito-lloron');
  const correctSequence = story.gameData.order.items;

  // Desordenar la secuencia para el juego
  const shuffled = [...correctSequence].sort(() => Math.random() - 0.5);

  function renderGame() {
    container.innerHTML = `
      <div class="game-layout anim-fade-in">
        <div class="game-top-nav">
          <button class="btn-game-nav btn-nav-back" id="exit-btn" title="Atrás" aria-label="Atrás">
            <img src="/assets/boton retroceder.png" alt="Atrás" class="btn-nav-arrow-img" />
            <span class="btn-nav-text">Atrás</span>
          </button>
          <button class="btn-game-nav btn-nav-next" id="next-game-btn" title="Siguiente Actividad" aria-label="Siguiente Actividad">
            <span class="btn-nav-text">Siguiente Actividad</span>
            <img src="/assets/juegos/flecha siguiente activdad.png" alt="Siguiente Actividad" class="btn-nav-arrow-img" />
          </button>
        </div>

        <div class="game-title-container">
          <img src="/assets/juegos/juegos elementos pag/cuenta cuentos.png" alt="Cuenta Cuentos" class="game-title-img" />
        </div>

        <p class="game-instructions">
          Arrastra las partes del cuento para colocarlas en el orden correcto, desde el inicio hasta el final.
        </p>

        <div class="game-container game-container-order">
          <ul class="order-list" id="sortable-list">
            ${shuffled.map((item, index) => `
              <li class="order-item" data-id="${item.id}">
                <div class="order-number">${index + 1}</div>
                <div class="order-text">${item.text}</div>
                <div class="order-handle">☰</div>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="game-footer-outside">
          <button class="btn-verify-img" id="verify-btn" title="Revisar resultado" aria-label="Revisar resultado">
            <img src="/assets/juegos/juegos elementos pag/BOTÓN REVISAR RESULTADO.png" alt="Revisar Resultado" class="btn-check-result-img" />
          </button>
        </div>
      </div>
    `;

    // Inicializar SortableJS
    const el = document.getElementById('sortable-list');

    let Sortable;
    import('https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/modular/sortable.esm.js')
      .then(module => {
        Sortable = module.default;
        new Sortable(el, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          onSort: updateNumbers
        });
      });

    // Eventos
    document.getElementById('exit-btn').addEventListener('click', goBack);
    document.getElementById('next-game-btn').addEventListener('click', goNext);
    document.getElementById('verify-btn').addEventListener('click', () => verifyOrder(el));
  }

  function goBack() {
    // Desde el primer juego, volver al cuento
    navigateTo(`/cuento/${storyId}`);
  }

  function goNext() {
    navigateTo(`/actividades/diferencias?story=${storyId}`);
  }

  function updateNumbers() {
    const items = container.querySelectorAll('.order-item');
    items.forEach((item, index) => {
      item.querySelector('.order-number').textContent = index + 1;
    });
  }

  function verifyOrder(listEl) {
    const currentOrder = Array.from(listEl.querySelectorAll('.order-item')).map(item => item.getAttribute('data-id'));
    const isCorrect = currentOrder.every((id, index) => id === correctSequence[index].id);

    if (isCorrect) {
      showWinScreen();
    } else {
      // Mostrar feedback visual de error
      const items = listEl.querySelectorAll('.order-item');
      items.forEach((item, index) => {
        const id = item.getAttribute('data-id');
        if (id === correctSequence[index].id) {
          item.style.borderColor = '#8B5E3C';
          item.style.background = '#a9e9a4';
        } else {
          item.style.borderColor = '#8B5E3C';
          item.style.background = '#ef9a9a';
        }
      });

      // Efecto temblor en el botón
      const btn = document.getElementById('verify-btn');
      btn.style.animation = 'wiggle 0.3s ease';
      setTimeout(() => {
        btn.style.animation = '';
      }, 300);
    }
  }

  function showWinScreen() {
    const gameContainer = container.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.style.position = 'relative';
      const overlay = document.createElement('div');
      overlay.className = 'activity-win-banner-overlay anim-fade-in';
      overlay.innerHTML = `
        <img src="/assets/juegos/juegos elementos pag/bien hecho (1).png" alt="Bien Hecho" class="win-banner-img" />
        <button class="win-next-arrow-btn" id="overlay-next-btn" title="Siguiente Actividad">
          <img src="/assets/juegos/flecha siguiente activdad.png" alt="Siguiente Actividad" />
        </button>
      `;
      gameContainer.appendChild(overlay);
      
      const nextBtn = document.getElementById('overlay-next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', goNext);
      }
    }
    launchConfetti();
  }

  function launchConfetti() {
    const titleContainer = container.querySelector('.game-title-container');
    if (titleContainer) titleContainer.style.position = 'relative';
    const targetEl = titleContainer || document.body;

    const colors = ['#F26671', '#F2BB4B', '#F28157', '#748A63', '#547398'];
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = (Math.random() * 80 + 10) + '%';
      particle.style.top = (Math.random() * 100) + '%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = Math.random() * 1.5 + 's';
      targetEl.appendChild(particle);
      setTimeout(() => { particle.remove(); }, 5000);
    }
  }

  renderGame();
}
