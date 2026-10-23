'use strict';
// Controle da partida
/* =====================================================================
   CONTROLE DA PARTIDA
   ===================================================================== */
let G = null, F = null, timerId = null;
const svg = $('board');

function startGame() {
  const team = $('team').value.trim();
  if (!team) { toast('Informe o nome da equipe para começar.', 'bad'); $('team').focus(); return; }
  if (G && !G.over) return;                      // nunca inicia outra partida em andamento
  clearInterval(timerId);
  RECENT.length = 0;
  G = { id: Date.now() + '-' + rand(1000, 9999), team, phase: 1, done: 0, errors: 0, pts: 0, over: false, locked: false,
        t0: Date.now(), end: Date.now() + CONFIG.GAME_SECONDS * 1000 };
  show('game'); loadFigure();
  timerId = setInterval(tick, 200);              // único intervalo (limpo antes de criar)
  tick();
}
const timeLeft = () => Math.max(0, G.end - Date.now());
function tick() {
  if (!G || G.over) return;
  const l = timeLeft(); $('time').textContent = fmt(Math.ceil(l / 1000)); $('time').classList.toggle('low', l <= 10000);
  if (l <= 0) endGame('tempo');
}
function hud() {
  $('hPhase').textContent = G.phase; $('hScore').textContent = scoreTotal(G);
  const left = Math.max(0, CONFIG.MAX_ERRORS - G.errors);
  $('hErr').textContent = G.errors + ' de ' + CONFIG.MAX_ERRORS + ' (restam ' + left + ')';
  if (F) { $('hLines').textContent = F.used.size + '/' + F.f.E.length; $('hBar').style.width = (100 * F.used.size / F.f.E.length) + '%'; }
}
function loadFigure() {
  const f = makeFigure(G.phase), adj = f.V.map(() => []), idx = {};
  f.E.forEach(([a, b], i) => { adj[a].push(i); adj[b].push(i); idx[key(a, b)] = i; });
  const d = degrees(f);
  F = { f, adj, idx, used: new Set(), cur: null, hover: null, down: false, odd: d.map((x, i) => x % 2 ? i : -1).filter(i => i >= 0) };
  const p = n => n.toFixed(1);
  svg.innerHTML = f.E.map(([a, b], i) => `<line id="e${i}" class="ed" x1="${p(f.V[a][0])}" y1="${p(f.V[a][1])}" x2="${p(f.V[b][0])}" y2="${p(f.V[b][1])}"/>`).join('')
    + '<line id="rb" class="rb" visibility="hidden"/>'
    + f.V.map((v, i) => `<circle id="v${i}" class="vx${F.odd.includes(i) ? ' st' : ''}" cx="${p(v[0])}" cy="${p(v[1])}" r="10"/>`).join('');
  hud();
}
function resetFigure() {
  F.used.clear(); F.cur = null; F.hover = null;
  svg.querySelectorAll('.used').forEach(x => x.classList.remove('used'));
  svg.querySelectorAll('.cur').forEach(x => x.classList.remove('cur'));
  $('rb').setAttribute('visibility', 'hidden'); hud();
}
function fail(msg, reset) {
  G.errors++;
  if (G.errors > CONFIG.MAX_ERRORS) { hud(); return endGame('erros'); }
  toast(msg, 'bad'); if (reset) resetFigure(); else hud();
}
/* Tenta mover do vértice atual para o vértice v */
function step(v) {
  if (F.cur === null) {   // início do percurso
    if (F.odd.length && !F.odd.includes(v)) return toast('Comece por um ponto roxo.', '');
    F.cur = v; svg.querySelectorAll('.cur').forEach(x => x.classList.remove('cur')); $('v' + v).classList.add('cur'); return;
  }
  if (v === F.cur) return;
  const id = F.idx[key(F.cur, v)];
  if (id === undefined) return;                                  // não conectado: ignorado, sem erro
  if (F.used.has(id)) return fail('Linha repetida!', false);     // aresta já usada: erro
  F.used.add(id); $('e' + id).classList.add('used'); F.cur = v;
  svg.querySelectorAll('.cur').forEach(x => x.classList.remove('cur')); $('v' + v).classList.add('cur');
  hud();
  if (F.used.size === F.f.E.length) return complete();
  if (!F.adj[v].some(e => !F.used.has(e))) fail('Sem saída! A figura foi reiniciada.', true);   // beco sem saída
}
function complete() {
  const g = G, gain = scoreOfFigure(G.phase, timeLeft());
  g.locked = true; g.done++; g.pts += gain; g.phase++;
  $('hScore').textContent = scoreTotal(g); toast('Figura concluída! +' + gain, 'ok');
  setTimeout(() => { if (G === g && !g.over) { g.locked = false; loadFigure(); } }, 800);
}
function endGame(reason) {
  if (!G || G.over) return;      // protege contra dupla finalização/pontuação
  G.over = true; clearInterval(timerId); timerId = null;
  if (reason === 'abandono') { show('home'); return; }
  const used = reason === 'tempo' ? CONFIG.GAME_SECONDS : Math.min(CONFIG.GAME_SECONDS, Math.round((Date.now() - G.t0) / 1000));
  const entry = { id: G.id, team: G.team, score: scoreTotal(G), figs: G.done, errors: G.errors, timeUsed: used, date: new Date().toISOString() };
  G.result = entry; G.pos = addRank(entry);       // grava uma única vez (id único)
  showResult(reason);
}
function showResult(reason) {
  const e = G.result;
  $('eTitle').textContent = e.figs >= 5 ? 'Vitória!' : 'Fim de jogo';
  $('eMsg').textContent = reason === 'tempo' ? 'O tempo acabou.' : 'Você cometeu o segundo erro.';
  $('eStats').replaceChildren(...[['Equipe', e.team], ['Fases concluídas', e.figs], ['Pontuação final', e.score], ['Erros', e.errors],
    ['Tempo utilizado', fmt(e.timeUsed)], ['Tempo restante', fmt(CONFIG.GAME_SECONDS - e.timeUsed)]].map(([k, v]) => {
      const d = document.createElement('div'), b = document.createElement('b'); b.textContent = v; d.append(k, b); return d; }));
  $('ePos').textContent = G.pos ? 'Posição no ranking local: ' + G.pos + 'º' : 'Não foi possível salvar no ranking deste navegador.';
  show('end');
}
