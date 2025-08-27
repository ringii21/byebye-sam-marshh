  const questions = {
    "algèbre": [
      { q: "Résous : 3x - 5 = 10", a: "5" },
      { q: "Résous : x² - 4x + 4 = 0", a: "2" },
      { q: "Si 2x + 3 = 9, combien vaut x ?", a: "3" }
    ],
    "logique": [
      { q: "Si un chat attrape 1 souris en 3 minutes, combien de souris 3 chats attrapent-ils en 9 minutes ?", a: "9" },
      { q: "Quel est le prochain nombre ? 2, 4, 8, 16, ...", a: "32" },
      { q: "Combien y a-t-il de trous dans un T-shirt standard ?", a: "8" }
    ],
    "analyse": [
      { q: "Quelle est la dérivée de x² ?", a: "2x" },
      { q: "Lim x→0 de sin(x)/x ?", a: "1" },
      { q: "∫ x dx = ?", a: "0.5x^2", alt: ["1/2 x^2","(1/2)x^2","0.5 x^2","(1/2) x^2"] }
    ],
    "probabilités": [
      { q: "Proba de tirer un roi dans un jeu de 52 cartes ?", a: "1/13" },
      { q: "Lancer un dé. Proba de faire un nombre pair ?", a: "0.5", alt: ["1/2","50%","0,5"] },
      { q: "Si tu lances deux dés, quelle est la proba d'obtenir 7 ?", a: "1/6", alt: ["6/36","0.1667","0,1667"] }
    ],
    "géométrie": [
      { q: "Combien de degrés a un triangle ?", a: "180" },
      { q: "Formule de l'aire d'un cercle ?", a: "pi*r^2", alt: ["πr^2","pi r^2","π r^2"] },
      { q: "Combien de faces a un cube ?", a: "6" }
    ]
  };

  // --- état du jeu ---
  let currentCategory = "";
  let currentQuestion = {};
  let correctAnswers = 0;

  // Piles de questions restantes par catégorie (mélangées, sans répétition)
  const remainingByCat = {};

  function shuffle(arr){
    // Fisher–Yates
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startCategory(cat) {
    currentCategory = cat;

    // Initialise la pile mélangée si pas déjà fait
    if (!remainingByCat[cat]) {
      remainingByCat[cat] = shuffle([...questions[cat]]);
    }

    document.getElementById("menu").style.display = "none";
    document.getElementById("question-box").style.display = "block";
    document.getElementById("cat-title").innerText = `Catégorie : ${cat}`;
    nextQuestion();
  }

  function nextQuestion() {
    const pile = remainingByCat[currentCategory];

    // Si plus de questions dans cette catégorie
    if (!pile || pile.length === 0) {
      document.getElementById("message").innerText =
        "🎯 Plus de questions dans cette catégorie. Choisis-en une autre !";
      // Retour propre au menu après une petite pause
      setTimeout(() => {
        document.getElementById("question-box").style.display = "none";
        document.getElementById("menu").style.display = "block";
      }, 800);
      return;
    }

    currentQuestion = pile.pop(); // dépile → aucune répétition
    document.getElementById("question-text").innerText = currentQuestion.q;
    document.getElementById("answer").value = "";
    document.getElementById("message").innerText = "";
  }

  // Normalisation douce des réponses
  function norm(s){
    return s
      .toLowerCase()
      .replaceAll(" ", "")
      .replaceAll(",", ".")
      .replaceAll("π", "pi")
      .replaceAll("×", "*")
      .replaceAll("−", "-");
  }

  function isCorrect(user, qObj){
    const u = norm(user);
    const good = norm(qObj.a);
    if (u === good) return true;

    if (qObj.alt && Array.isArray(qObj.alt)){
      return qObj.alt.some(v => norm(v) === u);
    }
    return false;
  }

  function checkAnswer() {
    const userAns = document.getElementById("answer").value.trim();

    if (isCorrect(userAns, currentQuestion)) {
      correctAnswers++;
      document.getElementById("message").innerText = "🎉 Bonne réponse !";
      // victoire à 5 bonnes réponses (toutes catégories confondues)
      if (correctAnswers >= 3) {
        document.getElementById("question-box").style.display = "none";
        document.getElementById("menu").style.display = "none";
        document.body.innerHTML += `
          <h2>🌟 Eyyyy c'était trop facile non ? 🌟</h2>
          Vasjana,<br/><br/>
          Je voulais simplement te dire que j'ai été très heureuse d'avoir partagé ces moments avec toi au sein de l'entreprise.<br/><br/>
          Je garde de très bons souvenirs de nos échanges, de nos rires et des petites complicités qui rendaient le quotidien plus agréable.<br/><br/>
          Je te souhaite plein de belles choses pour la suite, autant sur le plan professionnel que personnel!!<br/><br/>
          Avec tous les remerciements de ces un an et demi,
          <br/><br/>
          Anaïs 🌸
        `;
        return;
      }
      // passer à la prochaine question de la même catégorie (si dispo)
      nextQuestion();
    } else {
      document.getElementById("message").innerText = "🙈 Essaie encore !";
    }
  }

  function backToMenu() {
    document.getElementById("question-box").style.display = "none";
    document.getElementById("menu").style.display = "block";
  }

  function showAnswer() {
    document.getElementById("message").innerText = `💡 Réponse : ${currentQuestion.a}`;
  }
