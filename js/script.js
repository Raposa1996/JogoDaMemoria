const animals = ["dog", "car", "elephant", "pig", "aligator", "fish", "rat", "goat"]; // Lista de animais

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = null;
let seconds = 0;
let minutes = 0;

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

        card.innerHTML = `
            <div class="front-face">
                <img src="../assets/img/dog.png " alt="Imagem de ${animal}">
            </div>
            <div class="back-face">
                <img src="../assets/img/H.jfif" alt="Verso da carta">
            </div>
        `;

        // Adiciona evento de clique para virar a carta
        card.addEventListener('click', flipCard);

        // Adiciona a carta ao tabuleiro
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    // Previne interações enquanto o tabuleiro está bloqueado
    if (lockBoard || this.classList.contains('flip')) return;

    // Vira a carta
    this.classList.add('flip');

    // Se for a primeira carta, armazena
    if (!firstCard) {
        firstCard = this;
        return;
    }

    // Se for a segunda carta, verifica correspondência
    secondCard = this;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.animal === secondCard.dataset.animal;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // Desativa as cartas correspondentes
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Verifica se o jogo acabou
    if (document.querySelectorAll('.memory-card.flip').length === animals.length * 2) {
        endGame();
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        // Vira as cartas de volta
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
}

// Inicializa o jogo
startGame();
