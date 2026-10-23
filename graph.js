'use strict';
// Grafos: validação matemática e geometria
/* =====================================================================
   GRAFOS: validação matemática (caminho euleriano)
   Figura = { V:[[x,y]...], E:[[a,b]...] }  (coordenadas em 0..400)
   ===================================================================== */
function degrees(f) { const d = f.V.map(() => 0); f.E.forEach(([a, b]) => { d[a]++; d[b]++; }); return d; }
function connected(f) {
  const adj = f.V.map(() => []); f.E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const seen = new Set([0]), st = [0];
  while (st.length) for (const w of adj[st.pop()]) if (!seen.has(w)) { seen.add(w); st.push(w); }
  return seen.size === f.V.length;
}
/* Válida se: sem laços/duplicatas, sem vértices isolados, conexa e com 0 ou 2 vértices de grau ímpar */
function validate(f) {
  if (!f.E.length) return false;
  const s = new Set();
  for (const [a, b] of f.E) { if (a === b) return false; const k = key(a, b); if (s.has(k)) return false; s.add(k); }
  const d = degrees(f);
  if (d.some(x => x === 0)) return false;
  const odd = d.filter(x => x % 2).length;
  return connected(f) && (odd === 0 || odd === 2);
}
/* Geometria: nenhuma aresta pode passar sobre um vértice que não seja seu */
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
const clean = f => f.E.every(([a, b]) => f.V.every((p, i) => i === a || i === b || segDist(p, f.V[a], f.V[b]) > 18));
const orient = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
function crossings(f) {   // cruzamentos visuais (NÃO são vértices)
  let n = 0; const V = f.V, E = f.E;
  for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) {
    const [a, b] = E[i], [c, d] = E[j];
    if (a === c || a === d || b === c || b === d) continue;
    if (orient(V[a], V[b], V[c]) * orient(V[a], V[b], V[d]) < 0 && orient(V[c], V[d], V[a]) * orient(V[c], V[d], V[b]) < 0) n++;
  }
  return n;
}
function compact(V, E) {  // remove vértices sem arestas e reindexa
  const m = new Map(), nv = [];
  E.forEach(e => e.forEach(x => { if (!m.has(x)) { m.set(x, nv.length); nv.push(V[x]); } }));
  return { V: nv, E: E.map(([a, b]) => [m.get(a), m.get(b)]) };
}
