import './utils/async-array-utils.js';
import { simulateAsyncOperation } from './utils/async-array-utils.js';

const destinations = [
  {
    id: 1,
    name: 'Санторіні, Греція',
    image: 'images/g-4.jpg',
    description: 'Білі будинки з блакитними дахами над лазурним морем',
  },
  {
    id: 2,
    name: 'Токіо, Японія',
    image: 'images/p-5.jpg',
    description: 'Неонове сяйво мегаполіса та стародавні храми',
  },
  {
    id: 3,
    name: 'Балі, Індонезія',
    image: 'images/g-8.jpg',
    description: 'Тропічний рай для розслаблення і відпочинку',
  },
  {
    id: 4,
    name: 'Альпи, Швейцарія',
    image: 'images/g-1.jpg',
    description: 'Засніжені гірські вершини і кришталево чисті озера',
  },
  {
    id: 5,
    name: 'Рим, Італія',
    image: 'images/Italy.jpg',
    description: 'Місто з унікальною архітектурою',
  },
];

// Dom елементи
const callbackDemoBtn = document.getElementById('callback-demo');
const promiseDemoBtn = document.getElementById('promise-demo');
const asyncAwaitDemoBtn = document.getElementById('async-await-demo');
const abortDemoBtn = document.getElementById('abort-demo');
const resultsContainer = document.getElementById('results-container');
const statusText = document.querySelector('.status-text');
const progressBar = document.querySelector('.progress');

let currentController = null;
let cancelCallback = null;

function updateUI(state = 'idle', progress = 0) {
  progressBar.style.width = `${progress}%`;

  switch (state) {
    case 'processing':
      statusText.textContent = `Завантаження... ${progress}%`;
      break;
    case 'completed':
      statusText.textContent = 'Завантаження завершено';
      break;
    case 'aborted':
      statusText.textContent = 'Завантаження скасовано';
      break;
    case 'error':
      statusText.textContent = 'Помилка під час завантаження';
      break;
    default:
      statusText.textContent = 'Готовий до завантаження';
  }
}

// Скидання інтерфейсу перед кожною демонстрацією
function resetDemo() {
  abortCurrentOperation();
  updateUI('idle', 0);
  resultsContainer.innerHTML = '';

  destinations.forEach((dest) => {
    const card = createDestinationCard(dest);
    resultsContainer.appendChild(card);
  });
}

function createDestinationCard(destination) {
  const card = document.createElement('div');
  card.className = 'destination-card';
  card.id = `dest-${destination.id}`;

  card.innerHTML = `
    <img src="${destination.image}" alt="${destination.name}">
    <div class="card-info">
      <h4>${destination.name}</h4>
      <p>${destination.description}</p>
    </div>
  `;

  return card;
}

async function processDestination(destination) {
  const processedDest = await simulateAsyncOperation({
    ...destination,
    processed: true,
    rating: Math.floor(Math.random() * 5) + 1,
    processingTime: new Date().toLocaleTimeString(),
  });

  return processedDest;
}

