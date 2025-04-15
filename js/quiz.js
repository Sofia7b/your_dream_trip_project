let currentIndex = 0;
let currentQuestionIndex = 0;
let userChoices = [];
let locationsChoices = [];

function changeBackground() {
    document.body.style.backgroundImage = backgrounds[currentIndex];
    updateIndicator();
    currentIndex = (currentIndex + 1) % backgrounds.length;
}

function updateIndicator() {
    const indicator = document.getElementById("indicator");
    indicator.innerHTML = "";

    backgrounds.forEach((_, index) => {
        const dot = document.createElement("div");
        if (index === currentIndex) {
            dot.classList.add("active");
        }
        indicator.appendChild(dot);
    });
}

setInterval(changeBackground, 10000);
changeBackground();

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const quizContainer = document.getElementById("quiz");
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");

    questionElement.innerText = questions[currentQuestionIndex].question;
    answersElement.innerHTML = "";

    questions[currentQuestionIndex].answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.style.background = getRandomColor();
        button.onclick = () => {
            userChoices.push(answer);
            currentQuestionIndex++;
            loadQuestion();
        };
        answersElement.appendChild(button);
    });
}

function showResult() {
    const quizContainer = document.getElementById("quiz");
    const recommendation = recommendTrip(userChoices);
    quizContainer.innerHTML = `
        <p>Ваш стиль подорожі:</p>
        <p><strong>${userChoices[0]} + ${userChoices[1]} + ${userChoices[2]} + ${userChoices[3]}</strong></p>
        <p><strong>${recommendation.destination}</strong></p>
        <p><a href="${recommendation.flights}" target="_blank">знайти квитки</a></p>
        <p><a href="${recommendation.hotels}" target="_blank">забронювати готель</a></p>
    `;
}

async function recommendTrip(choices) {
  let locations = await getLocations()
  console.log(locations);
  for (let tag of choices) {
    locs = locations.filter(loc => loc.tags.includes(tag));
    if (locs.length === 0) {
      break;
    }
    locations = locs;
  }
  return locations[0];
}

function restartQuiz() {
    userChoices = [];
    currentQuestionIndex = 0;
    loadQuestion();
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

loadQuestion();

async function getLocations() {
    try {
        const response = await fetch("/js/locations.json");
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Ошибка загрузки JSON:", error);
    }
}

