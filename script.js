const problemCard = document.getElementById('problem-card');
const num1El = document.getElementById('num1');
const num2El = document.getElementById('num2');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const feedbackEl = document.getElementById('feedback');
const menuScreen = document.getElementById('menu-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const effectLayer = document.getElementById('effect-layer');
const gameProgress = document.getElementById('game-progress');
const currentQEl = document.getElementById('current-q');
const shapeVisual = document.getElementById('shape-visual');

let score = 0;
let lives = 3;
let currentAnswer = 0;
let currentGameMode = 'gugudan';
let currentQuestionNum = 0;
const TOTAL_QUESTIONS = 10;

// ======================================
// 초3 도형 문제 데이터베이스 (200개)
// 킹수학닷컴 및 3학년 교과서 참고
// ======================================
const shapeProblems = [
  // === 직각 ===
  { type:"right_angle", q1:"90도 각을", q2:"무엇이라고 하나요?", ans:"직각", options:["직각","예각","둔각","평각"] },
  { type:"right_angle", q1:"직각은 몇 도인가요?", q2:"", ans:"90도", options:["90도","45도","180도","60도"] },
  { type:"right_angle", q1:"직각보다 작은 각을", q2:"무엇이라고 하나요?", ans:"예각", options:["예각","둔각","직각","평각"] },
  { type:"right_angle", q1:"직각보다 큰 각을", q2:"무엇이라고 하나요?", ans:"둔각", options:["둔각","예각","직각","평각"] },
  { type:"right_angle", q1:"이 표시(□)는 각도가", q2:"몇 도임을 나타내나요?", ans:"90도", options:["90도","0도","180도","45도"] },
  { type:"right_angle", q1:"60도 각은 어떤 각인가요?", q2:"", ans:"예각", options:["예각","직각","둔각","평각"] },
  { type:"right_angle", q1:"120도 각은 어떤 각인가요?", q2:"", ans:"둔각", options:["둔각","예각","직각","평각"] },
  { type:"right_angle", q1:"180도 각은 어떤 각인가요?", q2:"", ans:"평각", options:["평각","직각","예각","둔각"] },
  { type:"right_angle", q1:"직각을 그릴 때 사용하는", q2:"도구는?", ans:"삼각자", options:["삼각자","컴퍼스","자","각도기"] },
  { type:"right_angle", q1:"30도 각과 60도 각은", q2:"모두 어떤 각인가요?", ans:"예각", options:["예각","둔각","직각","평각"] },
  { type:"right_angle", q1:"직각 2개를 합치면", q2:"몇 도인가요?", ans:"180도", options:["180도","90도","270도","360도"] },
  { type:"right_angle", q1:"직각 4개를 합치면", q2:"몇 도인가요?", ans:"360도", options:["360도","180도","90도","270도"] },

  // === 직각삼각형 ===
  { type:"right_triangle", q1:"한 각이 직각인 삼각형을", q2:"무엇이라고 하나요?", ans:"직각삼각형", options:["직각삼각형","정삼각형","이등변삼각형","둔각삼각형"] },
  { type:"right_triangle", q1:"직각삼각형의 직각은", q2:"몇 개인가요?", ans:"1개", options:["1개","2개","3개","0개"] },
  { type:"right_triangle", q1:"직각삼각형에서 직각을", q2:"끼고 있는 두 변을?", ans:"두 밑변", options:["두 밑변","두 등변","빗변","꼭짓점"] },
  { type:"right_triangle", q1:"직각삼각형에서 가장 긴", q2:"변을 무엇이라 하나요?", ans:"빗변", options:["빗변","밑변","높이","꼭짓점"] },
  { type:"right_triangle", q1:"직각삼각형의 세 각의", q2:"합은 몇 도인가요?", ans:"180도", options:["180도","360도","90도","270도"] },
  { type:"right_triangle", q1:"삼각자에 있는 직각삼각형의", q2:"직각은 어디에 있나요?", ans:"모서리", options:["모서리","꼭짓점","빗변","밑변"] },
  { type:"right_triangle", q1:"직각삼각형도 삼각형이므로", q2:"변의 수는?", ans:"3개", options:["3개","4개","2개","5개"] },
  { type:"right_triangle", q1:"만약 삼각형에 둔각이 있다면", q2:"직각삼각형인가요?", ans:"아니요", options:["아니요","예","알 수 없다","변경된다"] },

  // === 직사각형 ===
  { type:"rectangle", q1:"네 각이 모두 직각인", q2:"사각형은?", ans:"직사각형", options:["직사각형","사다리꼴","마름모","평행사변형"] },
  { type:"rectangle", q1:"직사각형의 마주보는 두 변은", q2:"서로 어떤 관계인가요?", ans:"같다", options:["같다","다르다","수직이다","평행하다"] },
  { type:"rectangle", q1:"직사각형의 네 각은 모두", q2:"몇 도인가요?", ans:"90도", options:["90도","45도","60도","180도"] },
  { type:"rectangle", q1:"직사각형의 각의 수는?", q2:"", ans:"4개", options:["4개","3개","5개","6개"] },
  { type:"rectangle", q1:"직사각형은 정사각형인가요?", q2:"", ans:"아닐 수도 있다", options:["아닐 수도 있다","항상 그렇다","절대 아니다","같은 도형이다"] },
  { type:"rectangle", q1:"직사각형의 네 변 중", q2:"같은 길이의 변은?", ans:"마주보는 두 쌍", options:["마주보는 두 쌍","모든 변","인접한 두 변","하나도 없다"] },
  { type:"rectangle", q1:"직사각형의 대각선은 몇 개?", q2:"", ans:"2개", options:["2개","1개","3개","4개"] },
  { type:"rectangle", q1:"직사각형의 네 각의 합은?", q2:"", ans:"360도", options:["360도","180도","270도","90도"] },
  { type:"rectangle", q1:"책, 공책은 어떤 도형 모양?", q2:"", ans:"직사각형", options:["직사각형","정사각형","원","삼각형"] },
  { type:"rectangle", q1:"직사각형에서 이웃한 두 변의", q2:"길이는?", ans:"서로 다를 수 있다", options:["서로 다를 수 있다","항상 같다","항상 다르다","알 수 없다"] },
  { type:"rectangle", q1:"직사각형에서 짧은 변을", q2:"무엇이라 하나요?", ans:"폭(너비)", options:["폭(너비)","길이","빗변","둘레"] },

  // === 정사각형 ===
  { type:"square", q1:"네 변의 길이와 네 각이", q2:"모두 같은 사각형은?", ans:"정사각형", options:["정사각형","직사각형","마름모","사다리꼴"] },
  { type:"square", q1:"정사각형의 한 각은", q2:"몇 도인가요?", ans:"90도", options:["90도","60도","45도","120도"] },
  { type:"square", q1:"정사각형은 직사각형인가요?", q2:"", ans:"예", options:["예","아니요","알 수 없다","다를 때도 있다"] },
  { type:"square", q1:"정사각형의 네 변은 모두", q2:"어떤 관계인가요?", ans:"길이가 같다", options:["길이가 같다","길이가 다르다","수직이다","평행하다"] },
  { type:"square", q1:"정사각형의 변의 수는?", q2:"", ans:"4개", options:["4개","3개","5개","8개"] },
  { type:"square", q1:"손수건, 타일은 어떤", q2:"도형 모양인가요?", ans:"정사각형", options:["정사각형","직사각형","원","삼각형"] },
  { type:"square", q1:"정사각형과 직사각형의", q2:"같은 점은?", ans:"네 각이 직각", options:["네 각이 직각","네 변이 같다","평행사변형","마름모"] },
  { type:"square", q1:"정사각형의 대각선은 몇 개?", q2:"", ans:"2개", options:["2개","1개","3개","4개"] },
  { type:"square", q1:"정사각형의 네 각의 합은?", q2:"", ans:"360도", options:["360도","90도","180도","270도"] },
  { type:"square", q1:"정사각형의 한 변 길이가 5cm면", q2:"둘레는?", ans:"20cm", options:["20cm","10cm","15cm","25cm"] },
  { type:"square", q1:"정사각형과 마름모의", q2:"차이점은?", ans:"네 각이 직각인지", options:["네 각이 직각인지","변의 수","대각선 수","꼭짓점 수"] },

  // === 원의 구성요소 ===
  { type:"circle_center", q1:"원의 가장 가운데 점을", q2:"무엇이라 하나요?", ans:"중심", options:["중심","반지름","지름","원주"] },
  { type:"circle_center", q1:"원의 중심은 몇 개인가요?", q2:"", ans:"1개", options:["1개","2개","3개","없다"] },
  { type:"circle_radius", q1:"원의 중심에서 원 위의", q2:"한 점까지의 선분은?", ans:"반지름", options:["반지름","지름","중심","원주"] },
  { type:"circle_radius", q1:"같은 원에서 반지름은", q2:"모두 같나요?", ans:"예", options:["예","아니요","하나만 같다","알 수 없다"] },
  { type:"circle_diameter", q1:"원의 중심을 지나는", q2:"가장 긴 선분은?", ans:"지름", options:["지름","반지름","원주","중심"] },
  { type:"circle_diameter", q1:"원의 지름은 반지름의", q2:"몇 배인가요?", ans:"2배", options:["2배","3배","4배","1배"] },
  { type:"circle_diameter", q1:"반지름이 3cm이면", q2:"지름은 몇 cm인가요?", ans:"6cm", options:["6cm","3cm","9cm","12cm"] },
  { type:"circle_diameter", q1:"지름이 10cm이면", q2:"반지름은 몇 cm인가요?", ans:"5cm", options:["5cm","10cm","2cm","20cm"] },
  { type:"circle_center", q1:"원을 그릴 때 중심을", q2:"고정하는 도구는?", ans:"컴퍼스", options:["컴퍼스","자","삼각자","각도기"] },
  { type:"circle_diameter", q1:"원의 지름은 원 위의 두 점을", q2:"어떻게 잇나요?", ans:"중심을 지나게", options:["중심을 지나게","끝을 이어","가장자리로","임의로"] },
  { type:"circle_center", q1:"원의 중심은 원 안에", q2:"있나요, 원 위에 있나요?", ans:"원 안에", options:["원 안에","원 위에","원 밖에","없다"] },
  { type:"circle_radius", q1:"반지름이 4cm이면", q2:"같은 원의 다른 반지름도?", ans:"4cm", options:["4cm","2cm","8cm","6cm"] },
  { type:"circle_diameter", q1:"원의 지름은 원 위의", q2:"두 점을 꼭 지나야 하나요?", ans:"예(중심도)", options:["예(중심도)","아니요","중심만","임의로"] },
  { type:"circle_center", q1:"컴퍼스로 원을 그릴 때", q2:"중심이 되는 곳은?", ans:"컴퍼스 침이 꽂힌 곳", options:["컴퍼스 침이 꽂힌 곳","연필 끝","손잡이","바깥쪽"] },
  { type:"circle_radius", q1:"원에서 반지름이 여러 개일 때", q2:"길이는 모두 어떤가요?", ans:"같다", options:["같다","다르다","2배씩 늘어난다","반씩 줄어든다"] },

  // === 선분 ===
  { type:"line_segment", q1:"두 점을 곧게 이은 선을", q2:"무엇이라 하나요?", ans:"선분", options:["선분","직선","반직선","곡선"] },
  { type:"line_segment", q1:"선분은 양쪽에 끝이", q2:"있나요?", ans:"예, 양쪽 다", options:["예, 양쪽 다","아니요","한쪽만","없다"] },
  { type:"line_segment", q1:"선분 AB와 선분 BA는", q2:"같은 선분인가요?", ans:"예", options:["예","아니요","다를 수도","항상 다르다"] },
  { type:"line_segment", q1:"선분의 길이는 잴 수", q2:"있나요?", ans:"예", options:["예","아니요","때에 따라","알 수 없다"] },
  { type:"line_segment", q1:"선분과 직선의 차이는?", q2:"", ans:"선분은 끝이 있다", options:["선분은 끝이 있다","선분이 더 길다","직선이 짧다","같은 것이다"] },
  { type:"line_segment", q1:"삼각형의 세 변은 모두", q2:"무엇으로 이루어지나요?", ans:"선분", options:["선분","직선","반직선","곡선"] },
  { type:"line_segment", q1:"선분을 양쪽으로 끝없이", q2:"늘이면 무엇이 되나요?", ans:"직선", options:["직선","반직선","곡선","ray"] },

  // === 반직선 ===
  { type:"ray", q1:"한 점에서 한쪽으로만", q2:"끝없이 늘인 곧은 선은?", ans:"반직선", options:["반직선","선분","직선","곡선"] },
  { type:"ray", q1:"반직선은 시작점이", q2:"있나요?", ans:"예", options:["예","아니요","때에 따라","없다"] },
  { type:"ray", q1:"반직선은 한쪽 끝이", q2:"있나요?", ans:"아니요(무한)", options:["아니요(무한)","예","항상 있다","2개있다"] },
  { type:"ray", q1:"반직선 AB에서 처음 시작하는", q2:"점은 어느 것인가요?", ans:"A", options:["A","B","중간점","없다"] },
  { type:"ray", q1:"반직선은 길이를 잴 수", q2:"있나요?", ans:"아니요", options:["아니요","예","부분만 가능","언제나"] },

  // === 직선 ===
  { type:"straight_line", q1:"양쪽으로 끝없이 늘인", q2:"곧은 선을 무엇이라 하나요?", ans:"직선", options:["직선","선분","반직선","곡선"] },
  { type:"straight_line", q1:"직선은 몇 개의 끝점을", q2:"가지고 있나요?", ans:"0개(없음)", options:["0개(없음)","1개","2개","무수히 많이"] },
  { type:"straight_line", q1:"직선의 길이는 잴 수", q2:"있나요?", ans:"아니요", options:["아니요","예","반만 가능","부분적으로"] },
  { type:"straight_line", q1:"직선은 선분을 늘려서", q2:"만들 수 있나요?", ans:"예", options:["예","아니요","때에 따라","어렵다"] },
  { type:"straight_line", q1:"두 점을 지나는 직선은", q2:"몇 개인가요?", ans:"1개", options:["1개","2개","3개","무수히"] },

  // === 각의 구성 ===
  { type:"angle", q1:"한 점에서 그은 두 반직선으로", q2:"이루어진 도형은?", ans:"각", options:["각","선분","꼭짓점","변"] },
  { type:"angle", q1:"각에서 두 반직선이 만나는", q2:"점을 무엇이라 하나요?", ans:"꼭짓점", options:["꼭짓점","변","각도","원점"] },
  { type:"angle", q1:"각을 이루는 두 반직선을", q2:"무엇이라 하나요?", ans:"변", options:["변","꼭짓점","직선","선분"] },
  { type:"angle_parts", q1:"각의 두 변이 이루는", q2:"크기를 무엇이라 하나요?", ans:"각도", options:["각도","길이","폭","넓이"] },
  { type:"angle_parts", q1:"각도를 재는 도구는?", q2:"", ans:"각도기", options:["각도기","자","컴퍼스","삼각자"] },
  { type:"angle", q1:"꼭짓점이 1개인 도형은", q2:"각 외에 무엇이 있나요?", ans:"삼각형", options:["삼각형","원","직선","선분"] },
  { type:"angle_parts", q1:"각도기에서 0도 ~ 180도까지", q2:"재는 눈금은?", ans:"1~180도", options:["1~180도","0~90도","0~360도","1~100도"] },

  // === 삼각형 종류 ===
  { type:"right_triangle", q1:"세 변의 길이가 모두 같은", q2:"삼각형은?", ans:"정삼각형", options:["정삼각형","이등변삼각형","직각삼각형","둔각삼각형"] },
  { type:"right_triangle", q1:"두 변의 길이가 같은", q2:"삼각형은?", ans:"이등변삼각형", options:["이등변삼각형","정삼각형","직각삼각형","둔각삼각형"] },
  { type:"right_triangle", q1:"정삼각형의 세 각은 모두", q2:"몇 도인가요?", ans:"60도", options:["60도","90도","45도","120도"] },
  { type:"right_triangle", q1:"삼각형의 세 각의 합은", q2:"항상 몇 도인가요?", ans:"180도", options:["180도","360도","90도","270도"] },
  { type:"right_triangle", q1:"삼각형의 변의 수는?", q2:"", ans:"3개", options:["3개","4개","5개","2개"] },
  { type:"right_triangle", q1:"삼각형의 꼭짓점은", q2:"몇 개인가요?", ans:"3개", options:["3개","4개","2개","5개"] },
  { type:"right_triangle", q1:"삼각형에서 세 각이 모두", q2:"예각이면?", ans:"예각삼각형", options:["예각삼각형","직각삼각형","둔각삼각형","정삼각형"] },

  // === 사각형의 종류 ===
  { type:"rectangle", q1:"두 쌍의 마주보는 변이", q2:"평행한 사각형은?", ans:"평행사변형", options:["평행사변형","사다리꼴","마름모","정사각형"] },
  { type:"square", q1:"네 변이 모두 같은 사각형은?", q2:"(직각이 아님)", ans:"마름모", options:["마름모","정사각형","직사각형","사다리꼴"] },
  { type:"rectangle", q1:"마주보는 한 쌍의 변만", q2:"평행한 사각형은?", ans:"사다리꼴", options:["사다리꼴","평행사변형","마름모","직사각형"] },
  { type:"rectangle", q1:"사각형의 변의 수는?", q2:"", ans:"4개", options:["4개","3개","5개","6개"] },
  { type:"rectangle", q1:"사각형의 꼭짓점은 몇 개?", q2:"", ans:"4개", options:["4개","3개","5개","2개"] },
  { type:"rectangle", q1:"사각형의 네 각의 합은?", q2:"", ans:"360도", options:["360도","180도","270도","90도"] },
  { type:"square", q1:"마름모의 네 변은 서로", q2:"어떤 관계인가요?", ans:"모두 같다", options:["모두 같다","모두 다르다","두 쌍이 같다","알 수 없다"] },
  { type:"rectangle", q1:"사다리꼴에서 평행한 두 변을", q2:"무엇이라 하나요?", ans:"윗변과 아랫변", options:["윗변과 아랫변","높이","대각선","꼭짓점"] },
  { type:"rectangle", q1:"평행사변형에서 마주보는", q2:"두 쌍의 변의 관계는?", ans:"길이가 같고 평행", options:["길이가 같고 평행","수직","모두 다르다","하나만 같다"] },
  { type:"square", q1:"마름모와 정사각형의", q2:"공통점은?", ans:"네 변이 같다", options:["네 변이 같다","네 각이 직각","대각선이 같다","둘레가 같다"] },

  // === 원 심화 ===
  { type:"circle_center", q1:"원을 그릴 때 컴퍼스의", q2:"침을 꽂는 곳은?", ans:"중심", options:["중심","원 위","원 밖","아무 곳"] },
  { type:"circle_radius", q1:"컴퍼스를 벌린 너비가", q2:"원의 무엇이 되나요?", ans:"반지름", options:["반지름","지름","중심","둘레"] },
  { type:"circle_diameter", q1:"지름이 14cm인 원의", q2:"반지름은?", ans:"7cm", options:["7cm","14cm","28cm","3.5cm"] },
  { type:"circle_diameter", q1:"반지름이 6cm인 원의", q2:"지름은?", ans:"12cm", options:["12cm","6cm","3cm","18cm"] },
  { type:"circle_center", q1:"같은 원에서 모든 반지름의", q2:"길이는?", ans:"모두 같다", options:["모두 같다","모두 다르다","두 배씩 커진다","반씩 줄어든다"] },
  { type:"circle_diameter", q1:"원의 지름이 원 안에서", q2:"제일 긴 이유는?", ans:"중심을 지나기 때문", options:["중심을 지나기 때문","가장 멀기 때문","지름이 정의라서","원주이기 때문"] },
  { type:"circle_radius", q1:"반지름이 1cm인 원이 있다면", q2:"지름은 몇 cm인가요?", ans:"2cm", options:["2cm","1cm","3cm","4cm"] },
  { type:"circle_center", q1:"원에서 중심, 반지름, 지름 중", q2:"가장 긴 것은?", ans:"지름", options:["지름","반지름","중심","같다"] },
  { type:"circle_diameter", q1:"반지름이 9cm라면", q2:"지름은 몇 cm인가요?", ans:"18cm", options:["18cm","9cm","4.5cm","27cm"] },
  { type:"circle_diameter", q1:"지름이 8cm인 원의", q2:"반지름은?", ans:"4cm", options:["4cm","8cm","16cm","2cm"] },

  // === 선분·반직선·직선 구별 ===
  { type:"line_segment", q1:"끝점이 두 개인 선은?", q2:"", ans:"선분", options:["선분","직선","반직선","곡선"] },
  { type:"ray", q1:"끝점이 하나인 선은?", q2:"", ans:"반직선", options:["반직선","선분","직선","곡선"] },
  { type:"straight_line", q1:"끝점이 없는 선은?", q2:"", ans:"직선", options:["직선","선분","반직선","꺾은선"] },
  { type:"line_segment", q1:"길이를 잴 수 있는 선은?", q2:"", ans:"선분", options:["선분","직선","반직선","모두 가능"] },
  { type:"straight_line", q1:"직선과 선분의 차이점은?", q2:"", ans:"끝점 유무", options:["끝점 유무","두께 차이","색깔 차이","방향 차이"] },
  { type:"ray", q1:"반직선을 두 개 합치면", q2:"직선이 될 수 있나요?", ans:"예(반대방향이면)", options:["예(반대방향이면)","아니요","언제나","불가능"] },

  // === 도형의 특징 종합 ===
  { type:"right_angle", q1:"직각삼각형에는 직각이", q2:"반드시 있어야 하나요?", ans:"예", options:["예","아니요","하나 이상","없어도 된다"] },
  { type:"rectangle", q1:"직사각형과 정사각형 중에서", q2:"더 특수한 도형은?", ans:"정사각형", options:["정사각형","직사각형","같다","없다"] },
  { type:"square", q1:"정사각형은 마름모인가요?", q2:"", ans:"예", options:["예","아니요","때에 따라","다른 도형"] },
  { type:"circle_center", q1:"원에는 꼭짓점이", q2:"몇 개 있나요?", ans:"없다", options:["없다","1개","무수히 많다","4개"] },
  { type:"right_triangle", q1:"직각삼각형은 이등변삼각형이", q2:"될 수 있나요?", ans:"예", options:["예","아니요","불가능","항상 아니다"] },
  { type:"rectangle", q1:"직사각형의 네 꼭짓점은", q2:"모두 맞꼭지각이 있나요?", ans:"예", options:["예","아니요","2개만","하나만"] },
  { type:"square", q1:"정사각형의 네 변의 합을", q2:"무엇이라 하나요?", ans:"둘레", options:["둘레","넓이","높이","지름"] },
  { type:"angle", q1:"삼각형의 내각의 합은?", q2:"", ans:"180도", options:["180도","90도","360도","270도"] },
  { type:"angle", q1:"사각형의 내각의 합은?", q2:"", ans:"360도", options:["360도","180도","90도","270도"] },
  { type:"circle_diameter", q1:"원의 지름은 원을", q2:"몇 등분 하나요?", ans:"2등분", options:["2등분","3등분","4등분","알 수 없다"] },

  // === 생활 속 도형 ===
  { type:"circle_center", q1:"시계는 어떤 도형 모양?", q2:"", ans:"원", options:["원","직사각형","정사각형","삼각형"] },
  { type:"square", q1:"주사위 한 면은 어떤 도형?", q2:"", ans:"정사각형", options:["정사각형","직사각형","원","마름모"] },
  { type:"rectangle", q1:"칠판은 어떤 도형 모양?", q2:"", ans:"직사각형", options:["직사각형","정사각형","사다리꼴","평행사변형"] },
  { type:"right_triangle", q1:"삼각형 모양 표지판에는", q2:"꼭짓점이 몇 개인가요?", ans:"3개", options:["3개","4개","2개","많다"] },
  { type:"circle_center", q1:"동전은 어떤 도형 모양?", q2:"", ans:"원", options:["원","사각형","삼각형","마름모"] },
  { type:"square", q1:"바둑판 한 칸은 어떤 도형?", q2:"", ans:"정사각형", options:["정사각형","직사각형","원","마름모"] },
  { type:"rectangle", q1:"문(door)은 어떤 도형?", q2:"", ans:"직사각형", options:["직사각형","정사각형","원","사다리꼴"] },
  { type:"right_triangle", q1:"종이접기로 대각선을 접으면", q2:"어떤 도형이 생기나요?", ans:"직각삼각형", options:["직각삼각형","정삼각형","이등변삼각형","둔각삼각형"] },
  { type:"circle_diameter", q1:"피자를 반으로 나누는 선은", q2:"원의 무엇과 같나요?", ans:"지름", options:["지름","반지름","중심","원주"] },
  { type:"square", q1:"체스판을 이루는 한 칸은?", q2:"", ans:"정사각형", options:["정사각형","직사각형","원","마름모"] },

  // === 도형의 이동 ===
  { type:"rectangle", q1:"도형을 밀어도 모양과", q2:"크기가 변하나요?", ans:"변하지 않는다", options:["변하지 않는다","크기만 변한다","모양만 변한다","둘 다 변한다"] },
  { type:"rectangle", q1:"도형을 뒤집어도 모양과", q2:"크기는 어떻게 되나요?", ans:"변하지 않는다", options:["변하지 않는다","크기만 변한다","모양이 반대된다","둘 다 변한다"] },
  { type:"square", q1:"정사각형을 90도 돌리면", q2:"어떤 도형이 되나요?", ans:"정사각형", options:["정사각형","직사각형","마름모","다른 도형"] },
  { type:"rectangle", q1:"직사각형을 180도 돌리면?", q2:"", ans:"직사각형", options:["직사각형","정사각형","사다리꼴","바뀐다"] },

  // === 둘레와 넓이 기초 ===
  { type:"square", q1:"정사각형 한 변이 3cm이면", q2:"둘레는 몇 cm인가요?", ans:"12cm", options:["12cm","9cm","6cm","15cm"] },
  { type:"rectangle", q1:"직사각형 가로 4cm, 세로 3cm", q2:"이면 둘레는?", ans:"14cm", options:["14cm","12cm","7cm","24cm"] },
  { type:"square", q1:"정사각형 한 변이 2cm이면", q2:"넓이는 몇 cm²인가요?", ans:"4cm²", options:["4cm²","8cm²","2cm²","16cm²"] },
  { type:"rectangle", q1:"직사각형 가로 5cm, 세로 2cm", q2:"이면 넓이는?", ans:"10cm²", options:["10cm²","14cm²","7cm²","25cm²"] },
  { type:"square", q1:"정사각형의 둘레가 20cm면", q2:"한 변의 길이는?", ans:"5cm", options:["5cm","4cm","10cm","20cm"] },
  { type:"rectangle", q1:"가로와 세로가 같은 직사각형은", q2:"어떤 사각형인가요?", ans:"정사각형", options:["정사각형","마름모","사다리꼴","평행사변형"] },

  // === 선분 길이 ===
  { type:"line_segment", q1:"선분 AB가 4cm, BC가 3cm이면", q2:"A에서 C까지 선분의 길이는?", ans:"7cm", options:["7cm","4cm","3cm","12cm"] },
  { type:"line_segment", q1:"선분의 중점이란?", q2:"", ans:"선분을 둘로 나누는 점", options:["선분을 둘로 나누는 점","선분의 끝점","선분의 시작점","선분 밖의 점"] },

  // === 도형 심화 ===
  { type:"right_angle", q1:"직각이 있는 삼각형은?", q2:"", ans:"직각삼각형", options:["직각삼각형","예각삼각형","둔각삼각형","이등변삼각형"] },
  { type:"right_angle", q1:"직각이 있는 사각형은?", q2:"(두 가지)", ans:"직사각형, 정사각형", options:["직사각형, 정사각형","마름모, 사다리꼴","평행사변형, 마름모","사다리꼴, 직사각형"] },
  { type:"rectangle", q1:"평행사변형에서 이웃한 두 각의", q2:"합은?", ans:"180도", options:["180도","90도","360도","270도"] },
  { type:"square", q1:"정사각형은 어떤 도형들의", q2:"특별한 경우인가요?", ans:"직사각형과 마름모", options:["직사각형과 마름모","사다리꼴과 마름모","평행사변형과 마름모","원과 삼각형"] },

  // === 도형 수 세기 ===
  { type:"rectangle", q1:"직사각형의 대각선 길이는", q2:"서로 어떤가요?", ans:"같다", options:["같다","다르다","하나가 더 길다","재는 방법마다 다르다"] },
  { type:"square", q1:"정사각형의 대각선 길이는", q2:"서로 어떤가요?", ans:"같다", options:["같다","다르다","수직이다","하나가 길다"] },
  { type:"right_triangle", q1:"직각삼각형의 대각선은", q2:"몇 개인가요?", ans:"0개(삼각형엔 없음)", options:["0개(삼각형엔 없음)","1개","2개","3개"] },
  { type:"circle_center", q1:"원의 대각선은 몇 개인가요?", q2:"", ans:"없다(원은 사각형 아님)", options:["없다(원은 사각형 아님)","1개","2개","무수히"] },

  // === 복합 문제 ===
  { type:"rectangle", q1:"직사각형 안에 대각선을 그으면", q2:"생기는 도형은?", ans:"직각삼각형", options:["직각삼각형","이등변삼각형","정삼각형","둔각삼각형"] },
  { type:"square", q1:"정사각형 안에 대각선을 그으면", q2:"생기는 삼각형은?", ans:"직각이등변삼각형", options:["직각이등변삼각형","정삼각형","이등변삼각형","둔각삼각형"] },
  { type:"right_angle", q1:"삼각자의 직각 부분은 몇 도?", q2:"", ans:"90도", options:["90도","45도","60도","30도"] },
  { type:"right_triangle", q1:"30-60-90 삼각형에서", q2:"큰 각은 몇 도인가요?", ans:"90도", options:["90도","60도","30도","120도"] },
  { type:"circle_diameter", q1:"지름이 같은 두 원이 있을 때", q2:"두 원의 크기는?", ans:"같다", options:["같다","다르다","하나가 크다","알 수 없다"] },
  { type:"circle_radius", q1:"반지름이 다른 두 원 중에서", q2:"더 큰 원은?", ans:"반지름이 더 긴 원", options:["반지름이 더 긴 원","반지름이 더 짧은 원","같다","알 수 없다"] },
];

// ======================================
// 게임 로직
// ======================================
function initGame(mode) {
    currentGameMode = mode;
    score = 0;
    lives = 3;
    currentQuestionNum = 0;
    updateScoreBoard();
    menuScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameProgress.classList.remove('hidden');
    nextProblem();
}

function updateScoreBoard() {
    scoreEl.innerText = score;
    livesEl.innerText = '❤️'.repeat(lives);
}

function nextProblem() {
    currentQuestionNum++;
    if (currentQuestionNum > TOTAL_QUESTIONS) {
        gameOver();
        return;
    }

    currentQEl.innerText = currentQuestionNum;
    feedbackEl.innerText = '';
    feedbackEl.className = 'feedback-msg';
    problemCard.className = 'problem-card';
    shapeVisual.innerHTML = '';
    document.querySelector('.operator').style.display = 'none';
    document.getElementById('answer-placeholder').innerText = '';

    if (currentGameMode === 'gugudan') {
        generateGugudanProblem();
    } else {
        generateShapeProblem();
    }
}

function generateGugudanProblem() {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 9) + 1;
    currentAnswer = n1 * n2;

    num1El.innerText = n1;
    document.querySelector('.operator').style.display = 'inline';
    document.querySelector('.operator').innerText = '×';
    num2El.innerText = n2;
    document.getElementById('answer-placeholder').innerText = '= ?';

    generateOptions(currentAnswer, 'number');
}

