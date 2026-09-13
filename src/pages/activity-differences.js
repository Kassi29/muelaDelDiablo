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
              <img class="image-pane" src="/images/covers/conejito-cover.svg" alt="Imagen Original" onerror="this.src='https://placehold.co/400x550/f2bb4b/3d2b1f?text=Original'">
              <div class="diff-overlay" id="overlay-left"></div>
            </div>
          </div>
          
          <!-- Segunda madera cuadrada (Con Cambios) -->
          <div class="diff-wood-box">
            <div class="image-pane-wrapper" id="pane-right">
              <img class="image-pane" src="/images/covers/conejito-cover.svg" alt="Imagen Modificada" onerror="this.src='https://placehold.co/400x550/f2bb4b/3d2b1f?text=Modificada'" style="filter: hue-rotate(10deg);">
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
      const element = document.createElement('div');
      element.className = `diff-target diff-item-${diff.id}`;
      element.style.left = `${diff.x}%`;
      element.style.top = `${diff.y}%`;
      element.style.width = '30px';
      element.style.height = '30px';
      element.style.borderRadius = '50%';
      element.style.border = '2px dashed rgba(242, 102, 113, 0.4)';
      element.style.backgroundColor = 'rgba(242, 209, 148, 0.2)';
      overlayRight.appendChild(element);
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
    container.innerHTML = `
      <div class="game-layout anim-fade-in">
        <div class="game-top-nav">
          <button class="btn-game-nav btn-nav-back" id="exit-win-btn" title="Atrás" aria-label="Atrás">
            <img src="/assets/boton retroceder.png" alt="Atrás" class="btn-nav-arrow-img" />
            <span class="btn-nav-text">Atrás</span>
          </button>
          <button class="btn-game-nav btn-nav-next" id="next-win-btn" title="Siguiente Actividad" aria-label="Siguiente Actividad">
            <span class="btn-nav-text">Siguiente Actividad</span>
            <img src="/assets/juegos/flecha siguiente activdad.png" alt="Siguiente Actividad" class="btn-nav-arrow-img" />
          </button>
        </div>

        <div class="game-title-container">
          <img src="/assets/juegos/juegos elementos pag/espejo roto.png" alt="Espejo Roto" class="game-title-img" />
        </div>
        <div class="game-container game-container-win game-container-win-large">
          <div class="win-overlay">
            <h2 class="win-title">¡Qué Buena Vista Tienes!</h2>
            <p class="win-text">Has encontrado las 5 diferencias. ¡Tu atención al detalle es asombrosa!</p>
          </div>
        </div>
      </div>
    `;

    launchConfetti();
    document.getElementById('exit-win-btn')?.addEventListener('click', goBack);
    document.getElementById('next-win-btn')?.addEventListener('click', goNext);
  }

  function launchConfetti() {
    const colors = ['#F26671', '#F2BB4B', '#F28157', '#748A63', '#547398'];
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.transform = `scale(${Math.random() * 0.6 + 0.6})`;
      document.body.appendChild(particle);
      setTimeout(() => { particle.remove(); }, 5000);
    }
  }

  renderGame();
}
