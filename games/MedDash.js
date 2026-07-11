/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: MedDash
@description: medical robot avoid the virus and run to gain the bag  
@author: Mohamad Ali Ahmed
@tags: ['robot', 'medical']
@addedOn: 2025-07-11
*/

const player = "p";
const hospitalBag = "h"; 
const wall = "w";
const virus = "v";

setLegend(
  [ player, bitmap`
    ....1111....
    ...100001...
    ..10777701..
    .1075555701.
    110750057011
    110755557011
    ..10777701..
    ...100001...
    ....1111....
    ...1....1...
    ..1......1..
    .1........1.
  `],
  [ hospitalBag, bitmap`
    ................
    .....222222.....
    ....27777772....
    ...2772222772...
    ...2720002722...
    ...2720302722...
    ...2720002722...
    ...2772222772...
    ....27777772....
    .....222222.....
    ................
    ................
  `],
  [ virus, bitmap`
    ....3......3....
    .....3....3.....
    ......3333......
    ....33033033....
    ...3000330003...
    ...3033333303...
    ....33333334....
    ......3444......
    .....4....4.....
    ....4......4....
    ................
    ................
  `],
  [ wall, bitmap`
    0000000000000000
    0777777777777770
    0700000000000070
    0705555555550070
    0705000000050070
    0705000000050070
    0705000000050070
    0705555555550070
    0700000000000070
    0777777777777770
    0000000000000000
    0000000000000000
  `]
);

setSolids([wall]);

let score = 0;
let lives = 3;
let timeLeft = 60;
let gameOver = false;

// Custom 10x8 map layout
const levels = [
  map`
    wwwwwwwwww
    w.p......w
    w........w
    w........w
    w....h...w
    w........w
    w...v....w
    wwwwwwwwww`
];

setMap(levels[0]);

// Core Gameplay Loop
setInterval(() => {
  if (gameOver) return;

  timeLeft -= 1;

  if (timeLeft <= 0) {
    gameOver = true;
    clearText();
    addText("TIME UP!", { y: 3, color: color`red` });
  }
}, 1000);

// Enemy Tracking Loop
setInterval(() => {
  if (gameOver) return;

  let v = getFirst(virus);
  let p = getFirst(player);
  if (!v || !p) return;

  let nextX = v.x;
  let nextY = v.y;

  if (v.x < p.x) nextX += 1;
  else if (v.x > p.x) nextX -= 1;
  if (v.y < p.y) nextY += 1;
  else if (v.y > p.y) nextY -= 1;

  let tiles = getTile(nextX, nextY);
  let isWall = tiles.some(t => t.type === wall);
  if (!isWall) {
    v.x = nextX;
    v.y = nextY;
  }

  checkGameState();
}, 500);

function checkGameState() {
  if (gameOver) return;

  let p = getFirst(player);
  let h = getFirst(hospitalBag);
  let v = getFirst(virus);
  if (!p) return;

  // Item Collection Protocol
  if (h && p.x === h.x && p.y === h.y) {
    score += 10;
    h.x = Math.floor(Math.random() * 7) + 1;
    h.y = Math.floor(Math.random() * 5) + 1;

    // Direct console logging instead of overlaying on top of the map
    console.log("Score Gained: " + score);

    if (score >= 100) {
      gameOver = true;
      clearText();
      addText("VICTORY!", { y: 3, color: color`green` });
    }
  }

  // Virus Collision Protocol
  if (v && p.x === v.x && p.y === v.y) {
    lives -= 1;
    v.x = Math.floor(Math.random() * 7) + 1;
    v.y = Math.floor(Math.random() * 5) + 1;

    console.log("Lives Remaining: " + lives);

    if (lives <= 0) {
      gameOver = true;
      p.remove();
      clearText();
      addText("GAME OVER", { y: 3, color: color`red` });
    }
  }
}

// Move Handlers
onInput("w", () => { let p = getFirst(player); if (p && !gameOver) { p.y -= 1; checkGameState(); } });
onInput("s", () => { let p = getFirst(player); if (p && !gameOver) { p.y += 1; checkGameState(); } });
onInput("a", () => { let p = getFirst(player); if (p && !gameOver) { p.x -= 1; checkGameState(); } });
onInput("d", () => { let p = getFirst(player); if (p && !gameOver) { p.x += 1; checkGameState(); } });