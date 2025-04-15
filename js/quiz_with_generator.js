/* Квіз */
const questions = [
  {
    question: "Який тип локації вам ближчий?", answers: ["Море та пляжі", "Гори та природа", "Місто та культурні пам’ятки",
      "Ліс, усамітнення та кемпінг"]
  },
  {
    question: "Який стиль відпочинку вам більше подобається?", answers: ["Розслаблений (спа, пляж, йога)", "Активний (похід, дайвінг, катання на лижах)",
      "Культурний (музеї, театри, архітектура)", "Гастрономічний (місцева кухня, дегустації)", "Екстремальний (стрибки з парашутом, альпінізм)"]
  },
  { question: "Який клімат вам до вподоби?", answers: ["Теплий і сонячний", "Холодний і сніжний", "Прохолодний і дощовий", "Помірний"] },
  {
    question: "Який вид пересування вам зручніший?", answers: ["Орендувати авто та подорожувати самостійно", "Потяги та громадський транспорт",
      "Літаки для далеких подорожей", "Круїз або прогулянки на човні"]
  },
  { question: "Ви подорожуєте:", answers: ["Наодинці", "З родиною", "З партнером", "З друзями"] },
  { question: "Ваш бюджет на подорож?", answers: ["Економний", "Середній", "Преміум"] },
  {
    question: "Що для вас головне у подорожі?", answers: ["Гарні пейзажі та природа", "Історія та культура", "Місцева кухня",
      "Розваги та нічне життя", "Спорт та активний відпочинок"]
  },
  {
    question: "Наскільки спонтанні ваші подорожі?", answers: ["Планую все заздалегідь", "Купую квиток і їду без чіткого плану",
      "Люблю змінювати плани на ходу"]
  }
];

let currentIndex = 0;
let currentQuestionIndex = 0;
const restartBtn = document.getElementById("restart-btn");


// Task 1.1: 
// Cyclic question generator
function* questionGenerator() {
    for (let i = 0; i < questions.length; i++) {
        yield questions[i];
    }
}

//Incremental counter generator
function* numberGenerator(number = 1) {
    while (true) {
        yield number++;
    }
}

let questionIterator = questionGenerator();
let numberIterator = numberGenerator();

let userChoices = [];
let locationsChoices = [];


// Task 1.2: 
function timeoutIterator(iterator, timeoutDuration) {
    const startTime = Date.now(); 
    let iterationCount = 0; 

    function processNext() {
        if (Date.now() - startTime > timeoutDuration * 1000) {
            console.log("Тайм-аут завершено!");
            return;
        }

        const nextValue = iterator.next(); 
        if (nextValue.done) {
            console.log("Ітератор завершено.");
            return;
        }

        const value = nextValue.value;
        iterationCount++;

        if (typeof value === 'string' && value.startsWith("url")) {
            console.log(`Ітерація: ${iterationCount}, Зміна фону на: ${value}`);
            document.body.style.backgroundImage = value;
        }
        


        setTimeout(processNext, 7000); 
    }

    processNext(); 
}

function* backgroundGenerator() {
    const backgrounds = [
        "url('images/Bali.jpg')",
        "url('images/high_rock.jpg')",
        "url('images/beautiful_sunset.jpg')",
        "url('images/mountain_Canada1.jpg')",
        "url('images/mountains_winter.jpg')"
    ];
    
    let i = 0;
    while (true) {
        if (i >= backgrounds.length) i = 0;
        yield backgrounds[i++];
    }
}

timeoutIterator(backgroundGenerator(), 45);



function loadQuestion() {
    const next = questionIterator.next();

    restartBtn.style.display = "none"; 

    if (next.done) {
        showResult();
        return;
    }

    const quizContainer = document.getElementById("quiz");
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const numberElement = document.getElementById("number");

    numberElement.innerText = `${numberIterator.next().value} / ${questions.length}`;
    questionElement.innerText = next.value.question;
    answersElement.innerHTML = "";

    next.value.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.style.background = getRandomColor();
        button.onclick = () => {
            userChoices.push(answer);
            loadQuestion(); 
        };
        answersElement.appendChild(button);
    });
}