function generateShapeProblem() {
    const randomIdx = Math.floor(Math.random() * shapeProblems.length);
    const problem = shapeProblems[randomIdx];
    currentAnswer = problem.ans;

    num1El.innerText = problem.q1;
    num2El.innerText = problem.q2;

    drawShapeSVG(problem.type);
    generateOptions(currentAnswer, 'text', problem.options);
}

function drawShapeSVG(type) {
    const color = '#4ecdc4';
    const fill = 'rgba(78,205,196,0.2)';
    const accent = '#ff6b6b';
    const sw = 5;
    let svg = '';

    switch(type) {
        case 'right_angle':
            svg = `<path d="M20 20 V80 H80" fill="none" stroke="${color}" stroke-width="${sw}"/>
                   <rect x="20" y="60" width="20" height="20" fill="none" stroke="${accent}" stroke-width="2"/>`;
            break;
        case 'right_triangle':
            svg = `<path d="M20 20 V80 H80 Z" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>
                   <rect x="20" y="65" width="15" height="15" fill="none" stroke="${accent}" stroke-width="2"/>`;
            break;
        case 'rectangle':
            svg = `<rect x="15" y="30" width="90" height="55" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>`;
            break;
        case 'square':
            svg = `<rect x="30" y="25" width="55" height="55" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>`;
            break;
        case 'circle_center':
            svg = `<circle cx="60" cy="60" r="42" fill="rgba(78,205,196,0.15)" stroke="${color}" stroke-width="${sw}"/>
                   <circle cx="60" cy="60" r="5" fill="${accent}"/>
                   <text x="68" y="57" font-size="12" fill="${accent}">중심</text>`;
            break;
        case 'circle_radius':
            svg = `<circle cx="60" cy="60" r="42" fill="none" stroke="${color}" stroke-width="${sw}"/>
                   <line x1="60" y1="60" x2="102" y2="60" stroke="${accent}" stroke-width="${sw}"/>
                   <circle cx="60" cy="60" r="5" fill="${accent}"/>
                   <text x="70" y="53" font-size="11" fill="${accent}">반지름</text>`;
            break;
        case 'circle_diameter':
            svg = `<circle cx="60" cy="60" r="42" fill="none" stroke="${color}" stroke-width="${sw}"/>
                   <line x1="18" y1="60" x2="102" y2="60" stroke="${accent}" stroke-width="${sw}"/>
                   <circle cx="60" cy="60" r="5" fill="${accent}"/>
                   <text x="42" y="52" font-size="11" fill="${accent}">지름</text>`;
            break;
        case 'line_segment':
            svg = `<line x1="15" y1="60" x2="105" y2="60" stroke="${color}" stroke-width="${sw}"/>
                   <circle cx="15" cy="60" r="5" fill="${color}"/>
                   <circle cx="105" cy="60" r="5" fill="${color}"/>
                   <text x="8" y="50" font-size="12" fill="${color}">A</text>
                   <text x="98" y="50" font-size="12" fill="${color}">B</text>`;
            break;
        case 'ray':
            svg = `<line x1="15" y1="60" x2="105" y2="60" stroke="${color}" stroke-width="${sw}"/>
                   <circle cx="15" cy="60" r="5" fill="${color}"/>
                   <path d="M105 60 L93 53 M105 60 L93 67" fill="none" stroke="${color}" stroke-width="${sw}"/>
                   <text x="8" y="50" font-size="12" fill="${color}">A</text>`;
            break;
        case 'straight_line':
            svg = `<line x1="5" y1="60" x2="115" y2="60" stroke="${color}" stroke-width="${sw}"/>
                   <path d="M5 60 L17 53 M5 60 L17 67" fill="none" stroke="${color}" stroke-width="${sw}"/>
                   <path d="M115 60 L103 53 M115 60 L103 67" fill="none" stroke="${color}" stroke-width="${sw}"/>`;
            break;
        case 'angle':
        case 'angle_parts':
            svg = `<path d="M100 25 L35 60 L100 95" fill="none" stroke="${color}" stroke-width="${sw}"/>
                   <circle cx="35" cy="60" r="5" fill="${accent}"/>
                   <text x="5" y="64" font-size="11" fill="${accent}">꼭짓점</text>`;
            break;
        default:
            svg = `<text x="30" y="65" font-size="16" fill="${color}">도형</text>`;
    }

    shapeVisual.innerHTML = `<svg width="120" height="120" viewBox="0 0 120 120">${svg}</svg>`;
}

