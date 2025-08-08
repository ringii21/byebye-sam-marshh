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
      <p>
      Laurent,<br/><br/>
      Tu as toujours été discret, presque en retrait… mais dès que j'avais un souci, tu étais là. Réactif, efficace, rassurant. Je n'avais même pas le temps de paniquer que tu avais déjà trouvé une solution. Pour moi, tu es devenu "Docteur Diep", toujours prêt à intervenir en urgence avec calme et maîtrise.<br/><br/>
      Tu m'as aussi beaucoup impressionnée à travers les petites anecdotes que tu partageais parfois. Sous ton air posé, il y avait presque un gangster qui sommeille: un vrai ! 😄<br/><br/>
      Plus sérieusement, j’ai énormément apprécié nos échanges, ta présence rassurante et ta façon de toujours prendre le temps, même dans le rush. Je garde de très bons souvenirs de toi et de ces moments partagés. J’espère de tout cœur que tu continueras à prendre soin de toi, de ta santé, et à rester ce Laurent plein de ressources que tout le monde gagne à connaître.<br/><br/>
      Merci pour tout, Docteur Diep 🙏<br/><br/>
      Anaïs
      </p>

    `;
  } else {
    resultDiv.innerHTML = "Pas cette fois 😅 Réessaie !";
  }
}