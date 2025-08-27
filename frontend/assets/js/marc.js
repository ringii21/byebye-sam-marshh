
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageDiv = document.getElementById("message");

// --- clavier ---
const keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (introVisible && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    startGame();
  }
  if (!introVisible && (e.key === "r" || e.key === "R")) restartGame();
});
document.addEventListener("keyup", e => keys[e.key] = false);

// --------- TUNING: un seul niveau "normal" ---------
const TUNING = {
  patrolCount: [2,3],
  patrolSpeed: [1.2,2.0],
  droneCount: 6,
  droneSpeed: [1.0,1.8],
  droneAmp: [18,32],
  chasers: 3,
  chaserSpeed: 2.6,
  chaserAggro: 240
};

// Monde
const worldWidth = 3000;

let player = {
  x: 50, y: 0, width: 32, height: 32,
  dx: 0, dy: 0, speed: 4, jump: -10, grounded: false
};

const gravity = 0.5;
let cameraX = 0;
let won = false;
let lost = false;

// Intro / overlay
let introVisible = true;

// Animation sprite joueur
const frameWidth = 32, frameHeight = 32;
let currentFrame = 0, frameTimer = 0, frameSpeed = 6;

const playerSprite = new Image();
playerSprite.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAgCAYAAAD9qabkAAAAAXNSR0IArs4c6QAABKdJREFUeF7tXUFy2zAMlE+dNKdkpve8I31An9I39Sn9QN6Re2eaUybTkzsYGTKMgCIpAwRNwZc0NiWAWOwCNKn0MMUrIhAR2G0EDrudeUw8IhARmEIAIgkiAjuOQAjAjsGPqUcEQgAqc+D57uGYuuTl4y3iWRnPWxs+Gv6RsBUZCOD/uP82PX25F6/69fd1shaB0RKwIvzuQ0fE/+YEwIsAEvhAePr6+fg0WYpADwnozcLAX7cAVQuAFwCQeF4ESJH/5ePtgg/Pdw+TlQj0IECIgdcSKPC/JL9GAaoSAC8AUuTXCEBJRePzPlV58VILEehBgDwFOPD/vPSUcnBL7hULgGcF8iQA2oYkxLW/twC0tt8bAcEfLQLkCsDo+BcJgCcBpeRrSQCaACgCaP94PE6HwzmE8Pv3r4+qy4AeE7AlAQP/ufpbFaBNAuBFQI8KjAT8/f5nwh0ALwHwEKCeCBj4z12oZv5lBcC7AvVSgSUBkNpHWIeBUMB4jS3BngTIk4AYa20ClC4BRsV/VQA4+TwqkDcB6DfftBVLdUHaAsDtUwJYC1DgP0cYd75GxL9YALxaYE8CcIJxQpyq/DLMgvx4c96JtRAgajPwP29DIyYj4F+0BMAJ8zWwdQWi9/cggCQANBbwb0gC+p5W65+I7fKFENqmZxEsBIie+wj8z8fAsRu4dfyzAuBZgXqswKljwOjr6793tfW/JICYcK0TsBcBxnm3EkCe/6PhXyUAEAxvADwIkDsARYlqIQDe9qV1sBcBA3+pNzy/V5t/RQJAExBP361VIHBH4xvwWvWF8bUBWA/n/Kk3AXuyH/jrEtA7/7ICIG0Drjk9KgHhjH/pS/OBoBryo38W9uHeufZ3ZAEeFf9iASgB3zIBw778CLIkShYCEPEfM/7F24CRAHICQMfDY6PZBeU6AEv7td3fHguAZfxLlp/X2i8SgDXySw5oVaCS5Kf70xYt6JoPSHT6R0LgPfIFWbbDWltW5AjYyn7gLz+D3yr+qeWXhv1kguaSj5KNE0BrL1zyAQWHEo2e0LKovkhSIEKJfQsBwCRoZT/w/3zwZ0T8iwSAKlBJAloIACchkgx+0q1JHKfhQ+ooLKvysEvwyQdP+xa2sQsI/OciQET+pvGvWgJI4CMBUR21qh+uf5DQnOT0GKY1AXGZQdv1lH0cq0nCWvvgp8Y2LF/+BP7nDBgF/+waVaqCLdSPr435AxlrAGgRgIoQPuFHzz9Ix3A1BZCLIO12UufQLeyvdFhm1S/wnyNAj2Jb4J8VAHSCEkBKPnROo/Jx8OnvNCCkyh2hC8CXRvWTbMJ9PeyvzH/5yHr+gf/cVY2Gf5EAoAhgAEjlw+sXAmqTTxAD/Lv81HfpvTUdueYzb/voO///CYqx3DJ5SPxO8Af3Ye6B/yWQm/DfdNEJADC/CMDJl633q8lJDj4lhKX9nMik/KqZW+3YnE+19ysdz+229kMSAEvseVzQfut5S35QHpbit4y7JmgUhJbJL9lqaT8V5NY+0CS8BsfqpDld4GWf591VBNg4+dZYS26qiM/WxPFW4JQib8RT5TKvpPC0u2fybeWOSrIxEd58z/9ZzCKox4+PaQAAAABJRU5ErkJggg==";

