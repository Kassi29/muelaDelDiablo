import { navigateTo } from '../router.js';

export function renderHome(container) {
  container.innerHTML = `
    <div id="home-page">

      <!-- ③ SELECCIÓN CUENTOS: Mapa con íconos interactivos -->
      <section id="seccion-cuentos" class="home-section home-section-cuentos">
        <div class="section-title-papiro">
          <img src="/assets/Papiros nombres/Slección cuentos.png" alt="¡Elige Tu Aventura!" class="papiro-titulo" />
        </div>
        <div class="mapa-wrapper">
          <img src="/assets/mapa-cuentos.png" alt="Mapa de selección de cuentos" class="mapa-bg" />

          <!-- 1. LA MUELA DEL DIABLO — Esquina izquierda superior -->
          <button class="mapa-icon mapa-muela" data-route="/cuento/la-muela" title="La Muela del Diablo">
            <img src="/assets/mapa/sb-muela.svg" class="icon-normal" alt="La Muela del Diablo" />
            <img src="/assets/mapa/cb-muela.svg" class="icon-hover" alt="La Muela del Diablo (brillo)" />
          </button>

          <!-- 2. LA NIÑA Y EL ESPEJO (CASTILLO) — Esquina derecha superior (un poco más abajo) -->
          <button class="mapa-icon mapa-castillo" data-route="/cuento/la-nina" title="La Niña y el Espejo">
            <img src="/assets/mapa/sb-castillo.svg" class="icon-normal" alt="La Niña y el Espejo" />
            <img src="/assets/mapa/cb-castillo.svg" class="icon-hover" alt="La Niña y el Espejo (brillo)" />
          </button>

          <!-- 3. EL CONEJITO LLORÓN (BOSQUE) — Centro del mapa (abajo de Muela y Castillo) -->
          <button class="mapa-icon mapa-bosque" data-route="/cuento/conejito-lloron" title="El Conejito Llorón">
            <img src="/assets/mapa/sb-bosque.svg" class="icon-normal" alt="El Conejito Llorón" />
            <img src="/assets/mapa/cb-bosque.svg" class="icon-hover" alt="El Conejito Llorón (brillo)" />
          </button>

          <!-- 4. LOS QUIRQUINCHOS DE LAS DUNAS DE SAN PEDRO — Abajo del bosque a la izquierda -->
          <button class="mapa-icon mapa-quirquinchos" data-route="/cuento/quirquinchos" title="Los Quirquinchos de las Dunas de San Pedro">
            <img src="/assets/mapa/sb-quirquinchos.svg" class="icon-normal" alt="Los Quirquinchos" />
            <img src="/assets/mapa/cb-quirquinchos.svg" class="icon-hover" alt="Los Quirquinchos (brillo)" />
          </button>

          <!-- 5. LA TRISTE HISTORIA DE LAS TORTUGUITAS (FUENTE) — A la derecha al final -->
          <button class="mapa-icon mapa-fuente" data-route="/cuento/tortugas" title="La Triste Historia de las Tortuguitas que Quisieron Llegar a la Luna">
            <img src="/assets/mapa/sb-fuente.svg" class="icon-normal" alt="Las Tortuguitas" />
            <img src="/assets/mapa/cb-fuente.svg" class="icon-hover" alt="Las Tortuguitas (brillo)" />
          </button>
        </div>
      </section>

      <!-- ④ SELECCIÓN JUEGOS: Fondo circular con cartas esparcidas en el piso -->
      <section id="seccion-juegos" class="home-section home-section-juegos">
        <div class="section-title-papiro">
          <img src="/assets/Papiros nombres/Slección juegos.png" alt="¡Diviértete Jugando!" class="papiro-titulo" />
        </div>
        <div class="juegos-wrapper">
          <img src="/assets/juegos-fondo.png" alt="Selección de Juegos" class="juegos-bg" />

          <!-- Cartas esparcidas como en el piso, llevan al juego Cuentacuentos (ordenar cuento) -->

          <!-- 1. La Muela del Diablo — Arriba a la izquierda (-10deg) -->
          <button class="juego-card juego-muela" data-route="/actividades/ordenar?story=la-muela" title="Cuenta Cuentos: La Muela del Diablo">
            <img src="/assets/juegos/la-muela.svg" alt="Carta La Muela del Diablo" />
          </button>

          <!-- 2. La Niña y el Espejo — Arriba a la derecha (+8deg) -->
          <button class="juego-card juego-nina" data-route="/actividades/ordenar?story=la-nina" title="Cuenta Cuentos: La Niña y el Espejo">
            <img src="/assets/juegos/la-nina.svg" alt="Carta La Niña y el Espejo" />
          </button>

          <!-- 3. El Conejito Llorón — Centro (-4deg) -->
          <button class="juego-card juego-conejito" data-route="/actividades/ordenar?story=conejito-lloron" title="Cuenta Cuentos: El Conejito Llorón">
            <img src="/assets/juegos/conejito.svg" alt="Carta El Conejito Llorón" />
          </button>

          <!-- 4. Los Quirquinchos — Abajo a la izquierda (+7deg) -->
          <button class="juego-card juego-quirquinchos" data-route="/actividades/ordenar?story=quirquinchos" title="Cuenta Cuentos: Los Quirquinchos">
            <img src="/assets/juegos/quirquincho.svg" alt="Carta Los Quirquinchos" />
          </button>

          <!-- 5. Las Tortuguitas — Abajo a la derecha (-6deg) -->
          <button class="juego-card juego-tortugas" data-route="/actividades/ordenar?story=tortugas" title="Cuenta Cuentos: Las Tortuguitas">
            <img src="/assets/juegos/tortugas.svg" alt="Carta Las Tortuguitas" />
          </button>
        </div>
      </section>

      <!-- ⑤ ENTRAR CHATS: Cartel de notificación estilo botón -->
      <section id="seccion-chats" class="home-section home-section-chats">
        <button class="chats-btn" id="chats-btn" title="Entrar a los Chats">
          <img src="/assets/cartel-chats.png" alt="¡Tienes 5 chats sin leer! Haz clic para chatear" />
        </button>
      </section>

    </div>
  `;

  // Listener para los íconos del mapa -> cuentos
  container.querySelectorAll('.mapa-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(btn.dataset.route);
    });
  });

  // Listener para las cartas de juegos -> actividad ordenar cuento
  container.querySelectorAll('.juego-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(btn.dataset.route);
    });
  });

  // Listener para el cartel de chats -> chat
  document.getElementById('chats-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/chat');
  });
}