function updateCardUI(id, state, data = null) {
  const card = document.getElementById(`dest-${id}`);

  const existingIndicator = card.querySelector('.processing-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }

  card.classList.remove('processing', 'completed', 'error');

  switch (state) {
    case 'processing':
      card.classList.add('processing');
      const indicator = document.createElement('i');
      indicator.className = 'fas fa-spinner processing-indicator';
      card.appendChild(indicator);
      break;

    case 'completed':
      card.classList.add('completed');
      if (data) {
        //processed
        const infoDiv = card.querySelector('.card-info');
        infoDiv.innerHTML = `
          <h4>${data.name}</h4>
          <p>${data.description}</p>
          <p>Оцінка: ${'★'.repeat(data.rating)}${'☆'.repeat(
          5 - data.rating
        )}</p>
          <p class="processing-time">Оновлено: ${data.processingTime}</p>
        `;
      }
      break;

    case 'error':
      card.classList.add('error');
      break;
  }
}

function abortCurrentOperation() {
  if (currentController && !currentController.signal.aborted) {
    currentController.abort();
  }

  if (typeof cancelCallback === 'function') {
    cancelCallback();
    cancelCallback = null;
  }

  destinations.forEach((destination) => {
    const card = document.getElementById(`dest-${destination.id}`);
    if (card && !card.classList.contains('completed')) {
      updateCardUI(destination.id, 'error');
    }
  });
}

// ДЕМОНСТРАЦІЯ НА ОСНОВІ КОЛБЕКІВ
function runCallbackDemo() {
  resetDemo();

  updateUI('processing', 0);

  currentController = new AbortController();
  const { signal } = currentController;

  let aborted = false;
  signal.addEventListener('abort', () => {
    aborted = true;
    updateUI('aborted');
  });

  let processedCount = 0;
  const totalItems = destinations.length;

  const timeouts = [];

  cancelCallback = destinations.mapAsyncAbortable(
    (destination, index) => {
      updateCardUI(destination.id, 'processing');

      const timeout = setTimeout(() => {
        if (aborted) return;

        const processed = {
          ...destination,
          processed: true,
          rating: Math.floor(Math.random() * 5) + 1,
          processingTime: new Date().toLocaleTimeString(),
        };

        updateCardUI(destination.id, 'completed', processed);

        processedCount++;
        const progress = Math.floor((processedCount / totalItems) * 100);
        updateUI('processing', progress);

        if (processedCount === totalItems) {
          updateUI('completed', 100);
        }
      }, 1000 + index * 500);
      timeouts.push(timeout);

      return {
        ...destination,
        cleanup: () => {
          clearTimeout(timeout);
          if (!aborted) {
            updateCardUI(destination.id, 'error');
          }
        },
      };
    },
    signal,
    (error, results) => {
      if (error) {
        console.error('Callback demo error:', error);
        updateUI('error');

        timeouts.forEach((t) => clearTimeout(t));
      } else {
        console.log('Callback demo results:', results);
      }
    }
  );

  const originalCancel = cancelCallback;
  cancelCallback = function () {
    originalCancel();
    timeouts.forEach((t) => clearTimeout(t));
    aborted = true;
    updateUI('aborted');
  };
}

// ДЕМОНСТРАЦІЯ НА ОСНОВІ PROMISE
function runPromiseDemo() {
  resetDemo();
  updateUI('processing', 0);

  currentController = new AbortController();
  const { signal } = currentController;

  let processedCount = 0;
  const totalItems = destinations.length;
  destinations.forEach((destination) => {
    updateCardUI(destination.id, 'processing');
  });

  destinations
    .mapAsyncPromiseAbortable(function (destination, index) {
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          updateCardUI(destination.id, 'error');
          reject(
            new Error(
              `Операція скасована до запуску таймера на індексі ${index}`
            )
          );
          return;
        }

        const delay = 1000 + index * 200;
        const timeout = setTimeout(() => {
          if (signal?.aborted) {
            updateCardUI(destination.id, 'error');
            reject(
              new Error(
                `Операція скасована під час таймера на індексі ${index}`
              )
            );
            return;
          }

          const processed = {
            ...destination,
            processed: true,
            rating: Math.floor(Math.random() * 5) + 1,
            processingTime: new Date().toLocaleTimeString(),
          };

          processedCount++;
          const progress = Math.floor((processedCount / totalItems) * 100);
          updateUI('processing', progress);
          updateCardUI(destination.id, 'completed', processed);

          resolve(processed);
        }, delay);
      });
    }, signal)
    .then((results) => {
      console.log('Promise demo results:', results);
      updateUI('completed', 100);
    })
    .catch((error) => {
      console.error('Promise demo error:', error);

      if (error.message.includes('Операція скасована') || signal?.aborted) {
        updateUI('aborted');
      } else {
        updateUI('error');
      }
      destinations.forEach((dest) => {
        const card = document.getElementById(`dest-${dest.id}`);
        if (card && card.classList.contains('processing')) {
          updateCardUI(dest.id, 'error');
        }
      });
    });
}

// ДЕМОНСТРАЦІЯ ASYNC / AWAIT
async function runAsyncAwaitDemo() {
  resetDemo();

  updateUI('processing', 0);

  currentController = new AbortController();
  const { signal } = currentController;

  try {
    let processedCount = 0;
    const totalItems = destinations.length;

    async function processOneByOne() {
      for (let i = 0; i < destinations.length; i++) {
        if (signal.aborted) throw new Error('Operation aborted');

        const destination = destinations[i];
        updateCardUI(destination.id, 'processing');
        await new Promise((resolve) => setTimeout(resolve, 800));

        const processed = await processDestination(destination);

        processedCount++;
        const progress = Math.floor((processedCount / totalItems) * 100);
        updateUI('processing', progress);

        updateCardUI(destination.id, 'completed', processed);
      }

      return destinations.map((d) => ({ ...d, processed: true }));
    }

    const results = await processOneByOne();
    console.log('Async/await demo results:', results);
    updateUI('completed', 100);
  } catch (error) {
    console.error('Async/await demo error:', error);
    if (error.message.includes('abort')) {
      updateUI('aborted');
    } else {
      updateUI('error');
    }
  }
}

callbackDemoBtn.addEventListener('click', runCallbackDemo);
promiseDemoBtn.addEventListener('click', runPromiseDemo);
asyncAwaitDemoBtn.addEventListener('click', runAsyncAwaitDemo);
abortDemoBtn.addEventListener('click', () => {
  abortCurrentOperation();
  updateUI('aborted');
});

document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const demoLink = document.createElement('a');
    demoLink.href = 'async-demo.html';
    demoLink.textContent = 'Детальніше';
    navbar.appendChild(demoLink);
  }
});