// Level geometry
const platforms = [
  { x: 0, y: 370, width: 3000, height: 30 },
  { x: 300, y: 320, width: 100, height: 10 },
  { x: 600, y: 270, width: 200, height: 10 },
  { x: 900, y: 220, width: 150, height: 10 },
  { x: 1100, y: 160, width: 150, height: 10 },
  { x: 1400, y: 220, width: 200, height: 10 },
  { x: 1700, y: 280, width: 100, height: 10 },
  { x: 1900, y: 300, width: 100, height: 10 },
  { x: 2000, y: 240, width: 150, height: 10 },
  { x: 2200, y: 200, width: 100, height: 10 },
  { x: 2400, y: 250, width: 150, height: 10 },
  { x: 2600, y: 160, width: 120, height: 10 }
];

const goal = { x: 2900, y: 130, width: 40, height: 40, color: "#2ecc71" };

// ===== util =====
function randRange(a, b) { return a + Math.random() * (b - a); }
function choice(arr) { return arr[(Math.random() * arr.length) | 0]; }

// ===== ENNEMIS =====
let enemies = [];

// émojis par type
const EMOJI = {
  patrol: "👾",   // extraterrestre
  drone:  "💣",   // bombe
  chaser: "👹"    // tête de monstre
};

function spawnEnemies() {
  enemies = [];

  // Zones de patrouille au sol
  const groundBands = [
    { minX: 700,  maxX: 950  },
    { minX: 1300, maxX: 1550 },
    { minX: 1900, maxX: 2150 },
    { minX: 2400, maxX: 2700 }
  ];
  groundBands.forEach(b => {
    const n = choice([TUNING.patrolCount[0], TUNING.patrolCount[1]]);
    for (let i = 0; i < n; i++) {
      const speed = randRange(TUNING.patrolSpeed[0], TUNING.patrolSpeed[1]) * choice([1, -1]);
      const x0 = randRange(b.minX, b.maxX - 28);
      enemies.push({
        type: "patrol",
        x: x0, y: 340, width: 28, height: 28,
        dx: speed, minX: b.minX, maxX: b.maxX,
        dead: false
      });
    }
  });

  // Patrouilleurs sur plateformes
  const eligible = platforms.filter(p => p.y <= 300 && p.width >= 140 && p.x > 900);
  const take = 4; // fixe pour "normal"
  eligible.slice(0, take).forEach(p => {
    const minX = p.x, maxX = p.x + p.width - 28;
    enemies.push({
      type: "patrol",
      x: randRange(minX, maxX), y: p.y - 28, width: 28, height: 28,
      dx: randRange(TUNING.patrolSpeed[0], TUNING.patrolSpeed[1]) * choice([1, -1]),
      minX, maxX, dead: false
    });
  });

  // Drones (bombes)
  const dronePool = [900, 1200, 1500, 1850, 2100, 2450, 2700];
  dronePool.slice(0, TUNING.droneCount).forEach(xc => {
    enemies.push({
      type: "drone",
      x: xc, y: randRange(140, 210), width: 26, height: 26,
      t: randRange(0, Math.PI*2),
      speed: randRange(TUNING.droneSpeed[0], TUNING.droneSpeed[1]),
      amp: randRange(TUNING.droneAmp[0], TUNING.droneAmp[1]),
      dead: false
    });
  });

  // Poursuiveurs (têtes de monstre)
  const chaserSpots = [1200, 1700, 2000, 2350].slice(0, TUNING.chasers);
  chaserSpots.forEach(xc => {
    enemies.push({
      type: "chaser",
      x: xc, y: 340, width: 30, height: 30,
      vx: 0, vy: 0, maxSpeed: TUNING.chaserSpeed, accel: 0.12,
      aggro: TUNING.chaserAggro, dead: false
    });
  });
}

