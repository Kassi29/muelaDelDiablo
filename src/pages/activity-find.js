import { navigateTo } from '../router.js';
import { storiesData } from '../data/stories.js';
import { saveMetric, formatTime } from '../lib/metrics.js';

function getStoryId() {
  return new URLSearchParams(window.location.search).get('story') || 'conejito-lloron';
}

export function renderActivityFind(container) {
  const storyId = getStoryId();
  const story = storiesData.find(s => s.id === storyId) || storiesData.find(s => s.id === 'conejito-lloron');
  const findData = story.gameData.find;
  const items = findData.items;
  let foundItems = [];

  // Variables de métricas
  const startTime = Date.now();
  let timerInterval = null;
  let wrongClicks = 0;
  let isGameFinished = false;

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    const timerEl = container.querySelector('#game-timer');
    timerInterval = setInterval(() => {
      if (!isGameFinished && timerEl) {
        const elapsed = (Date.now() - startTime) / 1000;
        timerEl.textContent = `⏱ ${formatTime(elapsed)}`;
      }
    }, 1000);
  }

  function renderGame() {
    container.innerHTML = `
      <div class="game-layout anim-fade-in">
        <div class="game-top-nav">
          <button class="btn-game-nav btn-nav-back" id="exit-btn" title="Atrás" aria-label="Atrás">
            <img src="/assets/boton retroceder.png" alt="Atrás" class="btn-nav-arrow-img" />
            <span class="btn-nav-text">Atrás</span>
          </button>
          <div class="game-timer-badge" id="game-timer" title="Tiempo transcurrido">⏱ 00:00</div>
          <button class="btn-game-nav btn-nav-next" id="next-game-btn" title="Ir a los Chats" aria-label="Ir a los Chats">
            <span class="btn-nav-text">Ir a los Chats</span>
            <img src="/assets/juegos/flecha siguiente activdad.png" alt="Ir a los Chats" class="btn-nav-arrow-img" />
          </button>
        </div>

        <div class="game-title-container">
          <img src="/assets/juegos/juegos elementos pag/la b'usqueda m'agica.png" alt="La Búsqueda Mágica" class="game-title-img" />
        </div>

        <p class="game-instructions">
          Busca y haz clic en los 5 ${findData.label} escondidos en la imagen.
          <span class="status-indicator" id="score-indicator" style="margin-left: 10px;">${findData.label}: 0 / 5</span>
        </p>

        <div class="game-container game-container-find">
          <div class="find-game-view">
            <div class="search-board" id="board">
              <img class="search-image" src="${findData.searchImage}" alt="Imagen de búsqueda" onerror="this.src='https://placehold.co/600x450/748a63/fff8e7?text=Busca+los+${encodeURIComponent(findData.label)}'">
              <div id="items-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    startTimer();
    setupItems();

    document.getElementById('exit-btn').addEventListener('click', goBack);
    document.getElementById('next-game-btn').addEventListener('click', goNext);
  }

  function goBack() {
    stopTimer();
    navigateTo(`/actividades/diferencias?story=${storyId}`);
  }

  function goNext() {
    stopTimer();
    navigateTo(`/chat`);
  }

  function setupItems() {
    const board = document.getElementById('board');
    const overlay = document.getElementById('items-overlay');

    // Detectar clics erróneos en el tablero
    if (board) {
      board.addEventListener('click', (e) => {
        if (isGameFinished) return;
        // Si el clic no fue directamente en un objeto escondido sin encontrar
        if (!e.target.classList.contains('hidden-carrot')) {
          wrongClicks++;
          board.style.borderColor = 'var(--color-primary)';
          setTimeout(() => {
            board.style.borderColor = '#8B5E3C';
          }, 300);
        }
      });
    }
    
    items.forEach(coord => {
      const item = document.createElement('span');
      item.className = 'hidden-carrot';
      item.id = coord.id;
      item.textContent = findData.emoji;
      
      item.style.left = `${coord.x}%`;
      item.style.top = `${coord.y}%`;
      item.style.fontSize = `${coord.size}px`;
      
      const rot = Math.random() * 360;
      item.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      item.style.opacity = '0.28';
      
      item.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que cuente como clic erróneo en el board
        if (isGameFinished) return;
        if (!foundItems.includes(coord.id)) {
          foundItems.push(coord.id);
          item.classList.add('found');
          item.style.opacity = '1';
          item.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1.4)`;
          updateScore();
        }
      });
      
      overlay.appendChild(item);
    });
  }

  function updateScore() {
    const scoreInd = document.getElementById('score-indicator');
    if (scoreInd) {
      scoreInd.textContent = `${findData.label}: ${foundItems.length} / 5`;
    }
    if (foundItems.length === items.length) {
      isGameFinished = true;
      stopTimer();
      const elapsedSeconds = (Date.now() - startTime) / 1000;

      // Guardar métrica automáticamente
      saveMetric({
        gameType: 'find',
        storyId: story.id,
        storyTitle: story.title,
        attempts: 1,
        timeSeconds: elapsedSeconds,
        errorsCount: wrongClicks
      });

      setTimeout(() => showWinScreen(elapsedSeconds, wrongClicks), 800);
    }
  }

  function showWinScreen(elapsedSeconds, finalErrors) {
    const gameContainer = container.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.style.position = 'relative';
      const overlay = document.createElement('div');
      overlay.className = 'activity-win-banner-overlay anim-fade-in';
      overlay.innerHTML = `
        <img src="/assets/juegos/juegos elementos pag/bien hecho (1).png" alt="Bien Hecho" class="win-banner-img" />
        <div class="activity-win-stats-box">
          <span class="win-stat-chip">⏱️ ${formatTime(elapsedSeconds)}</span>
          <span class="win-stat-chip">❌ ${finalErrors} ${finalErrors === 1 ? 'error' : 'errores'}</span>
        </div>
        <div class="win-actions-row">
          <button class="win-next-arrow-btn" id="overlay-next-btn" title="Ir a los Chats">
            <img src="/assets/juegos/flecha siguiente activdad.png" alt="Ir a los Chats" />
          </button>
        </div>
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
