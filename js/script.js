const animals = ["dog", "pig", "goat", "aligator", "cat", "rat", "shark", "tiger"];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let moves = 0;
let timer = null;
let seconds = 0;
let minutes = 0;
let isPaused = false;

/**
 * Cria o tabuleiro com cartas embaralhadas.
 */
function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    const duplicatedAnimals = [...animals, ...animals];
    const shuffledAnimals = duplicatedAnimals.sort(() => Math.random() - 0.5);
    

    shuffledAnimals.forEach((animal) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.animal = animal;

        const frontFace = document.createElement('div'); 
        frontFace.classList.add('front-face');
        frontFace.innerHTML =`<img src="assets/img/${animal}.png" alt="Verso da carta">`;


       
        
        // ${animal}
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.innerHTML = `<img src="assets/img/h.png" alt="Verso da carta">`;


        card.append(frontFace, backFace);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

/**
 * Função que vira uma carta.
 */
function flipCard() {
    if (lockBoard || isPaused || this === firstCard) return;

    this.classList.add('flip');
    moves++;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

/**
 * Verifica se as cartas são iguais.
 */
function checkForMatch() {
    const isMatch = firstCard.dataset.animal === secondCard.dataset.animal;
    isMatch ? disableCards() : unflipCards();
}

/**
 * Desabilita as cartas correspondentes.
 */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoardState();
    checkWinCondition();
}

/**
 * Desvira as cartas se não forem iguais.
 */
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoardState();
    }, 1000);
}

/**
 * Reseta o estado do tabuleiro.
 */
function resetBoardState() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

/**
 * Verifica se todas as cartas foram correspondidas.
 */
function checkWinCondition() {
    const flippedCards = document.querySelectorAll('.memory-card.flip');
    if (flippedCards.length === animals.length * 2) {
        endGame();
    }
}

/**
 * Inicia o temporizador.
 */
function startTimer() {
    timer = setInterval(() => {
        if (!isPaused) {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            document.getElementById('clock').textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }, 1000);
}

/**
 * Pausa ou retoma o jogo.
 */
function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = isPaused ? "Retomar" : "Pausar";

    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.opacity = isPaused ? '0.5' : '1';
}

/**
 * Encerra o jogo manualmente.
 */
 function endGameManually() {
    clearInterval(timer); // Para o temporizador
    document.getElementById('result').textContent = `Jogo encerrado manualmente. Seu tempo foi de ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}. Total de movimentos: ${moves}.`;
    document.getElementById('gameOver').style.display = 'flex';

    // Bloqueia todas as cartas para evitar interações
    document.querySelectorAll('.memory-card').forEach(card => {
        card.style.pointerEvents = 'none';
    });
}


/**
 * Reseta o jogo para o estado inicial.
 */
function resetGame() {
    clearInterval(timer);
    [hasFlippedCard, lockBoard, moves, seconds, minutes, isPaused] = [false, false, 0, 0, 0, false];
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('clock').textContent = '00:00';
    createBoard();
    startTimer();
}

/**
 * Configura os botões do jogo.
 */
function setupButtons() {
    const controls = document.getElementById('controls');
    controls.innerHTML = '';

    const resetButton = document.createElement('button');
    resetButton.textContent = "Novo Jogo";
    resetButton.classList.add('modern-btn');
    resetButton.addEventListener('click', resetGame);

    const pauseButton = document.createElement('button');
    pauseButton.id = "pauseButton";
    pauseButton.textContent = "Pausar";
    pauseButton.classList.add('modern-btn');
    pauseButton.addEventListener('click', togglePause);

    controls.append(resetButton, pauseButton);
}

/**
 * Inicia o jogo.
 */
function startGame() {
    createBoard();
    startTimer();
    setupButtons();
}

// Inicializa o jogo
startGame();
