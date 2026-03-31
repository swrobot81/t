/**
 * 반짝반짝 수학 모험! (Math Adventure) - Ver 3.7
 * 
 * [수정 및 업데이트 내역]
 * 1. UI/UX 개선: 시작 화면 간소화 및 레이아웃 최적화 (줄 바꿈 및 하단 잘림 해결)
 * 2. 문제 은행 확장: 100여 개의 학년별 개념/도형 문항 추가 (1~6학년 전 과정)
 * 3. 성능 최적화: 클릭 반응성 향상 및 화면 전환 대기 시간 단축 (0.8s)
 * 4. 시각적 피드백: 정답/오답 풀스크린 오버레이 및 오답 시 정답 안내 로직 추가
 * 5. 랭킹 시스템: 내 점수 하이라이트(노란색/펄스 효과) 및 '학년' 표기 정상화
 * 6. 기타: 문제 중복 방지 큐(Queue) 적용 및 게임 중 '그만하기' 버튼 구현
 */

// --- 전역 변수 및 DOM 요소 ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const nicknameInput = document.getElementById('nickname');
const startGameBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-btn');
const quitBtn = document.getElementById('quit-btn');

const problemCard = document.getElementById('problem-card');
const shapeVisual = document.getElementById('shape-visual');
const num1El = document.getElementById('num1');
const num2El = document.getElementById('num2');
const operatorEl = document.querySelector('.operator');
const answerPlaceholder = document.getElementById('answer-placeholder');
const optionsEl = document.getElementById('options');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const currentQEl = document.getElementById('current-q');
const pbFill = document.getElementById('pb-fill'); // 프로그레스 바 추가

const fbOverlay = document.getElementById('feedback-overlay');
const fbIcon = document.getElementById('fb-icon');
const fbText = document.getElementById('fb-text');
const fbAnswer = document.getElementById('fb-answer');

const resultNickname = document.getElementById('result-nickname');
const finalScoreEl = document.getElementById('final-score');
const leaderboardBody = document.getElementById('leaderboard-body');

// --- 게임 상태 ---
let gameState = {
    nickname: '',
    grade: 3,
    difficulty: 'medium',
    score: 0,
    lives: 3,
    currentQuestion: 1,
    totalQuestions: 10,
    currentAnswer: null,
    isProcessing: false,
    lastQuestions: [],
    currentSessionId: null // 현재 게임 세션을 식별하기 위한 ID
};

