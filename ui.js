'use strict';
// Telas e avisos
/* =====================================================================
   TELAS, AVISOS
   ===================================================================== */
let prevScreen = 'home';
function show(id) { document.querySelectorAll('.scr').forEach(s => s.classList.toggle('on', s.id === id)); window.scrollTo(0, 0); }
let toastT;
function toast(msg, type) { const t = $('toast'); t.textContent = msg; t.className = 'on ' + (type || ''); clearTimeout(toastT); toastT = setTimeout(() => t.className = '', 1600); }
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0');
