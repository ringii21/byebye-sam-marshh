const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageDiv = document.getElementById("message");

 const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

 const worldWidth = 3000;

 let player = {
  x: 50,
  y: 0,
  width: 32,
  height: 32,
  dx: 0,
  dy: 0,
  speed: 4,
  jump: -10,
  grounded: false,
};

 const gravity = 0.5;
let cameraX = 0;
let won = false;
let lost = false;

 const frameWidth = 32;
const frameHeight = 32;
let currentFrame = 0;
let frameTimer = 0;
const frameSpeed = 6;

 const playerSprite = new Image();
playerSprite.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAgCAYAAAD9qabkAAAAAXNSR0IArs4c6QAABKdJREFUeF7tXUFy2zAMlE+dNKdkpve8I31An9I39Sn9QN6Re2eaUybTkzsYGTKMgCIpAwRNwZc0NiWAWOwCNKn0MMUrIhAR2G0EDrudeUw8IhARmEIAIgkiAjuOQAjAjsGPqUcEQgAqc+D57uGYuuTl4y3iWRnPWxs+Gv6RsBUZCOD/uP82PX25F6/69fd1shaB0RKwIvzuQ0fE/+YEwIsAEvhAePr6+fg0WYpADwnozcLAX7cAVQuAFwCQeF4ESJH/5ePtgg/Pdw+TlQj0IECIgdcSKPC/JL9GAaoSAC8AUuTXCEBJRePzPlV58VILEehBgDwFOPD/vPSUcnBL7hULgGcF8iQA2oYkxLW/twC0tt8bAcEfLQLkCsDo+BcJgCcBpeRrSQCaACgCaP94PE6HwzmE8Pv3r4+qy4AeE7AlAQP/ufpbFaBNAuBFQI8KjAT8/f5nwh0ALwHwEKCeCBj4z12oZv5lBcC7AvVSgSUBkNpHWIeBUMB4jS3BngTIk4AYa20ClC4BRsV/VQA4+TwqkDcB6DfftBVLdUHaAsDtUwJYC1DgP0cYd75GxL9YALxaYE8CcIJxQpyq/DLMgvx4c96JtRAgajPwP29DIyYj4F+0BMAJ8zWwdQWi9/cggCQANBbwb0gC+p5W65+I7fKFENqmZxEsBIie+wj8z8fAsRu4dfyzAuBZgXqswKljwOjr6793tfW/JICYcK0TsBcBxnm3EkCe/6PhXyUAEAxvADwIkDsARYlqIQDe9qV1sBcBA3+pNzy/V5t/RQJAExBP361VIHBH4xvwWvWF8bUBWA/n/Kk3AXuyH/jrEtA7/7ICIG0Drjk9KgHhjH/pS/OBoBryo38W9uHeufZ3ZAEeFf9iASgB3zIBw778CLIkShYCEPEfM/7F24CRAHICQMfDY6PZBeU6AEv7td3fHguAZfxLlp/X2i8SgDXySw5oVaCS5Kf70xYt6JoPSHT6R0LgPfIFWbbDWltW5AjYyn7gLz+D3yr+qeWXhv1kguaSj5KNE0BrL1zyAQWHEo2e0LKovkhSIEKJfQsBwCRoZT/w/3zwZ0T8iwSAKlBJAloIACchkgx+0q1JHKfhQ+ooLKvysEvwyQdP+xa2sQsI/OciQET+pvGvWgJI4CMBUR21qh+uf5DQnOT0GKY1AXGZQdv1lH0cq0nCWvvgp8Y2LF/+BP7nDBgF/+waVaqCLdSPr435AxlrAGgRgIoQPuFHzz9Ix3A1BZCLIO12UufQLeyvdFhm1S/wnyNAj2Jb4J8VAHSCEkBKPnROo/Jx8OnvNCCkyh2hC8CXRvWTbMJ9PeyvzH/5yHr+gf/cVY2Gf5EAoAhgAEjlw+sXAmqTTxAD/Lv81HfpvTUdueYzb/voO///CYqx3DJ5SPxO8Af3Ye6B/yWQm/DfdNEJADC/CMDJl633q8lJDj4lhKX9nMik/KqZW+3YnE+19ysdz+229kMSAEvseVzQfut5S35QHpbit4y7JmgUhJbJL9lqaT8V5NY+0CS8BsfqpDld4GWf591VBNg4+dZYS26qiM/WxPFW4JQib8RT5TKvpPC0u2fybeWOSrIxEd58z/9ZzCKox4+PaQAAAABJRU5ErkJggg==";

 

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

 const enemies = [
  { x: 450, y: 340, width: 30, height: 30, color: "#8e44ad", dx: 2, minX: 400, maxX: 550 },
  { x: 1800, y: 340, width: 30, height: 30, color: "#8e44ad", dx: 1.5, minX: 1750, maxX: 1850 },
  { x: 610, y: 240, width: 30, height: 30, color: "#d35400", dx: 1.8, minX: 600, maxX: 700 },
  { x: 1400, y: 200, width: 30, height: 30, color: "#d35400", dx: 2.2, minX: 1350, maxX: 1450 }
];

 const goal = { x: 2900, y: 130, width: 40, height: 40, color: "#2ecc71" };

 function update() {
  if (won || lost) return;

   player.dx = 0;
  if (keys["ArrowRight"]) player.dx = player.speed;
  if (keys["ArrowLeft"]) player.dx = -player.speed;
  if (keys["ArrowUp"] && player.grounded) {
    player.dy = player.jump;
    player.grounded = false;
  }

   player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

   player.grounded = false;
  for (const p of platforms) {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height <= p.y + 5 &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  }

   if (player.y > canvas.height) {
    player.x = 50;
    player.y = 0;
    player.dy = 0;
  }
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;

   cameraX = player.x - canvas.width / 2;
  if (cameraX < 0) cameraX = 0;
  if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;

   for (const e of enemies) {
    e.x += e.dx;
    if (e.x < e.minX || e.x + e.width > e.maxX) {
      e.dx *= -1;
    }
    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y
    ) {
      lost = true;
      messageDiv.innerHTML = `
    	💥 Tu t'es pris un méchant dans la face Marc !<br><br>
        Mais je sais que tu vas recommencer et le battre 💪<br><br>
        🫶 Anaïs
      `;
    }
  }

   if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    won = true;
    messageDiv.innerHTML = `
      🏁 Tu as traversé le jeu comme un vrai pro 🎯<br><br>
      <p>
      Coucou Marc,<br/><br/>
      C'est peut-être avec toi que j'ai eu le moins d'occasions d'échanger longuement… mais pourtant, ta bienveillance et ta sympathie transparaissaient à chaque instant. Tu dégages un calme et une force tranquille, et je l'ai toujours ressenti.<br/><br/>
      Le OG, comme on dit: une légende!! Merci pour tes partages de connaissances, toujours transmis avec gentillesse, patience et humilité. Tu as un charisme fou, et je te le dis sincèrement : tu fais partie de ces personnes qu'on admire sans trop oser leur dire. Une vraie source d'inspiration pour moi, presque un idole !<br/><br/>
      J'espère que tu as apprécié le petit jeu de plateforme que je t'ai concocté 😄 C'était une façon à moi de te dire merci pour ces un an et demi partagés dans la même aventure.<br/><br/>
      Merci pour tout, Marc !<br/><br/>
      Anaïs 🎮
      </p>

    `;
  }
}

 function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-cameraX, 0);

   for (const p of platforms) {
    ctx.fillStyle = "#74b9ff";
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }

   for (const e of enemies) {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
  }

   ctx.fillStyle = goal.color;
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

   // Animation du joueur
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

 loop();

 document.getElementById("restartBtn").addEventListener("click", () => {
  window.location.reload();
});