const symbols = ['🍒', '🍋', '🍇', '🔔', '💎', '7️⃣'];
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const resultDiv = document.getElementById('result');
const messageDiv = document.getElementById('message');
const playBtn = document.getElementById('playBtn');

let attemptCount = 0;
let jackpotTriggered = false;

playBtn.addEventListener('click', () => {
  attemptCount++;
  resultDiv.textContent = '';
  messageDiv.textContent = '';

  if (attemptCount > 15) {
    playBtn.disabled = true;
    playBtn.style.opacity = '0.6';
    resultDiv.innerHTML = "💸💸💸";
    messageDiv.innerHTML = `
      <hr>
      Ça suffit, tu es milliardaire après tous les gains 😎<br><br>
      Reviens une autre fois sur la page!! 💰💰💰
    `;
    return;
  }

  let i = 0;
  const spin = setInterval(() => {
    slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    i++;
    if (i > 15) {
      clearInterval(spin);
      showResult();
    }
  }, 100);
});

function showResult() {
  let s1 = slot1.textContent;
  let s2 = slot2.textContent;
  let s3 = slot3.textContent;

  if ((attemptCount % 3 == 0) || (attemptCount % 5 == 0)) {
    const lucky = symbols[Math.floor(Math.random() * symbols.length)];
    s1 = s2 = s3 = lucky;
    slot1.textContent = slot2.textContent = slot3.textContent = lucky;
    jackpotTriggered = true;
  }

  if (s1 === s2 && s2 === s3) {
    resultDiv.innerHTML = "🎉 JACKPOT ! Bien joué Laurent !";
    messageDiv.innerHTML = `
      <hr>
      Merci pour ta bonne humeur légendaire, ta répartie et ton rire qui résonnait dans l'open space 😄<br><br>
      Tu vas me manquer Laurent. Reviens vite jouer ici quand tu veux !<br><br>
      🫶 Anaïs
    `;
  } else {
    resultDiv.innerHTML = "Pas cette fois 😅 Réessaie !";
  }
}