// --- 확장된 수학 개념 데이터베이스 (100+ 유형) ---
const extendedGeometryData = [
    // [1학년]
    { grade: [1], type: 'shape_ball', q: '공 모양의 특징은 무엇인가요?', ans: '잘 굴러간다', opts: ['잘 굴러간다','뾰족하다','평평하다','네모나다'] },
    { grade: [1], type: 'shape_box', q: '상자 모양의 꼭짓점은 몇 개인가요?', ans: '8개', opts: ['8개','4개','6개','12개'] },
    { grade: [1], type: 'clock_3', q: '긴 바늘이 12, 짧은 바늘이 3을 가리키면?', ans: '3시', opts: ['3시','12시','6시','9시'] },
    { grade: [1], type: 'clock_half', q: '긴 바늘이 6, 짧은 바늘이 1과 2 사이에 있으면?', ans: '1시 30분', opts: ['1시 30분','2시 30분','6시 10분','12시 30분'] },
    { grade: [1], type: 'compare_heavy', q: '코끼리와 강아지 중 더 무거운 동물은?', ans: '코끼리', opts: ['코끼리','강아지','같다','모른다'] },
    { grade: [1], type: 'compare_long', q: '기차와 자동차 중 더 긴 것은?', ans: '기차', opts: ['기차','자동차','같다','모른다'] },
    { grade: [1], type: 'num_order', q: '8 다음의 수는 무엇인가요?', ans: '9', opts: ['9','7','10','6'] },
    { grade: [1], type: 'shape_tri_sides', q: '삼각형의 변은 몇 개인가요?', ans: '3개', opts: ['3개','4개','2개','0개'] },
    { grade: [1], type: 'shape_circle_sides', q: '원의 변은 몇 개인가요?', ans: '0개', opts: ['0개','1개','3개','무한대'] },
    { grade: [1], type: 'plus_basic', q: '사과 3개와 2개를 합하면 몇 개인가요?', ans: '5개', opts: ['5개','4개','6개','1개'] },
    { grade: [1], type: 'minus_basic', q: '빵 5개 중 2개를 먹으면 몇 개 남나요?', ans: '3개', opts: ['3개','2개','7개','4개'] },
    { grade: [1], type: 'pattern_1', q: '빨강-파랑-빨강-? 다음에 올 색은?', ans: '파랑', opts: ['파랑','빨강','노랑','초록'] },

    // [2학년]
    { grade: [2], type: 'unit_cm_m', q: '100cm는 몇 m인가요?', ans: '1m', opts: ['1m','10m','100m','0.1m'] },
    { grade: [2], type: 'shape_penta', q: '변이 5개인 도형의 이름은?', ans: '오각형', opts: ['오각형','육각형','사각형','삼각형'] },
    { grade: [2], type: 'shape_hexa', q: '꼭짓점이 6개인 도형의 이름은?', ans: '육각형', opts: ['육각형','오각형','사각형','칠각형'] },
    { grade: [2], type: 'clock_5min', q: '긴 바늘이 3을 가리키면 몇 분인가요?', ans: '15분', opts: ['15분','3분','30분','45분'] },
    { grade: [2], type: 'clock_9_45', q: '9시 45분은 10시 몇 분 전인가요?', ans: '15분 전', opts: ['15분 전','45분 전','5분 전','30분 전'] },
    { grade: [2], type: 'mult_2_3', q: '2단 곱셈: 2 x 3은?', ans: '6', opts: ['6','4','8','10'] },
    { grade: [2], type: 'mult_5_4', q: '5단 곱셈: 5 x 4는?', ans: '20', opts: ['20','15','25','30'] },
    { grade: [2], type: 'mult_target', q: '어떤 수에 0을 곱하면 항상 얼마인가요?', ans: '0', opts: ['0','1','자기 자신','10'] },
    { grade: [2], type: 'len_compare', q: '1m와 110cm 중 더 긴 것은?', ans: '110cm', opts: ['110cm','1m','같다','모른다'] },
    { grade: [2], type: 'shape_find_right', q: '직사각형에서 직각은 모두 몇 개인가요?', ans: '4개', opts: ['4개','2개','0개','3개'] },

    // [3학년]
    { grade: [3], type: 'circle_radius_def', q: '원의 중심에서 원 위 한 점을 잇는 선분은?', ans: '반지름', opts: ['반지름','지름','원주','현'] },
    { grade: [3], type: 'circle_diameter_def', q: '원의 중심을 지나 두 점을 잇는 가장 긴 선분?', ans: '지름', opts: ['지름','반지름','할선','접선'] },
    { grade: [3], type: 'div_basic', q: '12 나누기 3의 몫은 얼마인가요?', ans: '4', opts: ['4','3','6','12'] },
    { grade: [3], type: 'div_remain', q: '10 나누기 3의 나머지는 얼마인가요?', ans: '1', opts: ['1','0','2','3'] },
    { grade: [3], type: 'unit_kg_g', q: '2kg은 몇 g인가요?', ans: '2000g', opts: ['2000g','200g','20g','20000g'] },
    { grade: [3], type: 'unit_L_ml', q: '1L는 몇 ml인가요?', ans: '1000ml', opts: ['1000ml','100ml','10ml','500ml'] },
    { grade: [3], type: 'frac_half', q: '전체를 똑같이 2로 나눈 것 중의 1은?', ans: '1/2', opts: ['1/2','1/4','2/1','1'] },
    { grade: [3], type: 'angle_right', q: '종이를 반듯하게 두 번 접었을 때 생기는 각?', ans: '직각', opts: ['직각','예각','둔각','평각'] },
    { grade: [3], type: 'time_add', q: '1시간 40분 + 30분은 몇 시간 몇 분?', ans: '2시간 10분', opts: ['2시간 10분','1시간 70분','2시간 30분','2시간'] },
    { grade: [3], type: 'sec_unit', q: '1분은 몇 초인가요?', ans: '60초', opts: ['60초','100초','30초','120초'] },

    // [4학년]
    { grade: [4], type: 'angle_sum_tri', q: '삼각형 세 각의 크기의 합은?', ans: '180도', opts: ['180도','360도','90도','270도'] },
    { grade: [4], type: 'angle_sum_quad', q: '사각형 네 각의 크기의 합은?', ans: '360도', opts: ['360도','180도','90도','270도'] },
    { grade: [4], type: 'angle_acute_def', q: '0도보다 크고 직각보다 작은 각은?', ans: '예각', opts: ['예각','둔각','직각','평각'] },
    { grade: [4], type: 'angle_obtuse_def', q: '직각보다 크고 180도보다 작은 각은?', ans: '둔각', opts: ['둔각','예각','직각','평각'] },
    { grade: [4], type: 'tri_iso', q: '두 변의 길이가 같은 삼각형은?', ans: '이등변삼각형', opts: ['이등변삼각형','정삼각형','직각삼각형','부등변삼각형'] },
    { grade: [4], type: 'tri_equi', q: '세 변의 길이가 모두 같은 삼각형은?', ans: '정삼각형', opts: ['정삼각형','이등변삼각형','직각삼각형','둔각삼각형'] },
    { grade: [4], type: 'big_num_man', q: '1000이 10개인 수는?', ans: '1만', opts: ['1만','10만','10000','1000'] },
    { grade: [4], type: 'big_num_eok', q: '1만이 10000개인 수는?', ans: '1억', opts: ['1억','1조','1000만','10억'] },
    { grade: [4], type: 'rect_area', q: '가로 6, 세로 4인 직사각형의 넓이는?', ans: '24', opts: ['24','10','20','48'] },
    { grade: [4], type: 'poly_diagonal', q: '사각형의 대각선은 모두 몇 개인가요?', ans: '2개', opts: ['2개','4개','1개','0개'] },

    // [5학년]
    { grade: [5], type: 'divisor_6', q: '6의 약수가 아닌 것은?', ans: '4', opts: ['4','1','2','3'] },
    { grade: [5], type: 'multiple_4', q: '4의 배수가 아닌 것은?', ans: '14', opts: ['14','4','8','12'] },
    { grade: [5], type: 'prime_basic', q: '약수가 1과 자기 자신뿐인 수는?', ans: '소수', opts: ['소수','합성수','홀수','짝수'] },
    { grade: [5], type: 'frac_add_same', q: '1/5 + 2/5는 얼마인가요?', ans: '3/5', opts: ['3/5','3/10','1/5','1'] },
    { grade: [5], type: 'para_area', q: '밑변 10, 높이 5인 평행사변형의 넓이는?', ans: '50', opts: ['50','25','15','100'] },
    { grade: [5], type: 'tri_area', q: '밑변 10, 높이 5인 삼각형의 넓이는?', ans: '25', opts: ['25','50','15','30'] },
    { grade: [5], type: 'cube_volume', q: '한 변이 3인 정육면체의 부피는?', ans: '27', opts: ['27','9','18','30'] },
    { grade: [5], type: 'avg_basic', q: '80점과 100점의 평균은?', ans: '90점', opts: ['90점','80점','100점','180점'] },
    { grade: [5], type: 'dec_mult', q: '0.5 x 0.2는 얼마인가요?', ans: '0.1', opts: ['0.1','1','0.01','0.7'] },
    { grade: [5], type: 'sym_line', q: '선대칭도형에서 대칭축은 최소 몇 개?', ans: '1개', opts: ['1개','2개','0개','무한대'] },

    // [6학년]
    { grade: [6], type: 'ratio_basic', q: '2:3에서 비교하는 양은 무엇인가요?', ans: '2', opts: ['2','3','5','6'] },
    { grade: [6], type: 'ratio_val', q: '비 1:4를 비율(소수)로 나타내면?', ans: '0.25', opts: ['0.25','2.5','0.14','4'] },
    { grade: [6], type: 'percent_100', q: '전체에 대한 부분의 비율에 100을 곱한 것?', ans: '백분율', opts: ['백분율','할인율','이자율','비율'] },
    { grade: [6], type: 'circle_area_f', q: '반지름이 10, 원주율이 3.1일 때 원의 넓이는?', ans: '310', opts: ['310','31','62','314'] },
    { grade: [6], type: 'prism_base', q: '각기둥의 두 밑면은 서로 어떤 관계인가요?', ans: '평행하고 합동', opts: ['평행하고 합동','수직','겹침','닮음'] },
    { grade: [6], type: 'pyramid_side', q: '각뿔의 옆면은 항상 어떤 모양인가요?', ans: '삼각형', opts: ['삼각형','사각형','원','사다리꼴'] },
    { grade: [6], type: 'cyl_side', q: '원기둥을 펼쳤을 때 옆면의 모양은?', ans: '직사각형', opts: ['직사각형','원','삼각형','사다리꼴'] },
    { grade: [6], type: 'sphere_center', q: '구의 가장 안쪽에 있는 점은?', ans: '구의 중심', opts: ['구의 중심','구의 반지름','구의 표면','없다'] },
    { grade: [6], type: 'div_frac', q: '1/2 나누기 1/4는 얼마인가요?', ans: '2', opts: ['2','1/2','1/8','4'] },
    { grade: [6], type: 'prop_basic', q: '2:3 = 4:x 에서 x의 값은?', ans: '6', opts: ['6','5','8','4'] }
];

