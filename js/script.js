import travelSystem from "./services/recommendation-system.js";
import setupVideoTransitions from "./components/video-slider.js";

let searchBtn = document.querySelector("#search-btn");
let searchBar = document.querySelector(".search-bar-container");
let formBtn = document.querySelector("#login-btn");
let loginForm = document.querySelector(".login-form-container");
let formClose = document.querySelector("#form-close");
let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");
let videoBtn = document.querySelectorAll(".vid-btn");

window.onscroll = () => {
  searchBtn.classList.remove("fa-times");
  searchBar.classList.remove("active");
  menu.classList.remove("fa-times");
  navbar.classList.remove("active");
  loginForm.classList.remove("active");
};

menu.addEventListener("click", () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});

searchBtn.addEventListener("click", () => {
  searchBtn.classList.toggle("fa-times");
  searchBar.classList.toggle("active");
});

formBtn.addEventListener("click", () => {
  loginForm.classList.add("active");
});

formClose.addEventListener("click", () => {
  loginForm.classList.remove("active");
});

// Clean up event listeners
videoBtn.forEach((btn) => {
  const oldListeners = btn.getEventListeners?.("click") || [];
  oldListeners.forEach((listener) => {
    btn.removeEventListener("click", listener);
  });
});

// Task 4: Implement a BiDirectionalPriorityQueue | start
function displayRecommendations(option = "highest") {
  const recommendations = travelSystem.getRecommendations(option);
  const container = document.querySelector(".recommendation-container");

  if (!container) return;

  container.innerHTML = "";

  recommendations.forEach((recommendation) => {
    const card = document.createElement("div");
    card.className = "recommendation-card";
    card.innerHTML = `
            <div class="card-image">
                <img src="${recommendation.image}" alt="${recommendation.title}">
            </div>
            <div class="card-content">
                <h3>${recommendation.title}</h3>
                <div class="card-description">
                    <p>${recommendation.description}</p>
                </div>
                <div class="card-action">
                    <a href="${recommendation.link}" class="btn">Дізнатися більше</a>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const recommendationControls = document.getElementById(
    "recommendation-controls"
  );
  if (recommendationControls) {
    recommendationControls.addEventListener("click", function (e) {
      if (e.target.classList.contains("sort-btn")) {
        const option = e.target.getAttribute("data-sort");
        displayRecommendations(option);

        document.querySelectorAll(".sort-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        e.target.classList.add("active");
      }
    });

    displayRecommendations("highest");
  }

  setupVideoTransitions();
});
// Task 4 end

// Initialize Swiper components
var swiper = new Swiper(".review-slider", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".brand-slider", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    991: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5,
    },
  },
});
