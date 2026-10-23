# Desafio da Linha Única

Jogo de raciocínio **One Touch** desenvolvido com HTML, CSS e JavaScript puros. O objetivo é percorrer todas as linhas de cada figura sem repetir nenhuma.

## Como jogar

1. Abra `index.html` no navegador ou publique o repositório no GitHub Pages.
2. Informe o nome da equipe e clique em **Iniciar Jogo**.
3. Toque ou clique em um vértice e arraste pelos vértices conectados para percorrer as linhas.
4. Complete o maior número possível de figuras antes de o tempo acabar.

## Regras

- A partida dura 90 segundos no total, sem reiniciar o cronômetro entre fases.
- É permitido um erro; o segundo erro encerra a partida.
- Repetir uma linha ou ficar sem saída conta como erro.
- O ranking é armazenado localmente no navegador e não é sincronizado entre dispositivos.

## Estrutura dos arquivos

Todos os arquivos ficam na raiz do repositório:

- `index.html` — telas de início, partida, resultado e ranking.
- `style.css` — estilos e layout responsivo.
- `config.js` — tempo, erros, dificuldade e pontuação.
- `utils.js` — funções auxiliares.
- `graph.js` — validação matemática e geometria dos grafos.
- `generator.js` — geração das figuras.
- `score.js` — cálculo da pontuação.
- `ranking.js` — ranking local com `localStorage`.
- `ui.js` — troca de telas e avisos.
- `game.js` — estado da partida, cronômetro e fases.
- `input.js` — entrada por mouse e toque.
- `main.js` — botões e inicialização.

Os scripts são carregados como scripts clássicos, na ordem definida em `index.html`; mantenha essa ordem ao alterar o projeto.
