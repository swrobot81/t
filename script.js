const problemCard = document.getElementById('problem-card');
const num1El = document.getElementById('num1');
const num2El = document.getElementById('num2');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const feedbackEl = document.getElementById('feedback');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const effectLayer = document.getElementById('effect-layer');

let score = 0;
let lives = 3;
let currentAnswer = 0;

// 게임 시작
function startGame() {
    score = 0;
    lives = 3;
    updateScoreBoard();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    nextProblem();
}

// 점수판 업데이트
function updateScoreBoard() {
    scoreEl.innerText = score;
    livesEl.innerText = '❤️'.repeat(lives);
}

// 새로운 문제 생성
function nextProblem() {
    const n1 = Math.floor(Math.random() * 8) + 2; // 2 ~ 9
    const n2 = Math.floor(Math.random() * 9) + 1; // 1 ~ 9
    currentAnswer = n1 * n2;

    num1El.innerText = n1;
    num2El.innerText = n2;
    feedbackEl.innerText = '';
    feedbackEl.className = 'feedback-msg';
    problemCard.className = 'problem-card'; // 클래스 초기화

    generateOptions(currentAnswer);
}

// 선택지 생성
function generateOptions(answer) {
    optionsEl.innerHTML = '';
    let choices = [answer];

    while (choices.length < 4) {
        let randomNum = (Math.floor(Math.random() * 9) + 1) * (Math.floor(Math.random() * 9) + 1);
        if (!choices.includes(randomNum)) {
            choices.push(randomNum);
        }
    }

    // 셔플
    choices.sort(() => Math.random() - 0.5);

    choices.forEach(val => {
        const btn = document.createElement('button');
        btn.innerText = val;
        btn.className = 'option-btn'; // 클래스 추가
        btn.addEventListener('click', () => checkAnswer(val));
        optionsEl.appendChild(btn);
    });
}

// 정답 체크
function checkAnswer(selected) {
    // 중복 클릭 방지 (이미 답을 선택했다면 무시)
    if (problemCard.classList.contains('correct') || problemCard.classList.contains('wrong')) return;

    if (selected === currentAnswer) {
        score += 10;
        feedbackEl.innerText = '축하합니다! 대폭발 팡파레~! 🎊🎇✨';
        feedbackEl.className = 'feedback-msg correct';
        problemCard.className = 'problem-card correct';
        updateScoreBoard();
        createFireworks(); // 폭죽 발사!
        setTimeout(nextProblem, 3000); // 3초로 연장
    } else {
        lives--;
        feedbackEl.innerText = '우아아앙! 너무 안타까워요!! 😭💢';
        feedbackEl.className = 'feedback-msg wrong';
        problemCard.className = 'problem-card wrong';
        updateScoreBoard();
        triggerFrustration(); // 좌절 효과!
        if (lives <= 0) {
            setTimeout(gameOver, 3000);
        } else {
            setTimeout(nextProblem, 3000);
        }
    }
}

// 전체 화면 폭죽 효과 로직
function createFireworks() {
    effectLayer.classList.remove('hidden');
    effectLayer.innerHTML = '';
    const emojis = ['🌟', '✨', '🎊', '🎇', '❤️', '🌈', '🔥'];

    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        // 무작위 방향 설정
        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 500;
        const tx = Math.cos(angle) * dist + 'px';
        const ty = Math.sin(angle) * dist + 'px';

        p.style.setProperty('--tx', tx);
        p.style.setProperty('--ty', ty);
        p.style.left = '50%';
        p.style.top = '50%';
        p.style.animation = `explode ${1 + Math.random() * 1.5}s ease-out forwards`;

        effectLayer.appendChild(p);
    }

    setTimeout(() => {
        effectLayer.classList.add('hidden');
        effectLayer.innerHTML = '';
    }, 3000);
}

// 전체 화면 좌절 효과 로직
function triggerFrustration() {
    document.body.classList.add('extreme-shake');
    effectLayer.classList.remove('hidden');
    effectLayer.innerHTML = '<div class="frustration-emoji">😭💢😭</div>';

    setTimeout(() => {
        document.body.classList.remove('extreme-shake');
        effectLayer.classList.add('hidden');
        effectLayer.innerHTML = '';
    }, 3000);
}

// 게임 종료
function gameOver() {
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
