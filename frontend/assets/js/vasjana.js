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
        { q: "∫ x dx = ?", a: "0.5x^2" }
      ],
      "probabilités": [
        { q: "Proba de tirer un roi dans un jeu de 52 cartes ?", a: "1/13" },
        { q: "Lancer un dé. Proba de faire un nombre pair ?", a: "0.5" },
        { q: "Si tu lances deux dés, quelle est la proba d’obtenir 7 ?", a: "6/36" }
      ],
      "géométrie": [
        { q: "Combien de degrés a un triangle ?", a: "180" },
        { q: "Formule de l’aire d’un cercle ?", a: "pi*r^2" },
        { q: "Combien de faces a un cube ?", a: "6" }
      ]
    };

    let currentCategory = "";
    let currentQuestion = {};
    let correctAnswers = 0;

    function startCategory(cat) {
      currentCategory = cat;
      document.getElementById("menu").style.display = "none";
      document.getElementById("question-box").style.display = "block";
      document.getElementById("cat-title").innerText = `Catégorie : ${cat}`;
      nextQuestion();
    }

    function nextQuestion() {
      const qs = questions[currentCategory];
      currentQuestion = qs[Math.floor(Math.random() * qs.length)];
      document.getElementById("question-text").innerText = currentQuestion.q;
      document.getElementById("answer").value = "";
      document.getElementById("message").innerText = "";
    }

    function checkAnswer() {
      const userAns = document.getElementById("answer").value.trim().toLowerCase();
      const correct = currentQuestion.a.toLowerCase();

      if (userAns === correct) {
        correctAnswers++;
        document.getElementById("message").innerText = "🎉 Bonne réponse !";
        if (correctAnswers === 5) {
          document.getElementById("question-box").style.display = "none";
          document.getElementById("menu").style.display = "none";
          document.body.innerHTML += `
            <hr>
            <h2>🌟 Bravo Vasjana ! 🌟</h2>
            <p>Tu as relevé 5 défis mathématiques avec brio !</p>
            <p>Merci pour ton intelligence, ta curiosité et ton sourire. Ce fut un vrai plaisir de bosser avec toi 🫶</p>
            <p>À très vite,</p>
            <strong>Anaïs</strong>
          `;
        }
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