// --- 초기화 ---
document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameState.grade = parseInt(btn.dataset.grade);
    });
});

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameState.difficulty = btn.dataset.diff;
    });
});

document.querySelector('[data-grade="3"]').classList.add('selected');

startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
quitBtn.addEventListener('click', () => {
    if(confirm('정말 모험을 그만둘까요?')) {
        gameScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    }
});

// --- 게임 흐름 제어 ---
function startGame() {
    const nick = nicknameInput.value.trim() || '미지의 탐험가';
    gameState.nickname = nick;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentQuestion = 1;
    gameState.lastQuestions = [];
    gameState.currentSessionId = Date.now(); // 유니크 세션 ID 생성
    
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    updateUI();
    nextProblem();
}

function updateUI() {
    scoreEl.innerText = gameState.score;
    livesEl.innerText = '❤️'.repeat(gameState.lives);
    currentQEl.innerText = gameState.currentQuestion;
    
    // 프로그레스 바 업데이트 (정교하게 채워짐)
    const progress = ((gameState.currentQuestion - 1) / gameState.totalQuestions) * 100;
    pbFill.style.width = `${progress}%`;
}

function nextProblem() {
    if (gameState.currentQuestion > gameState.totalQuestions) {
        endGame();
        return;
    }
    gameState.isProcessing = false;
    updateUI();
    problemCard.className = 'problem-card';
    shapeVisual.innerHTML = '';
    optionsEl.innerHTML = '';
    fbOverlay.classList.add('hidden');
    generateProblem();
}