function showResult() {
    const quizContainer = document.getElementById("quiz");

    recommendTrip(userChoices).then(place => {
        const resultImage = document.createElement("img");
        resultImage.id = "result-image";
        resultImage.src = place.image;
        document.body.appendChild(resultImage);

        
        let resultHTML = `<p>Рекомендуємо вам наступний напрямок:</p>`;
        resultHTML += `
            <div class="destination">
                <p><strong>${place.name}</strong></p>
                <p><a href="${place.link}" target="_blank">знайти квитки</a></p>
                <p><a href="${place.bookingLink}" target="_blank">забронювати готель</a></p>
            </div>
        `;

        quizContainer.innerHTML = resultHTML;
        restartBtn.style.display = "block"; 
        quizContainer.appendChild(restartBtn);
    });
}

function restartQuiz() {
    userChoices = [];
    currentIndex = 0;
    currentQuestionIndex = 0;
     const quizContainer = document.getElementById("quiz");

    const resultImage = document.getElementById("result-image");
    if (resultImage) {
        resultImage.remove();
    }

    questionIterator.return?.(); 
    numberIterator.return?.();

    questionIterator = questionGenerator();
    numberIterator = numberGenerator();
    quizContainer.innerHTML = `<p id="question" class="question-text">Какой тип локации вам ближе?</p>
      <div id="answers" class="answers-quiz"></div>
      <div id="number" class="number-numeration"></div>`

    loadQuestion();
}

restartBtn.addEventListener("click", restartQuiz);


function getRandomColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

loadQuestion();

async function getLocations() {
    console.log("FETCHING LOCATIONS...");
    try {
        const response = await fetch("/js/locations.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Успішно завантажено:", data);
        return data;

    } catch (error) {
        console.error("Помилка завантаження JSON:", error.message);
        return null;
    }
}


async function recommendTrip(choices) {
    let locations = await memoizedGetLocations();
  console.log("V002", locations);
  for (let tag of choices) {
    locs = locations.filter(loc => loc.tags.includes(tag));
    if (locs.length === 0) {
      break;
    }
    locations = locs;
  }
  return locations[0];
}



// Task 3:
function memoize(fn, {
    maxSize = Infinity,
    strategy = "LRU",   
    ttl = null,
    customEviction = null
} = {}) {
    const cache = new Map();
    const frequencyMap = new Map();

    function evictIfNeeded() {
        if (strategy === "Time") return; 

        if (cache.size <= maxSize) return;

        if (customEviction) {
            customEviction(cache);
        } else if (strategy === "LRU") {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
            frequencyMap.delete(firstKey);
        } else if (strategy === "LFU") {
            let minFreq = Infinity;
            let keyToDelete;
            for (let [key, freq] of frequencyMap.entries()) {
                if (freq < minFreq) {
                    minFreq = freq;
                    keyToDelete = key;
                }
            }
            if (keyToDelete !== undefined) {
                cache.delete(keyToDelete);
                frequencyMap.delete(keyToDelete);
            }
        }
    }

    return async function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            const entry = cache.get(key);

            if (!ttl || (Date.now() - entry.timestamp < ttl)) {
                if (strategy === "LFU") {
                    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
                }
                if (strategy === "LRU") {
                    cache.delete(key);
                    cache.set(key, entry);
                }

                return entry.value;
            } else {
                cache.delete(key);
                frequencyMap.delete(key);
            }
        }

        const result = await fn(...args);
        cache.set(key, { value: result, timestamp: Date.now() });

        if (strategy === "LFU") {
            frequencyMap.set(key, 1);
        }

        evictIfNeeded();

        return result;
    };
}

const memoizedGetLocations = memoize(getLocations, {
    maxSize: 1,           
    strategy: "Time",     
    ttl: 2 * 60 * 1000   
});
