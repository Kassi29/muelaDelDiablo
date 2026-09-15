import { storiesData } from '../data/stories.js';
import { navigateTo } from '../router.js';

export function renderStoryReader(container, storyIdFromRoute) {
  // Obtener storyId ya sea de la ruta dinámica o de URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = storyIdFromRoute || urlParams.get('id') || 'la-muela';
  const story = storiesData.find(s => s.id === storyId);

  if (!story) {
    container.innerHTML = `
      <div class="reader-container anim-fade-in">
        <div class="cover-view">
          <h2 style="font-family: var(--font-title); color: var(--color-primary);">Cuento no encontrado</h2>
          <p>No pudimos encontrar el cuento solicitado.</p>
          <a href="/" class="btn-back-wood" data-link>
            <img src="/assets/boton retroceder.png" alt="" class="btn-back-arrow-img" />
            <span class="btn-back-text">Volver al Mapa</span>
          </a>
        </div>
      </div>
    `;
    return;
  }

  // Estado local del lector
  let viewMode = 'cover'; // 'cover' | 'book'
  let currentSpread = 1;
  const totalSpreads = Math.ceil((story.pageCount + 1) / 2);
  let isFlipping = false; // Evita múltiples clics durante la animación

  // Rutas de recursos
  const folderPath = `/assets/cuentos/${encodeURI(story.folder)}`;
  const bookBaseImgSrc = story.openBookImage || `${folderPath}/libro abierto.png`;

  function getLeftPageNum(spread) {
    if (spread === 1) return null; // Primer spread tiene plana izquierda en blanco
    const pageNum = (spread - 1) * 2;
    return pageNum <= story.pageCount ? pageNum : null;
  }

  function getRightPageNum(spread) {
    const pageNum = spread === 1 ? 1 : (spread - 1) * 2 + 1;
    return pageNum <= story.pageCount ? pageNum : null;
  }

  function getPageImgSrc(pageNum) {
    if (!pageNum) return '';
    return `${folderPath}/${pageNum}.png`;
  }

  // Precargar imágenes de páginas adyacentes
  function preloadImages(spread) {
    if (spread < totalSpreads) {
      const nextLeft = getLeftPageNum(spread + 1);
      const nextRight = getRightPageNum(spread + 1);
      if (nextLeft) { const img = new Image(); img.src = getPageImgSrc(nextLeft); }
      if (nextRight) { const img = new Image(); img.src = getPageImgSrc(nextRight); }
    }
    if (spread > 1) {
      const prevLeft = getLeftPageNum(spread - 1);
      const prevRight = getRightPageNum(spread - 1);
      if (prevLeft) { const img = new Image(); img.src = getPageImgSrc(prevLeft); }
      if (prevRight) { const img = new Image(); img.src = getPageImgSrc(prevRight); }
    }
  }

  function render() {
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'reader-container anim-fade-in';

    if (viewMode === 'cover') {
      renderCoverView(wrapper);
    } else {
      renderBookView(wrapper);
    }

    container.appendChild(wrapper);
  }

  // ---------------------------------------------------------------------------
  // 1. Renderizar Vista de Portada
  // ---------------------------------------------------------------------------
  function renderCoverView(wrapper) {
    wrapper.innerHTML = `
      <div class="cover-view">
        <div class="cover-header-nav">
          <button class="btn-back-wood" id="btn-back-home">
            <img src="/assets/boton retroceder.png" alt="" class="btn-back-arrow-img" />
            <span class="btn-back-text">Volver al Mapa</span>
          </button>
        </div>

        <div class="story-reader-cover-box">
          <div class="story-pergamino-container">
            <img class="story-pergamino-img" src="${story.pergaminoImage}" alt="${story.title}" />
          </div>
          <div class="story-cover-container">
            <img class="story-cover-img" src="${story.coverImage}" alt="Portada ${story.title}" />
          </div>
        </div>

        <button class="btn-start-wood" id="btn-start-reading" aria-label="Empezar Lectura">
          <img src="/assets/cuentos/Elementos p[agina cuentos/BOTÓN EMPEZAR LECTIRA.png" alt="Empezar Lectura" class="btn-start-img" />
        </button>
      </div>
    `;

    wrapper.querySelector('#btn-back-home').addEventListener('click', () => {
      navigateTo('/');
    });

    wrapper.querySelector('#btn-start-reading').addEventListener('click', () => {
      viewMode = 'book';
      currentSpread = 1;
      preloadImages(currentSpread);
      render();
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Renderizar Vista de Libro Abierto
  // ---------------------------------------------------------------------------
  function renderBookView(wrapper) {
    wrapper.innerHTML = `
      <div class="book-pages-view">
        
        <!-- Barra Superior: Solo botón Volver al Mapa (Sin numeración ni botón de actividad arriba) -->
        <div class="reader-top-bar">
          <button class="btn-back-wood" id="btn-back-home-book">
            <img src="/assets/boton retroceder.png" alt="" class="btn-back-arrow-img" />
            <span class="btn-back-text">Mapa</span>
          </button>
        </div>

        <!-- Escenario Principal del Libro y Flechas -->
        <div class="book-stage">
          
          <!-- Flecha Izquierda -->
          <button class="wood-arrow wood-arrow-prev" id="btn-prev-page" ${currentSpread === 1 ? 'disabled' : ''} aria-label="Página anterior">
            <img src="/assets/cuentos/Elementos p[agina cuentos/BOTÓN IZQ.png" alt="Página anterior" class="wood-arrow-img" />
          </button>

          <!-- El Marco del Libro (libro abierto.png + área de páginas) -->
          <div class="book-frame" id="book-frame">
            
            <!-- Imagen base que NUNCA se mueve -->
            <img src="${bookBaseImgSrc}" alt="Libro abierto" class="book-base-img" />

            <!-- Área de las planas de papel -->
            <div class="book-pages-area" id="book-pages-area">
              
              <!-- Plana Izquierda -->
              <div class="page-half page-half-left" id="static-left-half">
                <img id="static-left-img"
                     src="${getPageImgSrc(getLeftPageNum(currentSpread))}" 
                     alt="Página izquierda" 
                     class="page-img-left"
                     style="${!getLeftPageNum(currentSpread) ? 'display: none;' : ''}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="page-fallback" id="static-left-fallback" style="${getLeftPageNum(currentSpread) ? 'display: none;' : 'display: flex; background: transparent; border: none;'}">
                  ${!getLeftPageNum(currentSpread) ? '' : `<span class="fallback-badge">${story.title}</span><div class="fallback-text">Plana Izquierda</div>`}
                </div>
              </div>

              <!-- Plana Derecha -->
              <div class="page-half page-half-right" id="static-right-half">
                <img id="static-right-img"
                     src="${getPageImgSrc(getRightPageNum(currentSpread))}" 
                     alt="Página derecha" 
                     class="page-img-right"
                     style="${!getRightPageNum(currentSpread) ? 'display: none;' : ''}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="page-fallback" id="static-right-fallback" style="${getRightPageNum(currentSpread) ? 'display: none;' : 'display: flex; background: transparent; border: none;'}">
                  ${!getRightPageNum(currentSpread) ? '' : `<span class="fallback-badge">${story.title}</span><div class="fallback-text">Plana Derecha</div>`}
                </div>
              </div>

            </div>

          </div>

          <!-- Flecha Derecha -->
          <button class="wood-arrow wood-arrow-next" id="btn-next-page" ${currentSpread === totalSpreads ? 'disabled' : ''} aria-label="Página siguiente">
            <img src="/assets/cuentos/Elementos p[agina cuentos/BOTÓN DER.png" alt="Página siguiente" class="wood-arrow-img" />
          </button>

        </div>

      </div>
    `;

    // Event listeners
    wrapper.querySelector('#btn-back-home-book').addEventListener('click', () => {
      navigateTo('/');
    });

    const btnPrev = wrapper.querySelector('#btn-prev-page');
    const btnNext = wrapper.querySelector('#btn-next-page');

    btnPrev.addEventListener('click', () => {
      if (currentSpread > 1 && !isFlipping) {
        flipPage('backward');
      }
    });

    btnNext.addEventListener('click', () => {
      if (currentSpread < totalSpreads && !isFlipping) {
        flipPage('forward');
      }
    });
  }

  // Helper para actualizar contenido de una mitad estática sin parpadeo
  function setHalfContent(side, spread) {
    const imgEl = document.getElementById(`static-${side}-img`);
    const fallbackEl = document.getElementById(`static-${side}-fallback`);
    const pageNum = side === 'left' ? getLeftPageNum(spread) : getRightPageNum(spread);
    
    if (imgEl && fallbackEl) {
      if (pageNum) {
        imgEl.src = getPageImgSrc(pageNum);
        imgEl.alt = `Página ${pageNum} ${side === 'left' ? 'izquierda' : 'derecha'}`;
        imgEl.style.display = '';
        fallbackEl.style.display = 'none';
      } else {
        imgEl.style.display = 'none';
        fallbackEl.style.display = 'flex';
        fallbackEl.style.background = 'transparent';
        fallbackEl.style.border = 'none';
        fallbackEl.innerHTML = '';
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Animación 3D de Paso de Hoja SIN PARPADEO
  // ---------------------------------------------------------------------------
  function flipPage(direction) {
    isFlipping = true;
    const pagesArea = document.getElementById('book-pages-area');
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');

    if (!pagesArea) {
      if (direction === 'forward') currentSpread++;
      else currentSpread--;
      isFlipping = false;
      render();
      return;
    }

    const targetSpread = direction === 'forward' ? currentSpread + 1 : currentSpread - 1;
    const currentLeftPage = getLeftPageNum(currentSpread);
    const currentRightPage = getRightPageNum(currentSpread);
    const targetLeftPage = getLeftPageNum(targetSpread);
    const targetRightPage = getRightPageNum(targetSpread);

    // 1. Preparar las capas estáticas inferiores DEBAJO de la hoja que gira
    if (direction === 'forward') {
      setHalfContent('right', targetSpread);
    } else {
      setHalfContent('left', targetSpread);
    }

    // 2. Crear la hoja 3D que se voltea
    const leaf = document.createElement('div');
    leaf.className = `page-leaf ${direction === 'forward' ? 'page-leaf-forward' : 'page-leaf-backward'}`;

    if (direction === 'forward') {
      leaf.innerHTML = `
        <!-- Cara frontal (mitad derecha de página actual) -->
        <div class="leaf-face leaf-front page-half-right">
          <img src="${getPageImgSrc(currentRightPage)}" class="page-img-right" style="${!currentRightPage ? 'display:none;' : ''}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="${currentRightPage ? 'display:none;' : 'display:flex; background:transparent; border:none;'}"></div>
        </div>
        <!-- Cara posterior (mitad izquierda de página siguiente) -->
        <div class="leaf-face leaf-back page-half-left">
          <img src="${getPageImgSrc(targetLeftPage)}" class="page-img-left" style="${!targetLeftPage ? 'display:none;' : ''}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="${targetLeftPage ? 'display:none;' : 'display:flex; background:transparent; border:none;'}"></div>
        </div>
      `;
    } else {
      leaf.innerHTML = `
        <!-- Cara frontal (mitad izquierda de página actual) -->
        <div class="leaf-face leaf-front page-half-left">
          <img src="${getPageImgSrc(currentLeftPage)}" class="page-img-left" style="${!currentLeftPage ? 'display:none;' : ''}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="${currentLeftPage ? 'display:none;' : 'display:flex; background:transparent; border:none;'}"></div>
        </div>
        <!-- Cara posterior (mitad derecha de página anterior) -->
        <div class="leaf-face leaf-back page-half-right">
          <img src="${getPageImgSrc(targetRightPage)}" class="page-img-right" style="${!targetRightPage ? 'display:none;' : ''}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="${targetRightPage ? 'display:none;' : 'display:flex; background:transparent; border:none;'}"></div>
        </div>
      `;
    }

    pagesArea.appendChild(leaf);

    // 3. Al completar la animación (~580ms):
    setTimeout(() => {
      currentSpread = targetSpread;

      // Actualizar la otra mitad estática para que coincida con la nueva página
      if (direction === 'forward') {
        setHalfContent('left', currentSpread);
      } else {
        setHalfContent('right', currentSpread);
      }

      // Remover la hoja que se volteó
      leaf.remove();

      // Actualizar estado de las flechas
      if (btnPrev) btnPrev.disabled = (currentSpread === 1);
      if (btnNext) btnNext.disabled = (currentSpread === totalSpreads);

      preloadImages(currentSpread);
      isFlipping = false;
    }, 580);
  }

  // Inicializar vista
  render();
}