// ===== physique/collisions =====
function aabbOverlap(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function resetPlayer() {
  player.x = 50; player.y = 0;
  player.dx = 0; player.dy = 0;
  player.grounded = false;
}

function restartGame() {
  won = false; lost = false;
  messageDiv.innerHTML = "";
  resetPlayer();
  spawnEnemies();
}

// ====== INTRO UI (overlay) ======
(function createIntroUI() {
  const ui = document.createElement("div");
  ui.id = "intro-ui";
  Object.assign(ui.style, {
    position: "absolute",
    zIndex: "9999",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "12px",
    fontFamily: "system-ui, sans-serif",
    fontSize: "14px",
    lineHeight: "1.4",
    width: "min(92vw, 420px)",
    visibility: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
  });

  ui.innerHTML = `
    <div style="font-weight:600; font-size:16px; margin-bottom:8px;">Comment jouer</div>
    <ul style="padding-left:16px; margin:0 0 10px;">
      <li>← → : se déplacer</li>
      <li>↑ ou espace : sauter</li>
      <li>Saute sur la tête des <span style="font-size:16px">👾 👹 💣</span> pour les éliminer</li>
      <li>R : rejouer</li>
    </ul>
    <button id="intro-start" style="
      margin-top:8px; padding:8px 12px; border:none; border-radius:10px;
      cursor:pointer; background:#2ecc71; color:#111; font-weight:600;">
      Commencer (Entrée / Espace)
    </button>
  `;

  document.body.appendChild(ui);

  function positionIntroUI() {
    const rect = canvas.getBoundingClientRect();
    const uiW = ui.offsetWidth;
    const uiH = ui.offsetHeight;
    const left = window.scrollX + rect.left + (rect.width - uiW) / 2;
    const top  = window.scrollY + rect.top  + (rect.height - uiH) / 2;
    ui.style.left = `${left}px`;
    ui.style.top  = `${top}px`;
    ui.style.visibility = introVisible ? "visible" : "hidden";
  }

  requestAnimationFrame(positionIntroUI);
  window.addEventListener("resize", positionIntroUI);
  window.addEventListener("scroll", positionIntroUI, { passive: true });
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(positionIntroUI).observe(canvas);
  }

  document.getElementById("intro-start").addEventListener("click", startGame);

  // Expose reposition if needed
  window.__positionIntro = positionIntroUI;
})();

function startGame() {
  introVisible = false;
  const ui = document.getElementById("intro-ui");
  if (ui) ui.style.visibility = "hidden";
  // (re)lancer proprement
  restartGame();
}

