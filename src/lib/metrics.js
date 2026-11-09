import * as XLSX from 'xlsx';

const STORAGE_KEY = 'natata_metrics';

/**
 * Genera un UUID compatible con navegadores antiguos y modernos
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Obtiene la etiqueta amigable para cada tipo de juego
 */
export function getGameLabel(gameType) {
  const map = {
    'order': '🧩 Ordenar la Historia',
    'differences': '🔍 Encuentra Diferencias',
    'find': '🥕 Búsqueda Mágica'
  };
  return map[gameType] || gameType;
}

/**
 * Formatea segundos a formato MM:SS
 */
export function formatTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return '--:--';
  }
  const totalSecs = Math.round(seconds);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formatea una fecha ISO a formato local legible
 */
export function formatDate(isoString) {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

/**
 * Obtiene todas las métricas guardadas en localStorage
 */
export function getAllMetrics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ordenar de más reciente a más antiguo
    return parsed.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  } catch (e) {
    console.error('Error al leer métricas de localStorage:', e);
    return [];
  }
}

/**
 * Guarda una nueva métrica en localStorage
 * @param {Object} metric
 * @param {string} metric.gameType - 'order' | 'differences' | 'find'
 * @param {string} metric.storyId - e.g. 'la-muela'
 * @param {string} metric.storyTitle - e.g. 'La Muela del Diablo'
 * @param {number} metric.attempts - número de intentos
 * @param {number} metric.timeSeconds - tiempo en segundos
 * @param {number} metric.errorsCount - número de errores cometidos
 */
export function saveMetric({ gameType, storyId, storyTitle, attempts = 1, timeSeconds = 0, errorsCount = 0 }) {
  try {
    const metrics = getAllMetrics();
    const newMetric = {
      id: generateId(),
      gameType,
      storyId: storyId || 'desconocido',
      storyTitle: storyTitle || 'Cuento',
      attempts: Math.max(1, Math.round(attempts)),
      timeSeconds: Math.max(0, Math.round(timeSeconds * 10) / 10),
      errorsCount: Math.max(0, Math.round(errorsCount)),
      completedAt: new Date().toISOString()
    };

    metrics.unshift(newMetric); // Agregar al inicio
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    return newMetric;
  } catch (e) {
    console.error('Error al guardar métrica:', e);
    return null;
  }
}

/**
 * Calcula estadísticas agregadas a partir de una lista de métricas
 */
export function getStats(metricsList = null) {
  const metrics = metricsList || getAllMetrics();
  if (metrics.length === 0) {
    return {
      totalGames: 0,
      bestTime: null,
      avgTime: 0,
      avgAttempts: 0,
      totalErrors: 0
    };
  }

  const totalGames = metrics.length;
  const bestTime = Math.min(...metrics.map(m => m.timeSeconds));
  const totalTime = metrics.reduce((acc, m) => acc + m.timeSeconds, 0);
  const totalAttempts = metrics.reduce((acc, m) => acc + m.attempts, 0);
  const totalErrors = metrics.reduce((acc, m) => acc + m.errorsCount, 0);

  return {
    totalGames,
    bestTime,
    avgTime: totalTime / totalGames,
    avgAttempts: totalAttempts / totalGames,
    totalErrors
  };
}

/**
 * Elimina todas las métricas guardadas
 */
export function clearAllMetrics() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error al limpiar métricas:', e);
    return false;
  }
}

/**
 * Exporta las métricas a un archivo Excel (.xlsx) estructurado con 2 hojas:
 * 1. "Historial": Todas las partidas registradas con detalle
 * 2. "Resumen": Estadísticas generales y desglose por juego y cuento
 */
export function exportToExcel(metricsList = null) {
  const metrics = metricsList || getAllMetrics();
  if (!metrics || metrics.length === 0) {
    alert('No hay métricas registradas para exportar.');
    return false;
  }

  const wb = XLSX.utils.book_new();

  // ==========================================
  // HOJA 1: HISTORIAL DE PARTIDAS
  // ==========================================
  const historyData = metrics.map((m, idx) => ({
    'N°': idx + 1,
    'Fecha y Hora': formatDate(m.completedAt),
    'Juego': getGameLabel(m.gameType),
    'Cuento': m.storyTitle,
    'Tiempo (segundos)': m.timeSeconds,
    'Tiempo (MM:SS)': formatTime(m.timeSeconds),
    'Intentos': m.attempts,
    'Errores': m.errorsCount,
    'ID Partida': m.id
  }));

  const wsHistory = XLSX.utils.json_to_sheet(historyData);
  wsHistory['!cols'] = [
    { wch: 6 },  // N°
    { wch: 20 }, // Fecha
    { wch: 26 }, // Juego
    { wch: 32 }, // Cuento
    { wch: 18 }, // Tiempo seg
    { wch: 16 }, // Tiempo MM:SS
    { wch: 12 }, // Intentos
    { wch: 12 }, // Errores
    { wch: 38 }  // ID Partida
  ];
  XLSX.utils.book_append_sheet(wb, wsHistory, 'Historial');

  // ==========================================
  // HOJA 2: RESUMEN Y ESTADÍSTICAS
  // ==========================================
  const generalStats = getStats(metrics);
  const summaryRows = [
    { 'Sección': 'RESUMEN GENERAL', 'Concepto': 'Total de partidas jugadas', 'Valor': generalStats.totalGames },
    { 'Sección': 'RESUMEN GENERAL', 'Concepto': 'Mejor tiempo registrado', 'Valor': formatTime(generalStats.bestTime) },
    { 'Sección': 'RESUMEN GENERAL', 'Concepto': 'Tiempo promedio por partida', 'Valor': formatTime(generalStats.avgTime) },
    { 'Sección': 'RESUMEN GENERAL', 'Concepto': 'Promedio de intentos', 'Valor': generalStats.avgAttempts.toFixed(2) },
    { 'Sección': 'RESUMEN GENERAL', 'Concepto': 'Total de errores cometidos', 'Valor': generalStats.totalErrors },
    { 'Sección': '', 'Concepto': '', 'Valor': '' },
    { 'Sección': 'POR TIPO DE JUEGO', 'Concepto': '---', 'Valor': '---' }
  ];

  // Desglose por juego
  const gameTypes = ['order', 'differences', 'find'];
  gameTypes.forEach(gt => {
    const gameMetrics = metrics.filter(m => m.gameType === gt);
    if (gameMetrics.length > 0) {
      const gStats = getStats(gameMetrics);
      summaryRows.push(
        { 'Sección': getGameLabel(gt), 'Concepto': 'Partidas jugadas', 'Valor': gStats.totalGames },
        { 'Sección': getGameLabel(gt), 'Concepto': 'Mejor tiempo', 'Valor': formatTime(gStats.bestTime) },
        { 'Sección': getGameLabel(gt), 'Concepto': 'Tiempo promedio', 'Valor': formatTime(gStats.avgTime) },
        { 'Sección': getGameLabel(gt), 'Concepto': 'Promedio intentos', 'Valor': gStats.avgAttempts.toFixed(2) },
        { 'Sección': getGameLabel(gt), 'Concepto': 'Total errores', 'Valor': gStats.totalErrors }
      );
    }
  });

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary['!cols'] = [
    { wch: 28 }, // Sección
    { wch: 30 }, // Concepto
    { wch: 18 }  // Valor
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen Estadístico');

  // ==========================================
  // DESCARGAR ARCHIVO
  // ==========================================
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `metricas-natata-${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
  return true;
}
