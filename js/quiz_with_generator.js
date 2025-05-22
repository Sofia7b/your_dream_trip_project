import { log } from './log.js';
import { AuthProxy } from './proxy.js';
import { CoreApiService } from './apiservice.js';

const proxy = new AuthProxy(new CoreApiService(), {
  apiKey: 'apikey',
  getToken: async (forceRefresh = false) => {
    let token = localStorage.getItem('jwtToken');
    if (forceRefresh || !token) {
      token = 'fake-jwt-token-' + Date.now();
      localStorage.setItem('jwtToken', token);
    }
    return token;
  },
});

const questions = [
  {
    question: 'Який тип локації вам ближчий?',
    answers: [
      'Море та пляжі',
      'Гори та природа',
      'Місто та культурні пам’ятки',
      'Ліс, усамітнення та кемпінг',
    ],
  },
  {
    question: 'Який стиль відпочинку вам більше подобається?',
    answers: [
      'Розслаблений (спа, пляж, йога)',
      'Активний (похід, дайвінг, катання на лижах)',
      'Культурний (музеї, театри, архітектура)',
      'Гастрономічний (місцева кухня, дегустації)',
      'Екстремальний (стрибки з парашутом, альпінізм)',
    ],
  },
  {
    question: 'Який клімат вам до вподоби?',
    answers: [
      'Теплий і сонячний',
      'Холодний і сніжний',
      'Прохолодний і дощовий',
      'Помірний',
    ],
  },
  {
    question: 'Який вид пересування вам зручніший?',
    answers: [
      'Орендувати авто та подорожувати самостійно',
      'Потяги та громадський транспорт',
      'Літаки для далеких подорожей',
      'Круїз або прогулянки на човні',
    ],
  },
  {
    question: 'Ви подорожуєте:',
    answers: ['Наодинці', 'З родиною', 'З партнером', 'З друзями'],
  },
  {
    question: 'Ваш бюджет на подорож?',
    answers: ['Економний', 'Середній', 'Преміум'],
  },
  {
    question: 'Що для вас головне у подорожі?',
    answers: [
      'Гарні пейзажі та природа',
      'Історія та культура',
      'Місцева кухня',
      'Розваги та нічне життя',
      'Спорт та активний відпочинок',
    ],
  },
  {
    question: 'Наскільки спонтанні ваші подорожі?',
    answers: [
      'Планую все заздалегідь',
      'Купую квиток і їду без чіткого плану',
      'Люблю змінювати плани на ходу',
    ],
  },
];

let currentIndex = 0;
let currentQuestionIndex = 0;
const restartBtn = document.getElementById('restart-btn');

// Task 1:
// Task 1.1:
function* questionGenerator() {
  for (let i = 0; i < questions.length; i++) {
    yield questions[i];
  }
}

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
      console.log('Тайм-аут завершено!');
      return;
    }

    const nextValue = iterator.next();
    if (nextValue.done) {
      console.log('Ітератор завершено.');
      return;
    }

    const value = nextValue.value;
    iterationCount++;

    if (typeof value === 'string' && value.startsWith('url')) {
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
    "url('images/mountains_winter.jpg')",
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

  restartBtn.style.display = 'none';

  if (next.done) {
    showResult();
    return;
  }

  const quizContainer = document.getElementById('quiz');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const numberElement = document.getElementById('number');

  numberElement.innerText = `${numberIterator.next().value} / ${
    questions.length
  }`;
  questionElement.innerText = next.value.question;
  answersElement.innerHTML = '';

  next.value.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer;
    button.style.background = getRandomColor();
    button.onclick = () => {
      userChoices.push(answer);
      loadQuestion();
    };
    answersElement.appendChild(button);
  });
}

async function showResult() {
  const quizContainer = document.getElementById('quiz');
  const resultContainer = document.getElementById('result');
  const resultImage = document.getElementById('quiz-result-image');
  const resultLinks = document.querySelector('.result-links');

  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';

  try {
    const placeholderResponse = await proxy.post(
      'https://jsonplaceholder.typicode.com/posts',
      { answers: userChoices }
    );
    const placeholderData = await placeholderResponse.json();
    console.log('Answer', placeholderData);
  } catch (err) {
    console.error('Error:', err);
  }
  recommendTripLogged(userChoices)
    .then((place) => {
      if (!place) {
        resultContainer.innerHTML = `<p>Не знайдено рекомендацій. Спробуйте інші відповіді!</p>`;
        return;
      }

      resultImage.src = place.image;
      resultImage.alt = place.name;

      resultLinks.innerHTML = `
              <a href="${place.link}" target="_blank" class="btn">Квитки</a>
              <a href="${place.bookingLink}" target="_blank" class="btn">Готелі</a>
            `;

      if (!document.querySelector('.result-content h2')) {
        const title = document.createElement('h2');
        title.textContent = place.name;
        resultImage.insertAdjacentElement('beforebegin', title);
      } else {
        document.querySelector('.result-content h2').textContent = place.name;
      }

      restartBtn.style.display = 'block';
    })
    .catch((error) => {
      console.error('Помилка:', error);
      resultContainer.innerHTML = `<p>Сталася помилка. Спробуйте ще раз!</p>`;
    });
}

