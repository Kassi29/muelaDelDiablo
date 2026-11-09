const characters = [
  {
    id: 'la-muela',
    name: 'dinosaurio_67',
    avatar: '/assets/chats/fotos perfil/muela del diablo.png'
  },
  {
    id: 'la-nina',
    name: 'niñabonita',
    avatar: '/assets/chats/fotos perfil/la niña y el espejo.png'
  },
  {
    id: 'conejito-lloron',
    name: 'conejito_feliz',
    avatar: '/assets/chats/fotos perfil/conejito.png'
  },
  {
    id: 'quirquinchos',
    name: 'Papá Quirquincho',
    avatar: '/assets/chats/fotos perfil/quirquinchos.png'
  },
  {
    id: 'tortugas',
    name: 'Tortuga Veloz',
    avatar: '/assets/chats/fotos perfil/tortugas.png'
  }
];

export function renderChat(container) {
  let selectedCharacterId = null;
  const chatHistories = {};
  characters.forEach(c => {
    chatHistories[c.id] = [];
  });

  function getSelectedCharacter() {
    return characters.find(c => c.id === selectedCharacterId) || null;
  }

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const desktopLayouts = [
    { top: '23.0%', height: '12.8%' },
    { top: '36.1%', height: '13.0%' },
    { top: '49.4%', height: '12.7%' },
    { top: '62.4%', height: '12.6%' },
    { top: '75.4%', height: '13.6%' }
  ];

  // Renderizar los dos formatos completamente independientes: Escritorio (PC) y Celular (Móvil)
  container.innerHTML = `
    <div class="chat-page-wrapper anim-fade-in">

      <!-- ====================================================================
           FORMATO 1: VISTA DE ESCRITORIO (PC)
           ==================================================================== -->
      <div class="chat-desktop-view">
        <div class="chat-desktop-canvas" id="chat-desktop-canvas">
          
          <!-- Capas de fondo superpuestas y precargadas -->
          <div class="chat-desktop-bg-layer chat-desktop-bg-antes"></div>
          <div class="chat-desktop-bg-layer chat-desktop-bg-dentro"></div>

          <!-- Botón interactivo sobre el título CHATS para volver a lista -->
          <button class="chat-desktop-back-title-btn" id="chat-desktop-back-btn" title="Volver a lista de chats" aria-label="Volver a lista de chats"></button>

          <!-- 5 Ranuras de contactos en el panel izquierdo -->
          <div class="chat-desktop-slots">
            ${characters.map((c, index) => {
              const layout = desktopLayouts[index] || { top: `${23 + index * 13}%`, height: '13%' };
              return `
              <button class="chat-desktop-slot-btn"
                      data-character-id="${c.id}"
                      style="top: ${layout.top}; height: ${layout.height};"
                      title="${c.name}">
                <div class="chat-desktop-slot-avatar">
                  ${c.avatar ? `<img src="${c.avatar}" alt="${c.name}" />` : `
                    <svg class="chat-desktop-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="#815336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  `}
                </div>
                <span class="chat-desktop-slot-name">${c.name}</span>
              </button>
            `;
            }).join('')}
          </div>

          <!-- Panel derecho de chat activo en PC -->
          <div class="chat-desktop-right-panel" id="chat-desktop-right-panel" style="display: none;">
            <!-- Header personaje activo -->
            <div class="chat-desktop-right-header">
              <div class="chat-desktop-header-avatar" id="chat-desktop-header-avatar"></div>
              <div class="chat-desktop-header-text">
                <h3 class="chat-desktop-header-name" id="chat-desktop-header-name"></h3>
              </div>
            </div>

            <!-- Lista de mensajes -->
            <div class="chat-desktop-messages-area" id="chat-desktop-messages"></div>

            <!-- Indicador escribiendo -->
            <div class="chat-desktop-typing" id="chat-desktop-typing" style="display: none;">
              <span class="chat-desktop-typing-dot"></span>
              <span class="chat-desktop-typing-dot"></span>
              <span class="chat-desktop-typing-dot"></span>
            </div>

            <!-- Formulario inferior -->
            <form class="chat-desktop-input-form" id="chat-desktop-form">
              <input type="text"
                     class="chat-desktop-input-element"
                     id="chat-desktop-message-input"
                     placeholder="ESCRIBIR MENSAJE...."
                     required
                     autocomplete="off" />
              <button type="submit" class="chat-desktop-send-trigger" aria-label="Enviar mensaje"></button>
            </form>
          </div>

        </div>
      </div>

      <!-- ====================================================================
           FORMATO 2: VISTA DE CELULAR (MÓVIL)
           ==================================================================== -->
      <div class="chat-mobile-view">
        <div class="chat-mobile-canvas" id="chat-mobile-canvas">
          
          <!-- Capas de fondo en formato vertical precargadas -->
          <div class="chat-mobile-bg-layer chat-mobile-bg-antes"></div>
          <div class="chat-mobile-bg-layer chat-mobile-bg-dentro"></div>

          <!-- Botón interactivo sobre el título CHATS para deseleccionar -->
          <button class="chat-mobile-title-btn" id="chat-mobile-title-btn" title="Volver a lista de chats" aria-label="Volver a lista de chats"></button>

          <!-- 5 Ranuras de contactos verticales en celular -->
          <div class="chat-mobile-slots" id="chat-mobile-slots">
            ${characters.map((c, index) => `
              <button class="chat-mobile-slot-btn chat-mobile-slot-${index + 1}"
                      data-character-id="${c.id}"
                      title="${c.name}">
                <div class="chat-mobile-slot-avatar">
                  ${c.avatar ? `<img src="${c.avatar}" alt="${c.name}" />` : `
                    <svg class="chat-mobile-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="#815336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  `}
                </div>
                <span class="chat-mobile-slot-name">${c.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Panel de chat activo en celular -->
          <div class="chat-mobile-chat-panel" id="chat-mobile-chat-panel" style="display: none;">
            <!-- Botón táctil para volver a contactos -->
            <button class="chat-mobile-back-btn" id="chat-mobile-back-btn" aria-label="Volver a lista de chats" title="Volver a lista de chats">
              <img src="/assets/boton retroceder.png" alt="Volver" />
            </button>

            <!-- Encabezado personaje seleccionado -->
            <div class="chat-mobile-header">
              <div class="chat-mobile-header-avatar" id="chat-mobile-header-avatar"></div>
              <div class="chat-mobile-header-text">
                <h3 class="chat-mobile-header-name" id="chat-mobile-header-name"></h3>
              </div>
            </div>

            <!-- Recuadro de mensajes -->
            <div class="chat-mobile-messages-area" id="chat-mobile-messages"></div>

            <!-- Indicador escribiendo -->
            <div class="chat-mobile-typing" id="chat-mobile-typing" style="display: none;">
              <span class="chat-mobile-typing-dot"></span>
              <span class="chat-mobile-typing-dot"></span>
              <span class="chat-mobile-typing-dot"></span>
            </div>

            <!-- Input inferior con botón enviar -->
            <form class="chat-mobile-input-form" id="chat-mobile-form">
              <input type="text"
                     class="chat-mobile-input-element"
                     id="chat-mobile-message-input"
                     placeholder="ESCRIBIR MENSAJE...."
                     required
                     autocomplete="off" />
              <button type="submit" class="chat-mobile-send-trigger" aria-label="Enviar mensaje">
                <svg class="chat-mobile-send-icon" viewBox="0 0 24 24" fill="#815336">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  `;

  // Elementos del formato de Escritorio (PC)
  const desktopCanvas = container.querySelector('#chat-desktop-canvas');
  const desktopRightPanel = container.querySelector('#chat-desktop-right-panel');
  const desktopHeaderAvatar = container.querySelector('#chat-desktop-header-avatar');
  const desktopHeaderName = container.querySelector('#chat-desktop-header-name');
  const desktopMsgContainer = container.querySelector('#chat-desktop-messages');
  const desktopTyping = container.querySelector('#chat-desktop-typing');
  const desktopForm = container.querySelector('#chat-desktop-form');
  const desktopInput = container.querySelector('#chat-desktop-message-input');
  const desktopSlotButtons = container.querySelectorAll('.chat-desktop-slot-btn');
  const desktopBackBtn = container.querySelector('#chat-desktop-back-btn');

  // Elementos del formato de Celular (Móvil)
  const mobileCanvas = container.querySelector('#chat-mobile-canvas');
  const mobileChatPanel = container.querySelector('#chat-mobile-chat-panel');
  const mobileHeaderAvatar = container.querySelector('#chat-mobile-header-avatar');
  const mobileHeaderName = container.querySelector('#chat-mobile-header-name');
  const mobileMsgContainer = container.querySelector('#chat-mobile-messages');
  const mobileTyping = container.querySelector('#chat-mobile-typing');
  const mobileForm = container.querySelector('#chat-mobile-form');
  const mobileInput = container.querySelector('#chat-mobile-message-input');
  const mobileSlotButtons = container.querySelectorAll('.chat-mobile-slot-btn');
  const mobileTitleBtn = container.querySelector('#chat-mobile-title-btn');
  const mobileBackBtn = container.querySelector('#chat-mobile-back-btn');

  function selectCharacter(id) {
    if (selectedCharacterId === id) return;
    selectedCharacterId = id;
    const activeCharacter = getSelectedCharacter();
    if (!activeCharacter) return;

    const avatarHtml = activeCharacter.avatar
      ? `<img src="${activeCharacter.avatar}" alt="${activeCharacter.name}" />`
      : `<svg class="chat-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="#815336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
           <circle cx="12" cy="7" r="4"></circle>
         </svg>`;

    // --- Actualizar Escritorio ---
    if (desktopCanvas) desktopCanvas.classList.add('is-active');
    desktopSlotButtons.forEach(btn => {
      if (btn.dataset.characterId === id) {
        btn.classList.add('chat-desktop-slot-selected');
      } else {
        btn.classList.remove('chat-desktop-slot-selected');
      }
    });
    if (desktopRightPanel) desktopRightPanel.style.display = 'block';
    if (desktopHeaderAvatar) desktopHeaderAvatar.innerHTML = avatarHtml;
    if (desktopHeaderName) desktopHeaderName.textContent = activeCharacter.name;

    // --- Actualizar Celular ---
    if (mobileCanvas) mobileCanvas.classList.add('is-active');
    mobileSlotButtons.forEach(btn => {
      if (btn.dataset.characterId === id) {
        btn.classList.add('chat-mobile-slot-selected');
      } else {
        btn.classList.remove('chat-mobile-slot-selected');
      }
    });
    if (mobileChatPanel) mobileChatPanel.style.display = 'block';
    if (mobileHeaderAvatar) mobileHeaderAvatar.innerHTML = avatarHtml;
    if (mobileHeaderName) mobileHeaderName.textContent = activeCharacter.name;

    updateMessagesList();

    if (window.innerWidth > 768) {
      if (desktopInput) desktopInput.focus();
    } else {
      if (mobileInput) mobileInput.focus();
    }
  }

  function deselectCharacter() {
    selectedCharacterId = null;

    // --- Deseleccionar Escritorio ---
    if (desktopCanvas) desktopCanvas.classList.remove('is-active');
    desktopSlotButtons.forEach(btn => btn.classList.remove('chat-desktop-slot-selected'));
    if (desktopRightPanel) desktopRightPanel.style.display = 'none';
    if (desktopInput) desktopInput.value = '';

    // --- Deseleccionar Celular ---
    if (mobileCanvas) mobileCanvas.classList.remove('is-active');
    mobileSlotButtons.forEach(btn => btn.classList.remove('chat-mobile-slot-selected'));
    if (mobileChatPanel) mobileChatPanel.style.display = 'none';
    if (mobileInput) mobileInput.value = '';
  }

  function updateMessagesList() {
    if (!selectedCharacterId) return;
    const messages = chatHistories[selectedCharacterId] || [];

    // Renderizado para escritorio
    if (desktopMsgContainer) {
      desktopMsgContainer.innerHTML = messages.map(msg => `
        <div class="chat-desktop-msg ${msg.sender === 'user' ? 'chat-desktop-msg-user' : 'chat-desktop-msg-character'}">
          <div class="chat-desktop-msg-bubble">
            <span class="chat-desktop-msg-text">${msg.text}</span>
            <span class="chat-desktop-msg-time">${msg.time}</span>
          </div>
        </div>
      `).join('');
      desktopMsgContainer.scrollTop = desktopMsgContainer.scrollHeight;
    }

    // Renderizado para celular
    if (mobileMsgContainer) {
      mobileMsgContainer.innerHTML = messages.map(msg => `
        <div class="chat-mobile-msg ${msg.sender === 'user' ? 'chat-mobile-msg-user' : 'chat-mobile-msg-character'}">
          <div class="chat-mobile-bubble">
            <span class="chat-mobile-msg-text">${msg.text}</span>
            <span class="chat-mobile-msg-time">${msg.time}</span>
          </div>
        </div>
      `).join('');
      mobileMsgContainer.scrollTop = mobileMsgContainer.scrollHeight;
    }
  }

  async function sendMessage(text) {
    if (!text || !selectedCharacterId) return;
    const currentChatId = selectedCharacterId;

    chatHistories[currentChatId].push({
      sender: 'user',
      text: text,
      time: getCurrentTime()
    });

    if (desktopInput) desktopInput.value = '';
    if (mobileInput) mobileInput.value = '';
    updateMessagesList();

    if (selectedCharacterId === currentChatId) {
      if (desktopTyping) desktopTyping.style.display = 'flex';
      if (mobileTyping) mobileTyping.style.display = 'flex';
    }

    const history = (chatHistories[currentChatId] || [])
      .slice(0, -1)
      .slice(-6)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, characterId: currentChatId, history })
      });

      const data = await response.json();

      chatHistories[currentChatId].push({
        sender: 'character',
        text: data.response || '¡Oh! Algo pasó. ¿Me repites?',
        time: getCurrentTime()
      });
    } catch (err) {
      console.error(err);
      chatHistories[currentChatId].push({
        sender: 'character',
        text: '¡Oh! Parece que mi conexión se perdió. ¿Puedes intentarlo de nuevo?',
        time: getCurrentTime()
      });
    } finally {
      if (selectedCharacterId === currentChatId) {
        if (desktopTyping) desktopTyping.style.display = 'none';
        if (mobileTyping) mobileTyping.style.display = 'none';
        updateMessagesList();
      }
    }
  }

  // Listeners para botones de personajes en Escritorio
  desktopSlotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectCharacter(btn.dataset.characterId);
    });
  });

  // Listeners para botones de personajes en Celular
  mobileSlotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectCharacter(btn.dataset.characterId);
    });
  });

  // Botón título en Escritorio
  if (desktopBackBtn) {
    desktopBackBtn.addEventListener('click', deselectCharacter);
  }

  // Botón título en Celular
  if (mobileTitleBtn) {
    mobileTitleBtn.addEventListener('click', deselectCharacter);
  }

  // Botón volver táctil en Celular
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', deselectCharacter);
  }

  // Formulario Escritorio
  if (desktopForm) {
    desktopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = desktopInput ? desktopInput.value.trim() : '';
      sendMessage(text);
    });
  }

  // Formulario Celular
  if (mobileForm) {
    mobileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = mobileInput ? mobileInput.value.trim() : '';
      sendMessage(text);
    });
  }
}
