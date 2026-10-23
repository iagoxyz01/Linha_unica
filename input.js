'use strict';
// Interação (mouse e toque)
/* =====================================================================
   INTERAÇÃO (mouse e toque via Pointer Events)
   ===================================================================== */
const canPlay = () => G && !G.over && !G.locked && F;
function toSvg(e) { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
function hit(p) {   // vértice mais próximo dentro do raio de captura (22 unidades)
  let best = null, bd = 22;
  F.f.V.forEach((v, i) => { const d = Math.hypot(v[0] - p.x, v[1] - p.y); if (d < bd) { bd = d; best = i; } });
  return best;
}
function rubber(p) {
  const rb = $('rb');
  if (F.cur === null || !F.down) return rb.setAttribute('visibility', 'hidden');
  const v = F.f.V[F.cur]; rb.setAttribute('x1', v[0]); rb.setAttribute('y1', v[1]); rb.setAttribute('x2', p.x); rb.setAttribute('y2', p.y); rb.setAttribute('visibility', 'visible');
}
svg.addEventListener('pointerdown', e => {
  if (!canPlay()) return; e.preventDefault();
  try { svg.setPointerCapture(e.pointerId); } catch (_) {}
  F.down = true; const p = toSvg(e), v = hit(p); F.hover = v;
  if (v !== null) step(v);
  if (canPlay()) rubber(p);
});
svg.addEventListener('pointermove', e => {
  if (!F || !F.down || !canPlay()) return;
  const p = toSvg(e), v = hit(p); rubber(p);
  if (v !== F.hover) { F.hover = v; if (v !== null) step(v); }   // só age ao ENTRAR em um vértice novo
});
['pointerup', 'pointercancel'].forEach(t => svg.addEventListener(t, () => { if (F) { F.down = false; F.hover = null; $('rb').setAttribute('visibility', 'hidden'); } }));
