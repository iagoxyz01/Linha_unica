'use strict';
// Pontuação
/* =====================================================================
   PONTUAÇÃO — fórmula única, igual para todos
   figura = PTS_FIGURE + PTS_TIER*nível + floor(segundos restantes / SPEED_DIV)
   total  = max(0, soma das figuras − erros*ERROR_PENALTY)
   Figura incompleta não pontua.
   ===================================================================== */
const scoreOfFigure = (phase, leftMs) => CONFIG.PTS_FIGURE + CONFIG.PTS_TIER * tier(phase) + Math.floor(leftMs / 1000 / CONFIG.SPEED_DIV);
const scoreTotal = g => Math.max(0, g.pts - g.errors * CONFIG.ERROR_PENALTY);