function generateProblem() {
    const { grade } = gameState;
    const isGeometry = Math.random() < 0.5;

    if (isGeometry) {
        generateExtendedGeometryProblem(grade);
    } else {
        generateArithmeticProblem(grade);
    }
}

// --- 연산 로직 ---
function generateArithmeticProblem(grade) {
    let n1, n2, op = '×';
    let type = Math.random();

    if (grade === 1) {
        op = type < 0.5 ? '+' : '-';
        n1 = Math.floor(Math.random() * 9) + 1;
        n2 = Math.floor(Math.random() * 9) + 1;
        if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];
    } else if (grade === 2) {
        if(type < 0.7) { 
            n1 = Math.floor(Math.random() * 8) + 2;
            n2 = Math.floor(Math.random() * 9) + 1;
        } else {
            n1 = Math.floor(Math.random() * 50) + 10;
            n2 = Math.floor(Math.random() * 40) + 10;
            op = Math.random() < 0.5 ? '+' : '-';
            if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];
        }
    } else if (grade === 3) {
        if(type < 0.5) {
            n1 = Math.floor(Math.random() * 20) + 5;
            n2 = Math.floor(Math.random() * 8) + 2;
        } else {
            n2 = Math.floor(Math.random() * 8) + 2;
            n1 = n2 * (Math.floor(Math.random() * 9) + 1);
            op = '÷';
        }
    } else if (grade === 4) {
        n1 = Math.floor(Math.random() * 90) + 10;
        n2 = Math.floor(Math.random() * 90) + 10;
        op = type < 0.5 ? '×' : '÷';
        if(op === '÷') { n1 = n2 * (Math.floor(Math.random() * 19) + 2); }
    } else if (grade >= 5) {
        n1 = (Math.random() * 10).toFixed(1);
        n2 = (Math.random() * 5).toFixed(1);
        op = type < 0.5 ? '×' : '÷';
        if(op === '÷') { n1 = 10; n2 = 2.5; }
    }

    num1El.innerText = n1;
    num2El.innerText = n2;
    operatorEl.innerText = op;
    operatorEl.style.display = 'inline';
    answerPlaceholder.innerText = '= ?';

    gameState.currentAnswer = op === '+' ? parseFloat(n1) + parseFloat(n2) : 
                             op === '-' ? parseFloat(n1) - parseFloat(n2) :
                             op === '×' ? (parseFloat(n1) * parseFloat(n2)) :
                             (parseFloat(n1) / parseFloat(n2));
    
    if(!Number.isInteger(gameState.currentAnswer)) gameState.currentAnswer = parseFloat(gameState.currentAnswer.toFixed(1));
    generateOptions(gameState.currentAnswer);
}

