
const quiz = [
  {
    q: "Quel joueur a inscrit le plus de buts en phase finale de Coupe du Monde ?",
    type: "qcm",
    options: ["Ronaldo Nazário", "Miroslav Klose", "Pelé", "Just Fontaine"],
    answer: "Miroslav Klose"
  },
  {
    q: "Quel est le seul club à avoir remporté la Ligue des Champions en étant invaincu toute la compétition ?",
    type: "qcm",
    options: ["Manchester United", "FC Porto", "AC Milan", "Ajax Amsterdam"],
    answer: "Manchester United"
  },
  {
    q: "Quel joueur détient le record du nombre de cartons rouges en carrière professionnelle ?",
    type: "qcm",
    options: ["Sergio Ramos", "Gerardo Bedoya", "Vinnie Jones", "Pepe"],
    answer: "Gerardo Bedoya"
  },
  {
    q: "En quelle année le format à 32 équipes a-t-il été introduit en Coupe du Monde ?",
    type: "qcm",
    options: ["1994", "1998", "2002", "1986"],
    answer: "1998"
  },
  {
    q: "Quel club détient le record du plus grand nombre de titres de champion national dans l’histoire ?",
    type: "qcm",
    options: ["Rangers (Écosse)", "Al-Ahly (Égypte)", "Real Madrid", "Penarol (Uruguay)"],
    answer: "Rangers (Écosse)"
  },
  {
    q: "Quel gardien est célèbre pour avoir marqué 3 buts sur penalty en Ligue des Champions ?",
    type: "qcm",
    options: ["Hans-Jörg Butt", "Manuel Neuer", "Rogerio Ceni", "José Luis Chilavert"],
    answer: "Hans-Jörg Butt"
  },
  {
    q: "Quel joueur est le seul à avoir remporté la Coupe du Monde, la Ligue des Champions et le Ballon d'Or la même année ?",
    type: "qcm",
    options: ["Zinedine Zidane", "Ronaldinho", "Sir Bobby Charlton", "Franz Beckenbauer"],
    answer: "Sir Bobby Charlton"
  }
];
let currentIndex = 0;
let score = 0;
function loadQuestion() {
  const current = quiz[currentIndex];
  document.getElementById("result").innerText = "";
  document.getElementById("final-message").innerText = "";
    
  document.getElementById("question-text").innerText = `Question ${currentIndex + 1} : ${current.q}`;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
    
  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("qcm-button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, btn);
    answersDiv.appendChild(btn);
  });
}
    // Ballon rebondissant
const ballon = document.getElementById("ballon-animé");
let x = 100, y = 100;
let dx = 10, dy = 10;
function animateBall() {
  const w = window.innerWidth - ballon.offsetWidth;
  const h = window.innerHeight - ballon.offsetHeight;

  x += dx;
  y += dy;

  if (x <= 0 || x >= w) dx *= -1;
  if (y <= 0 || y >= h) dy *= -1;

  ballon.style.left = `${x}px`;
  ballon.style.top = `${y}px`;

  requestAnimationFrame(animateBall);
}
animateBall();
function checkAnswer(userAnswer, clickedButton) {
  const buttons = document.querySelectorAll(".qcm-button");
  buttons.forEach(btn => btn.disabled = true); // Désactive tous les boutons
  const correct = quiz[currentIndex].answer.toLowerCase();
  const isCorrect = userAnswer.toLowerCase() === correct;
  const resultDiv = document.getElementById("result");
  if (isCorrect) {
    resultDiv.innerText = "✅ Bonne réponse !";
    clickedButton.style.backgroundColor = "#27ae60"; // vert
    score++;
  } else {
    resultDiv.innerText = `❌ Mauvaise réponse. La bonne réponse était : ${quiz[currentIndex].answer}`;
    clickedButton.style.backgroundColor = "#c0392b"; // rouge
    // Affiche aussi le bon bouton en vert
    buttons.forEach(btn => {
      if (btn.innerText.toLowerCase() === correct) {
        btn.style.backgroundColor = "#27ae60";
      }
    });
  }
  currentIndex++;
  setTimeout(() => {
    if (currentIndex < quiz.length) {
      loadQuestion();
    } else {
      showFinalMessage();
    }
  }, 2000);
}
function showFinalMessage() {
  document.getElementById("question-container").style.display = "none";
  const msg = document.getElementById("final-message");
  msg.innerHTML = `
    <h2>🏁 Fin du Match !</h2>
    <p>Score final : <strong>${score}/7</strong></p>
    <p>
Score final : <strong>${score}/7</strong><br/><br/>

Hugues,<br/><br/>

Merci… Merci pour ces un an et demi à tes côtés. Merci d'avoir été ce chef qui ne se contente pas de diriger, mais qui veille, qui soutient, qui protège. 
Tu m'as offert ta patience, ta bienveillance, ton écoute et surtout ton humour, toujours là, fidèle au poste, même dans les jours les plus gris.<br/><br/>
Je sais ce que j'ai traversé ici, et je sais aussi que j'ai tenu bon grâce à toi. Grâce à ta présence, à ta façon de relativiser, à cette capacité rare que tu as de faire sourire même quand tout semble compliqué. Tu es resté humain, profondément, et c'est devenu une boussole pour moi.<br/><br/>
Je continuerai, où que j'aille, à hurler “INNER JOIN” comme un cri de ralliement à ton image; un mélange de rigueur et de folie douce.<br/><br/>
Mais au-delà de tout ça, j'espère de tout cœur que tu penseras enfin à toi. Que tu lèveras les pieds, que tu te permettras de souffler, parce que tu portes beaucoup… trop parfois. Moi y compris, on s'inquiète.
Ta santé compte. Elle doit passer avant tout!!<br/><br/>
Sur ce, j'ai un dernier petit geste pour toi. Un petit cadeau, simple, mais du fond du cœur. Il t'attend dans mon ancien casier — code <strong>0624</strong>.<br/><br/>
Avec tous mes remerciements du fond du cœur.<br/><br/>
Anaïs ⚽
</p>
  `;
}
loadQuestion();