const animals = ["dog", "pig", "goat", "aligator", "car", "rat", "shark", "tiger"]; 

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = null;
let seconds = 0;
let minutes = 0;
let isPaused = false;

function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; // Limpa o tabuleiro anterior

    // Duplicando e embaralhando os animais
    const duplicatedAnimals = [...animals, ...animals];
    const shuffledAnimals = duplicatedAnimals.sort(() => Math.random() - 0.5);

    // Criando as cartas
    shuffledAnimals.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-animal', animal);

        // Corrigindo o caminho para usar apenas o formato .png
        card.innerHTML = `
            <div class="front-face">
                <img src="../assets/img/${animal}.png" alt="Imagem de ${animal}">
            </div>
            <div class="back-face">
                <img src="assets/img/H.jfif" alt="Verso da carta">
            </div>
        `;

        // Adiciona evento de clique para virar a carta
        card.addEventListener('click', flipCard);

        // Adiciona a carta ao tabuleiro
        gameBoard.appendChild(card);
    });
}

function setupButtons() {
    const controls = document.getElementById('controls');
    controls.innerHTML = ''; // Limpa os botões anteriores

    // Botão de jogar
    const playButton = document.createElement('button');
    playButton.textContent = "Jogar";
    playButton.classList.add('play-button', 'modern-btn');
    playButton.addEventListener('click', resetGame);
    controls.appendChild(playButton);

    // Botão de encerrar jogo
    const endGameButton = document.createElement('button');
    endGameButton.textContent = "Encerrar Jogo";
    endGameButton.classList.add('end-game-button', 'modern-btn');
    endGameButton.addEventListener('click', endGameManually);
    controls.appendChild(endGameButton);
}

function flipCard() {
    if (lockBoard || this.classList.contains('flip')) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.animal === secondCard.dataset.animal;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    if (document.querySelectorAll('.memory-card.flip').length === animals.length * 2) {
        endGame();
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        document.getElementById('clock').textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    document.getElementById('result').textContent = `Seu tempo foi de ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    document.getElementById('gameOver').style.display = 'flex';
}

function endGameManually() {
    clearInterval(timer);
    document.getElementById('result').textContent = `Jogo encerrado manualmente. Seu tempo foi de ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    document.getElementById('gameOver').style.display = 'flex';

    // Bloqueia todas as cartas
    document.querySelectorAll('.memory-card').forEach(card => {
        card.style.pointerEvents = 'none';
    });
}

function resetGame() {
    document.getElementById('gameOver').style.display = 'none';
    moves = 0;
    seconds = 0;
    minutes = 0;
    document.getElementById('clock').textContent = '00:00';
    clearInterval(timer);
    startGame();
}

function startGame() {
    createBoard();
    startTimer();
    setupButtons(); // Configura os botões na interface
}

// Inicializa o jogo
startGame();