function restartQuiz() {
  userChoices = [];
  currentIndex = 0;
  currentQuestionIndex = 0;
  const quizContainer = document.getElementById('quiz');

  const resultImage = document.getElementById('result-image');
  if (resultImage) {
    resultImage.remove();
  }

  questionIterator.return?.();
  numberIterator.return?.();

  questionIterator = questionGenerator();
  numberIterator = numberGenerator();
  quizContainer.innerHTML = `
        <div class="quiz-header">
          <p id="number" class="number-numeration"></p>
          <h2 id="question" class="question-text"></h2>
        </div>
        <div id="answers" class="answers-quiz"></div>
      `;

  loadQuestion();
  const resultContainer = document.getElementById('result');
  resultContainer.style.display = 'none';
  quizContainer.style.display = 'block';
}

restartBtn.addEventListener('click', restartQuiz);

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

loadQuestion();

async function getLocations() {
  console.log('FETCHING LOCATIONS...');
  try {
    const response = await fetch('js/locations.json');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Успішно завантажено:', data);
    return data;
  } catch (error) {
    console.error('Помилка завантаження JSON:', error.message);
    return null;
  }
}

const memoizedGetLocations = memoize(getLocations);
async function recommendTrip(choices) {
  const locations = await memoizedGetLocations();
  if (!locations?.length) return null;

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^а-яєії'ґ\s]/gi, '')
      .trim();
  const normalizedChoices = choices.map(normalize);

  const scored = locations.map((loc) => {
    const score = loc.tags.reduce((total, tag) => {
      const normalizedTag = normalize(tag);
      return normalizedChoices.some(
        (choice) =>
          normalizedTag.includes(choice) || choice.includes(normalizedTag)
      )
        ? total + 1
        : total;
    }, 0);
    return { ...loc, score };
  });
  const sorted = scored.sort((a, b) => b.score - a.score);
  console.log('Normalized choices:', normalizedChoices);
  console.log(
    'Scored locations:',
    sorted.map((l) => `${l.name} (${l.score})`)
  );
  return sorted[0] || null;
}

const recommendTripLogged = log({
  level: 'DEBUG',
  target: 'console',
  profile: true,
})(recommendTrip);


// Task 3:
function memoize(
  fn,
  {
    maxSize = Infinity,
    strategy = 'LRU',
    ttl = null,
    customEviction = null,
    serializer = (...args) => JSON.stringify(args),
  } = {}
) {
  const cache = new Map();
  const frequencyMap = new Map();
  const lruQueue = [];
  let cleanupTimer;

  const startTTLCleanup = () => {
    if (ttl && !cleanupTimer) {
      cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of cache.entries()) {
          if (now - entry.timestamp > ttl) {
            cache.delete(key);
            frequencyMap.delete(key);
            lruQueue.splice(lruQueue.indexOf(key), 1);
          }
        }
      }, Math.min(ttl, 60000));
    }
  };

  startTTLCleanup();

  const evict = () => {
    if (cache.size >= maxSize) {
      if (customEviction) {
        customEviction(cache, { frequencyMap, lruQueue });
      } else {
        switch (strategy) {
          case 'LRU':
            const lruKey = lruQueue.shift();
            cache.delete(lruKey);
            frequencyMap.delete(lruKey);
            break;
          case 'LFU':
            let minFreq = Infinity;
            let lfuKey;
            frequencyMap.forEach((freq, key) => {
              if (freq < minFreq) {
                minFreq = freq;
                lfuKey = key;
              }
            });
            cache.delete(lfuKey);
            frequencyMap.delete(lfuKey);
            lruQueue.splice(lruQueue.indexOf(lfuKey), 1);
            break;
        }
      }
    }
  };

  const memoized = function (...args) {
    const key = serializer(...args);

    if (cache.has(key)) {
      const entry = cache.get(key);
      if (strategy === 'LRU') {
        lruQueue.push(lruQueue.splice(lruQueue.indexOf(key), 1)[0]);
      }
      frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
      return entry.value;
    }

    const result = fn(...args);

    if (result instanceof Promise) {
      return result
        .then((res) => {
          cache.set(key, { value: res, timestamp: Date.now() });
          frequencyMap.set(key, 1);
          lruQueue.push(key);
          evict();
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      cache.set(key, { value: result, timestamp: Date.now() });
      frequencyMap.set(key, 1);
      lruQueue.push(key);
      evict();
      return result;
    }
  };

  memoized.clearCache = () => {
    cache.clear();
    frequencyMap.clear();
    lruQueue.length = 0;
  };

  return memoized;
}
