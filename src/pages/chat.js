const characters = [
  {
    id: 'la-muela',
    name: 'dinosaurio_67',
    avatar: '/assets/chats/fotos perfil/muela del diablo.png'
  },
  {
    id: 'la-nina',
    name: 'niñabonita',
    avatar: '/assets/chats/fotos perfil/la ni\u00f1a y el espejo.png'
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

  // Renderizar la estructura con capas de fondo precargadas para eliminar cualquier parpadeo
  container.innerHTML = `
    <div class="chat-page-wrapper anim-fade-in">
      <div class="chat-canvas" id="chat-canvas">
        
        <!-- Capas de fondo superpuestas y precargadas -->
        <div class="chat-bg-layer chat-bg-antes" id="chat-bg-antes"></div>
        <div class="chat-bg-layer chat-bg-dentro" id="chat-bg-dentro"></div>

        <!-- Botón interactivo sobre el título CHATS para deseleccionar -->
        <button class="chat-back-title-btn" id="chat-back-btn" title="Volver a lista de chats" aria-label="Volver a lista de chats"></button>

        <!-- 5 Ranuras de contactos en el panel izquierdo alineadas con las líneas divisorias del pergamino -->
        <div class="chat-left-slots">
          ${characters.map((c, index) => {
            const layouts = [
              { top: '23.0%', height: '12.8%' },
              { top: '36.1%', height: '13.0%' },
              { top: '49.4%', height: '12.7%' },
              { top: '62.4%', height: '12.6%' },
              { top: '75.4%', height: '13.6%' }
            ];
            const layout = layouts[index] || { top: `${23 + index * 13}%`, height: '13%' };
            return `
            <button class="chat-slot-btn"
                    data-character-id="${c.id}"
                    style="top: ${layout.top}; height: ${layout.height};"
                    title="${c.name}">
              <div class="chat-slot-avatar">
                ${c.avatar ? `<img src="${c.avatar}" alt="${c.name}" />` : `
                  <svg class="chat-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="#815336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                `}
              </div>
              <span class="chat-slot-name">${c.name}</span>
            </button>
          `;
          }).join('')}
        </div>

        <!-- Overlays del panel derecho (inicialmente ocultos) -->
        <div class="chat-right-panel" id="chat-right-panel" style="display: none;">
          <!-- Header personaje activo (sin 'EN LÍNEA' duplicado) -->
          <div class="chat-right-header">
            <div class="chat-header-avatar" id="chat-header-avatar"></div>
            <div class="chat-header-text">
              <h3 class="chat-header-name" id="chat-header-name"></h3>
            </div>
          </div>

          <!-- Lista de mensajes -->
          <div class="chat-messages-area" id="chat-messages"></div>

          <!-- Indicador escribiendo -->
          <div class="chat-typing" id="typing-indicator" style="display: none;">
            <span class="chat-typing-dot"></span>
            <span class="chat-typing-dot"></span>
            <span class="chat-typing-dot"></span>
          </div>

          <!-- Input inferior superpuesto sobre la línea de escribir mensaje -->
          <form class="chat-input-form" id="chat-form">
            <input type="text"
                   class="chat-input-element"
                   id="message-input"
                   placeholder="ESCRIBIR MENSAJE...."
                   required
                   autocomplete="off" />
            <button type="submit" class="chat-send-trigger" aria-label="Enviar mensaje"></button>
          </form>
        </div>

      </div>
    </div>
  `;

  const canvasEl = container.querySelector('#chat-canvas');
  const rightPanelEl = container.querySelector('#chat-right-panel');
  const headerAvatarEl = container.querySelector('#chat-header-avatar');
  const headerNameEl = container.querySelector('#chat-header-name');
  const msgContainer = container.querySelector('#chat-messages');
  const typingIndicator = container.querySelector('#typing-indicator');
  const formEl = container.querySelector('#chat-form');
  const inputEl = container.querySelector('#message-input');
  const slotButtons = container.querySelectorAll('.chat-slot-btn');
  const backBtn = container.querySelector('#chat-back-btn');

  function selectCharacter(id) {
    if (selectedCharacterId === id) return;
    selectedCharacterId = id;
    const activeCharacter = getSelectedCharacter();
    if (!activeCharacter) return;

    // Cambiar a fondo activo suavemente mediante clase sin recarga
    canvasEl.classList.add('is-active');

    // Actualizar botón seleccionado con marco amarillo
    slotButtons.forEach(btn => {
      if (btn.dataset.characterId === id) {
        btn.classList.add('chat-slot-selected');
      } else {
        btn.classList.remove('chat-slot-selected');
      }
    });

    // Mostrar panel derecho
    rightPanelEl.style.display = 'block';

    // Actualizar encabezado del personaje
    headerAvatarEl.innerHTML = activeCharacter.avatar
      ? `<img src="${activeCharacter.avatar}" alt="${activeCharacter.name}" />`
      : `<svg class="chat-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="#815336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
           <circle cx="12" cy="7" r="4"></circle>
         </svg>`;
    headerNameEl.textContent = activeCharacter.name;

    // Actualizar mensajes
    updateMessagesList();

    if (inputEl) {
      inputEl.focus();
    }
  }

  function deselectCharacter() {
    selectedCharacterId = null;
    canvasEl.classList.remove('is-active');
    slotButtons.forEach(btn => btn.classList.remove('chat-slot-selected'));
    rightPanelEl.style.display = 'none';
    if (inputEl) inputEl.value = '';
  }

  function updateMessagesList() {
    if (!selectedCharacterId || !msgContainer) return;
    const messages = chatHistories[selectedCharacterId] || [];
    msgContainer.innerHTML = messages.map(msg => `
      <div class="chat-msg ${msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-character'}">
        <div class="chat-msg-bubble">
          <span class="chat-msg-text">${msg.text}</span>
          <span class="chat-msg-time">${msg.time}</span>
        </div>
      </div>
    `).join('');

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    const text = inputEl ? inputEl.value.trim() : '';
    if (!text || !selectedCharacterId) return;

    const currentChatId = selectedCharacterId;

    chatHistories[currentChatId].push({
      sender: 'user',
      text: text,
      time: getCurrentTime()
    });

    if (inputEl) inputEl.value = '';
    updateMessagesList();

    if (typingIndicator && selectedCharacterId === currentChatId) {
      typingIndicator.style.display = 'flex';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, characterId: currentChatId })
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
      if (typingIndicator && selectedCharacterId === currentChatId) {
        typingIndicator.style.display = 'none';
      }
      if (selectedCharacterId === currentChatId) {
        updateMessagesList();
      }
    }
  }

  // Event listeners para botones de personajes
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectCharacter(btn.dataset.characterId);
    });
  });

  // Event listener para el botón del título "CHATS" (volver / deseleccionar)
  if (backBtn) {
    backBtn.addEventListener('click', deselectCharacter);
  }

  // Event listener para el envío de mensajes
  if (formEl) {
    formEl.addEventListener('submit', handleSendMessage);
  }
}