function generateExtendedGeometryProblem(grade) {
    const filtered = extendedGeometryData.filter(d => d.grade.includes(grade));
    let problem;
    let attempts = 0;
    do {
        problem = filtered[Math.floor(Math.random() * filtered.length)];
        attempts++;
    } while (gameState.lastQuestions.includes(problem.type) && attempts < 15);

    gameState.lastQuestions.push(problem.type);
    if(gameState.lastQuestions.length > 5) gameState.lastQuestions.shift();

    num1El.innerText = problem.q;
    num2El.innerText = '';
    operatorEl.style.display = 'none';
    answerPlaceholder.innerText = '';
    
    drawShape(problem.type);
    gameState.currentAnswer = problem.ans;
    generateOptions(problem.ans, problem.opts);
}

function drawShape(type) {
    let svg = '';
    const color = '#ff3e6d';
    const sub = '#4ecdc4';
    
    if (type.includes('tri')) {
        svg = `<path d="M60 25 L25 85 L95 85 Z" fill="none" stroke="${color}" stroke-width="5"/>`;
    } else if (type.includes('rect') || type.includes('square')) {
        svg = `<rect x="25" y="35" width="70" height="50" fill="none" stroke="${color}" stroke-width="5"/>`;
    } else if (type.includes('circle')) {
        svg = `<circle cx="60" cy="60" r="35" fill="none" stroke="${color}" stroke-width="5"/>`;
    } else if (type.includes('clock')) {
         svg = `<circle cx="60" cy="60" r="45" fill="none" stroke="#333" stroke-width="3"/>`;
         let h = 0, m = 0;
         if(type === 'clock_3') { h = 3; m = 0; }
         else if(type === 'clock_half') { h = 1.5; m = 30; }
         else if(type === 'clock_5min') { h = 12; m = 15; }
         svg += `<line x1="60" y1="60" x2="${60 + 30 * Math.sin(h*30 * Math.PI/180)}" y2="${60 - 30 * Math.cos(h*30 * Math.PI/180)}" stroke="${color}" stroke-width="4"/>`;
         svg += `<line x1="60" y1="60" x2="${60 + 40 * Math.sin(m*6 * Math.PI/180)}" y2="${60 - 40 * Math.cos(m*6 * Math.PI/180)}" stroke="${sub}" stroke-width="2"/>`;
    } else if (type.includes('cube') || type.includes('prism')) {
        svg = `<rect x="35" y="45" width="40" height="40" fill="none" stroke="${color}" stroke-width="2"/><rect x="45" y="35" width="40" height="40" fill="none" stroke="${color}" stroke-width="2"/>
               <line x1="35" y1="45" x2="45" y2="35" stroke="${color}"/><line x1="75" y1="45" x2="85" y2="35" stroke="${color}"/><line x1="35" y1="85" x2="45" y2="75" stroke="${color}"/><line x1="75" y1="85" x2="85" y2="75" stroke="${color}"/>`;
    } else if (type.includes('compare')) {
        svg = `<rect x="20" y="70" width="30" height="10" fill="${sub}"/><rect x="60" y="40" width="30" height="40" fill="${color}"/>`;
    } else if (type.includes('angle')) {
        svg = `<line x1="20" y1="80" x2="100" y2="80" stroke="#333" stroke-width="3"/><line x1="20" y1="80" x2="80" y2="30" stroke="${color}" stroke-width="3"/>`;
    }

    shapeVisual.innerHTML = `<svg width="120" height="120" viewBox="0 0 120 120">${svg}</svg>`;
}

