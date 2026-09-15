import { navigateTo } from '../router.js';
import { storiesData } from '../data/stories.js';

function getStoryId() {
  return new URLSearchParams(window.location.search).get('story') || 'conejito-lloron';
}

export function renderActivityDifferences(container) {
  const storyId = getStoryId();
  const story = storiesData.find(s => s.id === storyId) || storiesData.find(s => s.id === 'conejito-lloron');
  const differencesList = story.gameData.differences.items;
  let foundDifferences = [];
  
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
          <img src="/assets/juegos/juegos elementos pag/espejo roto.png" alt="Espejo Roto" class="game-title-img" />
        </div>

        <p class="game-instructions">
          Compara las dos imágenes y haz clic en las 5 diferencias que encuentres. 
          <span class="status-indicator" id="score-indicator" style="margin-left: 10px;">Encontradas: 0 / 5</span>
        </p>

        <div class="differences-two-frames">
          <!-- Primera madera cuadrada (Original) -->
          <div class="diff-wood-box">
            <div class="image-pane-wrapper" id="pane-left">
              <img class="image-pane" src="${story.gameData.differences.imageNormal}" alt="Imagen Original" onerror="this.src='https://placehold.co/400x550/f2bb4b/3d2b1f?text=Original'">
              <div class="diff-overlay" id="overlay-left"></div>
            </div>
          </div>
          
          <!-- Segunda madera cuadrada (Con Cambios) -->
          <div class="diff-wood-box">
            <div class="image-pane-wrapper" id="pane-right">
              <img class="image-pane" src="${story.gameData.differences.imageModified}" alt="Imagen Modificada" onerror="this.src='https://placehold.co/400x550/f2bb4b/3d2b1f?text=Modificada'">
              <div class="diff-overlay" id="overlay-right"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    setupInteraction();

    document.getElementById('exit-btn').addEventListener('click', goBack);
    document.getElementById('next-game-btn').addEventListener('click', goNext);
  }

  function goBack() {
    navigateTo(`/actividades/ordenar?story=${storyId}`);
  }

  function goNext() {
    navigateTo(`/actividades/zanahorias?story=${storyId}`);
  }

  function setupInteraction() {
    const paneLeft = document.getElementById('pane-left');
    const paneRight = document.getElementById('pane-right');
    const overlayLeft = document.getElementById('overlay-left');
    const overlayRight = document.getElementById('overlay-right');

    const handleInteraction = (e, paneElement) => {
      const rect = paneElement.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      
      const hit = differencesList.find(diff => {
        const dist = Math.sqrt(Math.pow(xPercent - diff.x, 2) + Math.pow(yPercent - diff.y, 2));
        return dist <= diff.radius && !foundDifferences.includes(diff.id);
      });

      if (hit) {
        foundDifferences.push(hit.id);
        markDifference(hit, overlayLeft);
        markDifference(hit, overlayRight);
        updateScore();
      } else {
        paneElement.style.borderColor = 'var(--color-primary)';
        setTimeout(() => {
          paneElement.style.borderColor = '#8B5E3C';
        }, 300);
      }
    };

    paneLeft.addEventListener('click', (e) => handleInteraction(e, paneLeft));
    paneRight.addEventListener('click', (e) => handleInteraction(e, paneRight));
    
    differencesList.forEach(diff => {
      // Hints sutiles solo en hover
      const elementLeft = document.createElement('div');
      elementLeft.className = `diff-target diff-item-${diff.id}`;
      elementLeft.style.left = `${diff.x}%`;
      elementLeft.style.top = `${diff.y}%`;
      elementLeft.style.width = `${diff.radius * 2}%`;
      elementLeft.style.height = `${diff.radius * 2}%`;
      overlayLeft.appendChild(elementLeft);

      const elementRight = document.createElement('div');
      elementRight.className = `diff-target diff-item-${diff.id}`;
      elementRight.style.left = `${diff.x}%`;
      elementRight.style.top = `${diff.y}%`;
      elementRight.style.width = `${diff.radius * 2}%`;
      elementRight.style.height = `${diff.radius * 2}%`;
      overlayRight.appendChild(elementRight);
    });
  }

  function markDifference(diff, overlay) {
    const marker = document.createElement('div');
    marker.className = 'diff-marker';
    marker.style.left = `${diff.x}%`;
    marker.style.top = `${diff.y}%`;
    overlay.appendChild(marker);
    
    const target = overlay.querySelector(`.diff-item-${diff.id}`);
    if (target) target.style.display = 'none';
  }

  function updateScore() {
    const scoreInd = document.getElementById('score-indicator');
    if (scoreInd) {
      scoreInd.textContent = `Encontradas: ${foundDifferences.length} / 5`;
    }
    if (foundDifferences.length === differencesList.length) {
      setTimeout(showWinScreen, 600);
    }
  }

  function showWinScreen() {
    const gameLayout = container.querySelector('.game-layout');
    if (gameLayout) {
      gameLayout.style.position = 'relative';
      const overlay = document.createElement('div');
      overlay.className = 'activity-win-banner-overlay anim-fade-in';
      overlay.innerHTML = `
        <img src="/assets/juegos/juegos elementos pag/bien hecho (1).png" alt="Bien Hecho" class="win-banner-img" />
        <button class="win-next-arrow-btn" id="overlay-next-btn" title="Siguiente Actividad">
          <img src="/assets/juegos/flecha siguiente activdad.png" alt="Siguiente Actividad" />
        </button>
      `;
      gameLayout.appendChild(overlay);
      
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
