'use strict';
// Configuração do jogo
/* =====================================================================
   CONFIGURAÇÃO — altere aqui tempo, erros, dificuldade e pontuação
   ===================================================================== */
const CONFIG = {
  GAME_SECONDS: 90,          // duração total da partida
  MAX_ERRORS: 1,             // erros permitidos (o erro MAX_ERRORS+1 encerra)
  TIER_LIMITS: [3, 6],       // fases 1-3 fácil, 4-6 médio, 7+ difícil
  MAX_TRIES: 300,            // limite de tentativas do gerador (depois usa modelo validado)
  // Pontuação: ver scoreOfFigure() e scoreTotal()
  PTS_FIGURE: 100,           // pontos base por figura concluída
  PTS_TIER: 25,              // bônus por nível de dificuldade (0 fácil, 1 médio, 2 difícil)
  SPEED_DIV: 3,              // +1 ponto a cada SPEED_DIV segundos restantes ao concluir a figura
  ERROR_PENALTY: 30,         // desconto por erro cometido
  RANK_KEY: 'linhaUnica.ranking.v1',
  RANK_MAX: 50
};
/* Estrutura salva no localStorage (JSON): array de
   { id:string, team:string, score:number, figs:number, errors:number, timeUsed:number(s), date:ISO } */
