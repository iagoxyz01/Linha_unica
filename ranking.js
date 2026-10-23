'use strict';
// Ranking local (localStorage)
/* =====================================================================
   RANKING (localStorage com tratamento de erro)
   ===================================================================== */
const rankCmp = (a, b) => b.score - a.score || b.figs - a.figs || a.timeUsed - b.timeUsed;
function loadRank() { try { const a = JSON.parse(localStorage.getItem(CONFIG.RANK_KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function storeRank(a) { try { localStorage.setItem(CONFIG.RANK_KEY, JSON.stringify(a)); return true; } catch (e) { return false; } }
function addRank(entry) {   // retorna a posição (ou null se não foi possível gravar)
  const list = loadRank();
  if (!list.some(x => x.id === entry.id)) list.push(entry);   // id único evita duplicar a mesma partida
  list.sort(rankCmp); const kept = list.slice(0, CONFIG.RANK_MAX);
  if (!storeRank(kept)) return null;
  const i = kept.findIndex(x => x.id === entry.id);
  return i < 0 ? null : i + 1;
}
const tr = cells => { const r = document.createElement('tr'); cells.forEach(c => { const d = document.createElement('td'); d.textContent = c; r.append(d); }); return r; };
function renderRank() {
  const list = loadRank().sort(rankCmp), body = $('rBody'); body.replaceChildren();
  list.forEach((e, i) => body.append(tr([i + 1, e.team, e.score, e.figs, e.errors, new Date(e.date).toLocaleString('pt-BR')])));
  $('rEmpty').style.display = list.length ? 'none' : 'block';
}
