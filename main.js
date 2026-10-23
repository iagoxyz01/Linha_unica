'use strict';
// Botões e inicialização
/* =====================================================================
   BOTÕES
   ===================================================================== */
$('bStart').onclick = startGame;
$('bAgain').onclick = () => { show('home'); $('team').focus(); startGame(); };
$('bHome').onclick = () => show('home');
$('bRank').onclick = () => { prevScreen = 'home'; renderRank(); show('rank'); };
$('bRank2').onclick = () => { prevScreen = 'end'; renderRank(); show('rank'); };
$('bBack').onclick = () => show(prevScreen);
$('bQuit').onclick = () => { if (G && !G.over && confirm('Abandonar a partida? A pontuação não será salva.')) endGame('abandono'); };
$('bClear').onclick = () => { if (confirm('Apagar todo o ranking local? Essa ação não pode ser desfeita.')) { try { localStorage.removeItem(CONFIG.RANK_KEY); } catch (e) {} renderRank(); } };
$('team').addEventListener('keydown', e => { if (e.key === 'Enter') startGame(); });
