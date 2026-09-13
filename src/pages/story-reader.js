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
  let currentPage = 1;    // 1..story.pageCount
  let isFlipping = false; // Evita múltiples clics durante la animación

  // Rutas de recursos
  const folderPath = `/assets/cuentos/${encodeURI(story.folder)}`;
  const bookBaseImgSrc = story.openBookImage || `${folderPath}/libro abierto.png`;

  function getPageImgSrc(pageNum) {
    return `${folderPath}/pagina-${pageNum}.webp`;
  }

  // Precargar imágenes de páginas adyacentes
  function preloadImages(pageNum) {
    if (pageNum < story.pageCount) {
      const nextImg = new Image();
      nextImg.src = getPageImgSrc(pageNum + 1);
    }
    if (pageNum > 1) {
      const prevImg = new Image();
      prevImg.src = getPageImgSrc(pageNum - 1);
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
      currentPage = 1;
      preloadImages(currentPage);
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
          <button class="wood-arrow wood-arrow-prev" id="btn-prev-page" ${currentPage === 1 ? 'disabled' : ''} aria-label="Página anterior">
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
                     src="${getPageImgSrc(currentPage)}" 
                     alt="Página ${currentPage} izquierda" 
                     class="page-img-left"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="page-fallback" id="static-left-fallback" style="display: none;">
                  <span class="fallback-badge">${story.title}</span>
                  <div class="fallback-text">Plana Izquierda</div>
                </div>
              </div>

              <!-- Plana Derecha -->
              <div class="page-half page-half-right" id="static-right-half">
                <img id="static-right-img"
                     src="${getPageImgSrc(currentPage)}" 
                     alt="Página ${currentPage} derecha" 
                     class="page-img-right"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="page-fallback" id="static-right-fallback" style="display: none;">
                  <span class="fallback-badge">${story.title}</span>
                  <div class="fallback-text">Plana Derecha</div>
                </div>
              </div>

            </div>

          </div>

          <!-- Flecha Derecha -->
          <button class="wood-arrow wood-arrow-next" id="btn-next-page" ${currentPage === story.pageCount ? 'disabled' : ''} aria-label="Página siguiente">
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
      if (currentPage > 1 && !isFlipping) {
        flipPage('backward');
      }
    });

    btnNext.addEventListener('click', () => {
      if (currentPage < story.pageCount && !isFlipping) {
        flipPage('forward');
      }
    });
  }

  // Helper para actualizar contenido de una mitad estática sin parpadeo
  function setHalfContent(side, pageNum) {
    const imgEl = document.getElementById(`static-${side}-img`);
    const fallbackEl = document.getElementById(`static-${side}-fallback`);
    if (imgEl && fallbackEl) {
      imgEl.src = getPageImgSrc(pageNum);
      imgEl.alt = `Página ${pageNum} ${side === 'left' ? 'izquierda' : 'derecha'}`;
      imgEl.style.display = '';
      fallbackEl.style.display = 'none';
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
      if (direction === 'forward') currentPage++;
      else currentPage--;
      isFlipping = false;
      render();
      return;
    }

    const targetPage = direction === 'forward' ? currentPage + 1 : currentPage - 1;
    const currentImgSrc = getPageImgSrc(currentPage);
    const targetImgSrc = getPageImgSrc(targetPage);

    // 1. Preparar las capas estáticas inferiores DEBAJO de la hoja que gira
    if (direction === 'forward') {
      // Al avanzar (1 -> 2):
      // - La mitad izquierda estática mantiene página 1 (cubierta luego por la hoja)
      // - La mitad derecha estática cambia Inmediatamente a la página 2
      //   (está tapada por el frente de la hoja que muestra página 1 derecha, así que el cambio es invisible)
      setHalfContent('right', targetPage);
    } else {
      // Al retroceder (2 -> 1):
      // - La mitad derecha estática mantiene página 2
      // - La mitad izquierda estática cambia Inmediatamente a la página 1
      setHalfContent('left', targetPage);
    }

    // 2. Crear la hoja 3D que se voltea
    const leaf = document.createElement('div');
    leaf.className = `page-leaf ${direction === 'forward' ? 'page-leaf-forward' : 'page-leaf-backward'}`;

    if (direction === 'forward') {
      leaf.innerHTML = `
        <!-- Cara frontal (mitad derecha de página actual) -->
        <div class="leaf-face leaf-front page-half-right">
          <img src="${currentImgSrc}" class="page-img-right" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="display: none;">
            <span class="fallback-badge">${story.title}</span>
            <div class="fallback-text">Plana Derecha</div>
          </div>
        </div>
        <!-- Cara posterior (mitad izquierda de página siguiente) -->
        <div class="leaf-face leaf-back page-half-left">
          <img src="${targetImgSrc}" class="page-img-left" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="display: none;">
            <span class="fallback-badge">${story.title}</span>
            <div class="fallback-text">Plana Izquierda</div>
          </div>
        </div>
      `;
    } else {
      leaf.innerHTML = `
        <!-- Cara frontal (mitad izquierda de página actual) -->
        <div class="leaf-face leaf-front page-half-left">
          <img src="${currentImgSrc}" class="page-img-left" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="display: none;">
            <span class="fallback-badge">${story.title}</span>
            <div class="fallback-text">Plana Izquierda</div>
          </div>
        </div>
        <!-- Cara posterior (mitad derecha de página anterior) -->
        <div class="leaf-face leaf-back page-half-right">
          <img src="${targetImgSrc}" class="page-img-right" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="page-fallback" style="display: none;">
            <span class="fallback-badge">${story.title}</span>
            <div class="fallback-text">Plana Derecha</div>
          </div>
        </div>
      `;
    }

    pagesArea.appendChild(leaf);

    // 3. Al completar la animación (~580ms):
    setTimeout(() => {
      currentPage = targetPage;

      // Actualizar la otra mitad estática para que coincida con la nueva página
      if (direction === 'forward') {
        setHalfContent('left', currentPage);
      } else {
        setHalfContent('right', currentPage);
      }

      // Remover la hoja que se volteó
      leaf.remove();

      // Actualizar estado de las flechas
      if (btnPrev) btnPrev.disabled = (currentPage === 1);
      if (btnNext) btnNext.disabled = (currentPage === story.pageCount);

      preloadImages(currentPage);
      isFlipping = false;
    }, 580);
  }

  // Inicializar vista
  render();
}