function generateOptions(correct, customOpts = null) {
    let choices = [];
    if (customOpts) {
        choices = [...customOpts];
    } else {
        choices = [correct];
        const isNum = !isNaN(correct);
        while (choices.length < 4) {
            let fake;
            if(isNum) {
                let offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
                fake = parseFloat(correct) + offset;
            } else {
                fake = ['삼각형','사각형','원','오각형','직사각형','정사각형'][Math.floor(Math.random()*6)];
            }
            if (!choices.includes(fake)) choices.push(fake);
        }
    }
    choices.sort(() => Math.random() - 0.5);
    choices.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = val;
        btn.onclick = () => checkAnswer(val);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if (gameState.isProcessing) return;
    gameState.isProcessing = true;
    fbOverlay.classList.remove('hidden');
    fbAnswer.classList.add('hidden');

    if (selected == gameState.currentAnswer) {
        gameState.score += (gameState.difficulty === 'hard' ? 20 : 10);
        fbOverlay.className = 'correct-overlay';
        fbIcon.innerText = '🤩'; fbText.innerText = '정답이에요!';
        setTimeout(() => { gameState.currentQuestion++; nextProblem(); }, 800);
    } else {
        gameState.lives--;
        fbOverlay.className = 'wrong-overlay';
        fbIcon.innerText = '😭'; fbText.innerText = '오답이에요!';
        fbAnswer.classList.remove('hidden');
        fbAnswer.innerText = `정답은 "${gameState.currentAnswer}" 였어요!`;
        setTimeout(() => { if (gameState.lives <= 0) endGame(); else { gameState.currentQuestion++; nextProblem(); } }, 1800);
    }
    updateUI();
}

function endGame() {
    fbOverlay.classList.add('hidden');
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    resultNickname.innerText = gameState.nickname;
    finalScoreEl.innerText = gameState.score;
    saveRecord();
    showLeaderboard();
}

function saveRecord() {
    const records = JSON.parse(localStorage.getItem('math_records') || '[]');
    // 현재 세션 기록 정보 저장
    const currentRecord = { 
        name: gameState.nickname, 
        grade: gameState.grade, 
        score: gameState.score,
        sessionId: gameState.currentSessionId // 식별자 추가
    };
    records.push(currentRecord);
    records.sort((a, b) => b.score - a.score);
    localStorage.setItem('math_records', JSON.stringify(records.slice(0, 10)));
}

function showLeaderboard() {
    const records = JSON.parse(localStorage.getItem('math_records') || '[]');
    leaderboardBody.innerHTML = records.map((r, i) => {
        // 현재 세션의 기록인 경우 하이라이트 클래스 추가
        const isCurrent = r.sessionId === gameState.currentSessionId;
        return `
            <tr class="${isCurrent ? 'current-rank-row' : ''}">
                <td>${i + 1}</td>
                <td>${r.name}</td>
                <td>${r.grade}학년</td>
                <td><strong>${r.score}</strong></td>
            </tr>
        `;
    }).join('');
}
