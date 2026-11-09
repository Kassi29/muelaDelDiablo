import {
  getAllMetrics,
  getStats,
  clearAllMetrics,
  exportToExcel,
  formatTime,
  formatDate,
  getGameLabel
} from '../lib/metrics.js';
import { storiesData } from '../data/stories.js';

export function renderDashboard(container) {
  let selectedGame = 'all';
  let selectedStory = 'all';

  function getFilteredMetrics() {
    let list = getAllMetrics();
    if (selectedGame !== 'all') {
      list = list.filter(m => m.gameType === selectedGame);
    }
    if (selectedStory !== 'all') {
      list = list.filter(m => m.storyId === selectedStory);
    }
    return list;
  }

  function getBadgeClass(gameType) {
    if (gameType === 'order') return 'badge-order';
    if (gameType === 'differences') return 'badge-differences';
    if (gameType === 'find') return 'badge-find';
    return '';
  }

  function renderView() {
    const allMetrics = getAllMetrics();
    const filteredMetrics = getFilteredMetrics();
    const stats = getStats(filteredMetrics);

    container.innerHTML = `
      <div class="dashboard-page-container anim-fade-in">

        <!-- Barra superior: Volver y Acciones -->
        <header class="dashboard-header">
          <div class="dashboard-top-nav">
            <a href="/actividades" data-link class="dashboard-back-btn" title="Volver a los Juegos">
              <img src="/assets/boton retroceder.png" alt="Volver" class="dashboard-back-icon" />
              <span>Volver a Juegos</span>
            </a>

            <div class="dashboard-actions-header">
              <button class="btn-excel-download" id="btn-export-excel" title="Descargar todas las métricas en un archivo Excel .xlsx">
                📥 Descargar Excel (.xlsx)
              </button>

              ${allMetrics.length > 0 ? `
                <button class="btn-clear-metrics" id="btn-clear-metrics" title="Borrar todo el historial">
                  🗑️ Limpiar Historial
                </button>
              ` : ''}
            </div>
          </div>

          <div class="dashboard-title-box">
            <h1 class="dashboard-title">📊 Métricas de Juegos</h1>
            <p class="dashboard-subtitle">
              Registro detallado de intentos, tiempos y errores por actividad completada
            </p>
          </div>
        </header>

        <!-- Tarjetas resumen (KPIs) -->
        <section class="dashboard-kpi-grid">
          <div class="kpi-card">
            <span class="kpi-icon">🎮</span>
            <span class="kpi-value">${stats.totalGames}</span>
            <span class="kpi-label">Partidas Jugadas</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-icon">⚡</span>
            <span class="kpi-value">${formatTime(stats.bestTime)}</span>
            <span class="kpi-label">Mejor Tiempo</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-icon">⏱️</span>
            <span class="kpi-value">${formatTime(stats.avgTime)}</span>
            <span class="kpi-label">Tiempo Promedio</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-icon">🎯</span>
            <span class="kpi-value">${stats.avgAttempts > 0 ? stats.avgAttempts.toFixed(1) : '0'}</span>
            <span class="kpi-label">Promedio Intentos</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-icon">❌</span>
            <span class="kpi-value">${stats.totalErrors}</span>
            <span class="kpi-label">Total Errores</span>
          </div>
        </section>

        <!-- Barra de filtros -->
        <section class="dashboard-filters-card">
          <div class="filters-group">
            <span class="filters-label">Filtrar por Juego:</span>
            <button class="filter-chip-btn ${selectedGame === 'all' ? 'active' : ''}" data-game="all">Todos</button>
            <button class="filter-chip-btn ${selectedGame === 'order' ? 'active' : ''}" data-game="order">🧩 Ordenar</button>
            <button class="filter-chip-btn ${selectedGame === 'differences' ? 'active' : ''}" data-game="differences">🔍 Diferencias</button>
            <button class="filter-chip-btn ${selectedGame === 'find' ? 'active' : ''}" data-game="find">🥕 Búsqueda</button>
          </div>

          <div class="filters-group">
            <span class="filters-label">Cuento:</span>
            <select class="story-select-filter" id="story-filter">
              <option value="all" ${selectedStory === 'all' ? 'selected' : ''}>Todos los cuentos</option>
              ${storiesData.map(s => `
                <option value="${s.id}" ${selectedStory === s.id ? 'selected' : ''}>${s.title}</option>
              `).join('')}
            </select>
          </div>
        </section>

        <!-- Tabla de Historial -->
        <section class="dashboard-table-card">
          <div class="table-header-title-row">
            <h2 class="table-title">Historial de Partidas</h2>
            <span class="table-counter-badge">${filteredMetrics.length} ${filteredMetrics.length === 1 ? 'partida' : 'partidas'}</span>
          </div>

          ${filteredMetrics.length === 0 ? `
            <div class="empty-state-container">
              <div class="empty-state-icon">🧩</div>
              <h3 class="empty-state-title">No hay métricas registradas todavía</h3>
              <p class="empty-state-desc">
                ${allMetrics.length === 0 
                  ? 'Completa alguna de las actividades en los cuentos para comenzar a registrar tiempos e intentos.'
                  : 'No se encontraron partidas con los filtros seleccionados. Prueba cambiando los filtros.'}
              </p>
              ${allMetrics.length === 0 ? `
                <a href="/actividades" data-link class="btn-go-play">
                  🎮 Ir a Jugar
                </a>
              ` : ''}
            </div>
          ` : `
            <div class="table-responsive-wrapper">
              <table class="metrics-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Juego</th>
                    <th>Cuento</th>
                    <th>Tiempo</th>
                    <th>Intentos</th>
                    <th>Errores</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredMetrics.map(m => `
                    <tr>
                      <td>${formatDate(m.completedAt)}</td>
                      <td>
                        <span class="game-type-badge ${getBadgeClass(m.gameType)}">
                          ${getGameLabel(m.gameType)}
                        </span>
                      </td>
                      <td><strong>${m.storyTitle}</strong></td>
                      <td>
                        <span class="time-badge">${formatTime(m.timeSeconds)}</span>
                      </td>
                      <td>
                        <span class="attempt-badge">${m.attempts}</span>
                      </td>
                      <td>
                        <span class="error-badge ${m.errorsCount > 0 ? 'has-errors' : 'no-errors'}">
                          ${m.errorsCount}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </section>

      </div>
    `;

    // Event listeners
    attachEventListeners();
  }

  function attachEventListeners() {
    // Botón descargar Excel
    const btnExcel = container.querySelector('#btn-export-excel');
    if (btnExcel) {
      btnExcel.addEventListener('click', () => {
        exportToExcel(getAllMetrics());
      });
    }

    // Botón limpiar historial
    const btnClear = container.querySelector('#btn-clear-metrics');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        const confirmed = window.confirm(
          '¿Estás seguro de que deseas eliminar todas las métricas guardadas? Esta acción borrará el historial del navegador permanentemente.'
        );
        if (confirmed) {
          clearAllMetrics();
          renderView();
        }
      });
    }

    // Filtros por juego
    const gameButtons = container.querySelectorAll('.filter-chip-btn');
    gameButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedGame = btn.dataset.game;
        renderView();
      });
    });

    // Filtro por cuento
    const storySelect = container.querySelector('#story-filter');
    if (storySelect) {
      storySelect.addEventListener('change', (e) => {
        selectedStory = e.target.value;
        renderView();
      });
    }
  }

  renderView();
}