// ====== boucle ======
function update() {
  if (introVisible || won || lost) return;

  // Mouvements joueur
  player.dx = 0;
  if (keys["ArrowRight"]) player.dx = player.speed;
  if (keys["ArrowLeft"])  player.dx = -player.speed;
  if ((keys["ArrowUp"] || keys[" "]) && player.grounded) {
    player.dy = player.jump;
    player.grounded = false;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  // plateformes (atterrissage)
  player.grounded = false;
  for (const p of platforms) {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height <= p.y + 6 &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  }

  // bordures monde
  if (player.y > canvas.height) { resetPlayer(); }
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;

  // caméra
  cameraX = player.x - canvas.width / 2;
  if (cameraX < 0) cameraX = 0;
  if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;

  // IA ennemis
  for (const e of enemies) {
    if (e.dead) continue;

    if (e.type === "patrol") {
      e.x += e.dx;
      if (e.x < e.minX || e.x + e.width > e.maxX) e.dx *= -1;
    }

    if (e.type === "drone") {
      e.t += 0.04;
      e.x += e.speed;
      e.y += Math.sin(e.t) * e.amp * 0.04;
      if (e.x > worldWidth - 100 || e.x < 100) e.speed *= -1;
    }

    if (e.type === "chaser") {
      const cx = e.x + e.width/2, cy = e.y + e.height/2;
      const px = player.x + player.width/2, py = player.y + player.height/2;
      const dx = px - cx, dy = py - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < e.aggro) {
        const nx = dx / (dist || 1), ny = dy / (dist || 1);
        e.vx += nx * 0.10;
        e.vy += ny * 0.10;
        e.vx *= 0.93; e.vy *= 0.93;
        const sp = Math.hypot(e.vx, e.vy);
        const maxS = TUNING.chaserSpeed;
        if (sp > maxS) { e.vx = e.vx / sp * maxS; e.vy = e.vy / sp * maxS; }
        e.x += e.vx; e.y += e.vy;
        if (e.y > 340) e.y = 340;
      } else {
        e.vx *= 0.9; e.vy *= 0.9;
        e.x += e.vx; e.y += e.vy;
      }
    }
  }

  // collisions joueur <-> ennemis (stomp)
  for (const e of enemies) {
    if (e.dead) continue;
    if (!aabbOverlap(player, e)) continue;

    const playerBottom = player.y + player.height;
    const isStomp = player.dy > 0 && (playerBottom - e.y) < 12;

    if (isStomp) {
      e.dead = true;
      player.dy = player.jump * 0.6; // rebond
    } else {
      lost = true;
      messageDiv.innerHTML = `💥 Aïe ! — Appuie sur <b>R</b> ou clique "Recommencer".`;
      break;
    }
  }

  enemies = enemies.filter(e => !e.dead);

  // Win
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    won = true;
    messageDiv.innerHTML = `Gagné, mais tu me diras que c'était facile n'est-ce pas??
    <p>Marc,<br/><br/> C'est peut-être avec toi que j'ai eu le moins d'occasions d'échanger longuement. Mais pourtant, ta bienveillance et ta sympathie transparaissaient à chaque fois que tu venais à mon aide. J'ai également adoré les moments ou tu sortais des phrases banger pendant les réunions! Des fois je ne savais pas si c'était des blagues mais ça restait très drôle haha
    <br>J'espère que tu as apprécié le petit jeu de plateforme! C'était une façon à moi de te dire merci pour ces un an et demi partagés dans la même aventure.<br/><br/> Merci pour tout, Marc !<br/><br/> Anaïs 🎮 </p>
    `;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-cameraX, 0);

  // plateformes
  for (const p of platforms) {
    ctx.fillStyle = "#74b9ff";
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }

  // goal
  ctx.fillStyle = goal.color;
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  // ennemis (émojis)
  ctx.textBaseline = "top";
  for (const e of enemies) {
    const emoji = EMOJI[e.type] || "⬛";
    ctx.font = `${Math.max(22, e.height)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif`;
    ctx.fillText(emoji, e.x, e.y);
  }

  // animation joueur
  if (player.dx !== 0) {
    frameTimer++;
    if (frameTimer >= frameSpeed) {
      frameTimer = 0;
      currentFrame = (currentFrame + 1) % 8;
    }
  } else {
    currentFrame = 0;
  }
  ctx.drawImage(
    playerSprite,
    currentFrame * frameWidth, 0, frameWidth, frameHeight,
    player.x, player.y, player.width, player.height
  );

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Init (niveau unique: normal) — on affiche l'intro, on spawn pour le décor
spawnEnemies();
loop();

// bouton restart si présent
document.getElementById("restartBtn")?.addEventListener("click", restartGame);

// expose pour debug si besoin
window.restartGame = restartGame;
