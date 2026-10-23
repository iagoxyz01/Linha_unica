'use strict';
// Gerador de figuras
/* =====================================================================
   GERADOR DE FIGURAS
   Fáceis: modelos clássicos. Médias/difíceis: união (XOR) de ciclos aleatórios
   sobre grades/círculos — XOR de ciclos mantém todos os graus pares; opcionalmente
   remove uma aresta (gera exatamente 2 vértices ímpares). Tudo passa por validate().
   ===================================================================== */
const C = 200;
const circ = (n, r = 150, rot = -Math.PI / 2 + (Math.random() - .5) * .5) =>
  Array.from({ length: n }, (_, i) => [C + r * Math.cos(rot + 2 * Math.PI * i / n), C + r * Math.sin(rot + 2 * Math.PI * i / n)]);
const ring = n => Array.from({ length: n }, (_, i) => [i, (i + 1) % n]);
const EASY = [  // p = primeira fase em que o modelo pode aparecer
  { k: 'tri',  p: 1, f: () => ({ V: circ(3), E: ring(3) }) },
  { k: 'quad', p: 1, f: () => ({ V: [[80, 80], [320, 80], [320, 320], [80, 320]], E: ring(4) }) },
  { k: 'house', p: 1, f: () => ({ V: [[100, 320], [300, 320], [300, 170], [100, 170], [200, 60]], E: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 2]] }) },
  { k: 'bow',  p: 2, f: () => ({ V: [[70, 90], [70, 310], [200, 200], [330, 90], [330, 310]], E: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 2]] }) },
  { k: 'pent', p: 2, f: () => ({ V: circ(5), E: ring(5) }) },
  { k: 'env',  p: 3, f: () => ({ V: [[90, 330], [310, 330], [310, 160], [90, 160], [200, 50]], E: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [3, 4], [4, 2]] }) },
  { k: 'star', p: 3, f: () => ({ V: circ(5, 150, -Math.PI / 2), E: [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]] }) }
];
function layouts(t) {
  const g = (r, c) => { const V = []; for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) V.push([60 + j * 280 / (c - 1), 60 + i * 280 / (r - 1)]); return V; };
  const cc = (n, ctr) => { const V = circ(n, 150, -Math.PI / 2); if (ctr) V.push([C, C]); return V; };
  return t === 1 ? [cc(7), cc(8), g(3, 3), cc(6, 1)] : [g(3, 4), g(4, 4), cc(9), cc(8, 1), g(3, 3)];
}
const RECENT = [];   // assinaturas das últimas figuras (evita repetição)
function randomFigure(phase) {
  const hard = tier(phase) === 2;
  const lo = hard ? 13 + Math.min(phase - 7, 3) : 9, hi = hard ? lo + 9 : 14;   // faixa de linhas
  const maxX = hard ? 40 : 8, minX = hard ? 3 : 0, minN = hard ? 8 : 6;         // cruzamentos / vértices
  for (let i = 0; i < CONFIG.MAX_TRIES; i++) {
    const L = pick(layouts(tier(phase))), n = L.length, set = new Set();
    const k = hard ? rand(3, 6) + (phase >= 10 ? 1 : 0) : rand(2, 3);          // nº de ciclos = complexidade estrutural
    for (let c = 0; c < k; c++) {
      const vs = shuffle([...Array(n).keys()]).slice(0, rand(3, 5));
      vs.forEach((v, j) => { const kk = key(v, vs[(j + 1) % vs.length]); set.has(kk) ? set.delete(kk) : set.add(kk); });
    }
    const E = [...set].map(s => s.split('-').map(Number));
    if (Math.random() < .4 && E.length > lo) E.splice(rand(0, E.length - 1), 1);
    const f = compact(L, E);
    if (f.V.length < minN || f.E.length < lo || f.E.length > hi || !validate(f) || !clean(f)) continue;
    const x = crossings(f); if (x < minX || x > maxX) continue;
    f.sig = f.V.length + '|' + f.E.length + '|' + degrees(f).sort().join('');
    if (RECENT.includes(f.sig)) continue;
    return f;
  }
  return null;
}
function makeFigure(phase) {
  let f = null; const t = tier(phase);
  if (t === 0) {
    const pool = EASY.filter(e => e.p <= phase), fresh = pool.filter(e => !RECENT.includes(e.k));
    const e = pick(fresh.length ? fresh : pool); f = e.f(); f.sig = e.k; if (!validate(f)) f = null;
  } else f = randomFigure(phase);
  if (!f) {   // modelo de reserva já validado: grafo completo K5/K7 (todos os graus pares)
    const n = t === 2 ? 7 : 5, E = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) E.push([i, j]);
    f = { V: circ(n, 150, -Math.PI / 2), E, sig: 'K' + n };
  }
  RECENT.push(f.sig); if (RECENT.length > 6) RECENT.shift();
  return f;
}