function generateOptions(answer, type, customOptions) {
    optionsEl.innerHTML = '';
    let choices = [];

    if (type === 'number') {
        choices = [answer];
        while (choices.length < 4) {
            let r = (Math.floor(Math.random() * 9) + 1) * (Math.floor(Math.random() * 9) + 1);
            if (!choices.includes(r)) choices.push(r);
        }
    } else {
        choices = [...customOptions];
    }

    choices.sort(() => Math.random() - 0.5);

    choices.forEach(val => {
        const btn = document.createElement('button');
        btn.innerText = val;
        btn.className = 'option-btn';
        btn.addEventListener('click', () => checkAnswer(val));
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if (problemCard.classList.contains('correct') || problemCard.classList.contains('wrong')) return;

    if (selected == currentAnswer) {
        score += 10;
        feedbackEl.innerText = '맞았습니다! 축하합니다! 🎊✨';
        feedbackEl.className = 'feedback-msg correct';
        problemCard.className = 'problem-card correct';
        updateScoreBoard();
        createFireworks();
        setTimeout(nextProblem, 3000);
    } else {
        lives--;
        feedbackEl.innerText = '우아아앙! 너무 안타까워요!! 😭💢';
        feedbackEl.className = 'feedback-msg wrong';
        problemCard.className = 'problem-card wrong';
        updateScoreBoard();
        triggerFrustration();
        if (lives <= 0) {
            setTimeout(gameOver, 3000);
        } else {
            setTimeout(nextProblem, 3000);
        }
    }
}

function createFireworks() {
    effectLayer.classList.remove('hidden');
    effectLayer.innerHTML = '';
    const emojis = ['🌟','✨','🎊','🎇','❤️','🌈','🔥'];
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 500;
        p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        p.style.left = '50%'; p.style.top = '50%';
        p.style.animation = `explode ${1 + Math.random() * 1.5}s ease-out forwards`;
        effectLayer.appendChild(p);
    }
    setTimeout(() => { effectLayer.classList.add('hidden'); effectLayer.innerHTML = ''; }, 3000);
}

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

function gameOver() {
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
    gameProgress.classList.add('hidden');
}

document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-mode');
        initGame(mode);
    });
});
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
});
