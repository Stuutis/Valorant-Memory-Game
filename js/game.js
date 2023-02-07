const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const spanTimer = document.querySelector('.timer');
const main = document.querySelector('.main');
const header = document.querySelector('.header');

/* array  de personagens criados, mesmo nome que das imagens*/
const characters = [
  'AstraCard',
  'BreachCard',
  'BrimstoneCard',
  'CypherCard',
  'FadeCard',
  'JettCard',
  'KayoCard',
  'KilljoyCard',
  'NeonCard',
  'OmenCard',
  'PhoenixCard',
  'RazeCard',
  'ReynaCard',
  'SageCard',
  'SkyeCard',
  'SovaCard',
  'ViperCard',
  'YoruCard',
  'HarborCard',
  'ChamberCard',
];

// criação das variaveis para a logica de check das cartas.
let firstCard = '';
let secondCard = '';

// função que vai verificar se o jogo foi finalizado. Seleciona todos os elementos com a classe disabled-card em uma variavel.
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  // condição para fim de jogo, se o numero de cartas desabilitadas for igual ou maior que o numero total de cartas
  if (disabledCards.length >= 40) {
    const playerName = spanPlayer.innerHTML;
    const playerTime = spanTimer.innerHTML;
    /* converte para objeto, se não achar nada cria um array vazio com || []
    push adiciona o nome e o tempo do jogador e logo em seguida transformando para string e salvando no localStorage.
    */
    const players = JSON.parse(localStorage.getItem('players')) || [];
    players.push({ name: playerName, time: playerTime });
    localStorage.setItem('players', JSON.stringify(players));

    // limpa o relogio e dispara alerta avisando o tempo de duração do jogo.
    clearInterval(this.loop);
    alert(`Parabéns, ${playerName}! Seu tempo foi de: ${playerTime} segundos`);
  }
};

// função com a logica das cartas
const checkCards = () => {
  // adicionamos data-character nas cartas clicadas para checar se as mesmas são iguais e aqui pegamos o atributo delas para comparar
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  // comparamos os atributos dos elementos, se forem iguais, adicionamos a classe disabled-card que é a condição para fim de jogo. E logo apos definimos os valores das variaveis de checagem para uma string vazia.
  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    // se não forem iguais os atributos removemos a classe de revelar o card e colocamos novamente o valor das variaveis de checagem para strings vazias.
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
    }, 500);
  }
};

// Nesta função revelamos as cartas ao clique,
const revealCard = ({ target }) => {
  // neste primeiro if verificamos se já possui a classe reveal-card, caso possua a classe a carta ja foi revelada e finaliza a funçao.
  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  // logica para adicionar as classes de reveal-card nas cartas, se o valor das variaveis de checagem forem vazios, adicionamos a classe reveal-card. no fim checamos se as cartas são iguais
  if (firstCard === '') {
    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;

    checkCards();
  }
};

// criamos uma função para diminuir o codigo repetitivo na função de createCard, recebendo como parametro a tag HTML a ser criada e a className.

// criada a variavel element ela servira para criar uma tag HTML e em seguida recebe como classe a className que for passada a ela.
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

// função de criar os cards, precisa receber como parametro um nome de personagem.
const createCard = (character) => {
  // utiliza a função createElement para passar tag e classe html a ser criada com as cartas
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);

  card.setAttribute('data-character', character);

  return card;
};

/* Nesta função carregamos o jogo, criamos uma variavel que recebe todos os personagens duas vezes em um array com o spread operator para podermos possuir duas cartas de cada personagem. 

Em seguida criamos uma função para definir a aleatoriedade das cartas para não terem sempre a mesma posição, utilizamos a função sort para definir a ordem e passamos para a função a função Math.random para gerar um numero aleatorio para que sempre seja diferente as combinações
*/

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  Math.random();

  /* para cada personagem iremos criar um card, utilizando a função createCard que recebe como parametro um character, passamos como parametro todos os characters que colocamos no array no começo e colocamos dentro de grid.*/
  duplicateCharacters.forEach((characters) => {
    const card = createCard(characters);
    grid.appendChild(card);
  });
};

// inicia o contador de tempo do jogo.
const startTimer = () => {
  this.loop = setInterval(() => {
    const currentTime = +spanTimer.innerHTML;
    spanTimer.innerHTML = currentTime + 1;
  }, 1000);
};

// quando carregada a pagina pega o nome do jogador que está salvo no localStorage para mostrar no Header e tambem inicia as funções de timer e de loadGame.
window.onload = () => {
  const playerName = localStorage.getItem('player');

  spanPlayer.innerHTML = playerName;
  startTimer();
  loadGame();
};

// Criação do botão para exibir o modal.
const button = document.createElement('button');

button.innerHTML = 'Ver leaderboard';
button.className = 'btn-modal';
header.appendChild(button);

const modal = document.createElement('div');
modal.className = 'modal';
modal.style.display = 'none';
main.appendChild(modal);

// Criação da leaderboard
const leaderboard = document.createElement('table');
leaderboard.innerHTML = '<tr><th>Nome</th><th>Tempo (segundos)</th></tr>';
leaderboard.className = 'leaderboard';
modal.appendChild(leaderboard);

// fazemos um parse dos dados recebidos de localStorage e utilizamos || caso esteja vazio termos um array.
const players = JSON.parse(localStorage.getItem('players')) || [];
players.sort((a, b) => a.time - b.time);

// para cada player lido no localStorage é criado uma linha na tabela de leaderboard.
players.forEach((player) => {
  const row = document.createElement('tr');
  row.innerHTML = `<td>${player.name}</td><td>${player.time}</td>`;
  leaderboard.appendChild(row);
});

button.addEventListener('click', () => {
  if (modal.style.display === 'none') {
    modal.style.display = 'block';
  } else {
    modal.style.display = 'none';
  }
});
