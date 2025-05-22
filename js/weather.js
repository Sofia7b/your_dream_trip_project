const weatherContainer = document.querySelector("#weather");
const url = "http://localhost:3000";
const form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelectorAll("input");
  const formData = [...input].reduce((accumulator, current) => {
    accumulator[current.name] = current.value;
    return accumulator;
  }, {});
  getWeather(url, formData);
});

async function getWeather(url, formData = {}) {
  try {
    const enteries = [];
    for (const [key, value] of Object.entries(formData)) {
      enteries.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
    const res = await fetch(`${url}/weather?${enteries.join("&")}`);
    const data = await res.json();
    console.log(data.weather);

    const options = { weekday: "long", day: "numeric", month: "long" };
    const currentDate = new Date().toLocaleDateString("uk-UA", options);

    const isDay = data.weather.current.is_day ? "день" : "ніч";

    const windStrength =
      data.weather.current.wind_kph < 15
        ? "Слабкий вітер"
        : data.weather.current.wind_kph < 30
        ? "Помірний вітер"
        : "Сильний вітер";

    function translateCondition(conditionText) {
      const translations = {
        "Moderate rain": "помірний дощ",
        "Light rain": "невеликий дощ",
        "Heavy rain": "сильний дощ",
        "Partly cloudy": "мінлива хмарність",
        Cloudy: "хмарно",
        Sunny: "сонячно",
        Clear: "ясно",
        Overcast: "похмуро",
        Mist: "туман",
        Fog: "густий туман",
        Thunderstorm: "гроза",
        Snow: "сніг",
        Sleet: "мокрий сніг",
      };

      return translations[conditionText] || conditionText;
    }

    weatherContainer.innerHTML = `
  <h2 class="weather-header">погода у популярних напрямках</h2>
  <div class="weather-card">
    <div class="weather-location">
      <h3>${data.weather.location.name}, ${data.weather.location.country}</h3>
      <p class="weather-date" style="text-transform: none;">${currentDate} • ${isDay}</p>
    </div>
    
    <div class="weather-main">
      <div class="weather-temp-container">
        <span class="weather-temp">${Math.round(
          data.weather.current.temp_c
        )}°C</span>
        <span class="weather-feelslike" style="text-transform: none;">відчувається як: ${Math.round(
          data.weather.current.feelslike_c
        )}°C</span>
      </div>
      
      <div class="weather-condition">
        <img src="${data.weather.current.condition.icon.replace(
          "//",
          "https://"
        )}" 
             alt="${data.weather.current.condition.text}" 
             class="weather-icon" />
        <p class="weather-desc" style="text-transform: none;">${translateCondition(
          data.weather.current.condition.text
        )}</p>
      </div>
    </div>
    
    <div class="weather-details">
      <div class="weather-detail">
        <i class="fas fa-wind"></i>
        <span style="text-transform: none;">${windStrength} (${
      data.weather.current.wind_kph
    } км/год)</span>
      </div>
      <div class="weather-detail">
        <i class="fas fa-tint"></i>
        <span>Вологість: ${data.weather.current.humidity}%</span>
      </div>
      <div class="weather-detail">
        <i class="fas fa-cloud-rain"></i>
        <span>Опади: ${data.weather.current.precip_mm} мм</span>
      </div>
      <div class="weather-detail">
        <i class="fas fa-eye"></i>
        <span>Видимість: ${data.weather.current.vis_km} км</span>
      </div>
    </div>
  </div>
`;
  } catch (err) {
    console.error(err);
    weatherContainer.innerHTML = `
      <div class="weather-error">
        <p style="text-transform: none;">Не вдалося отримати дані про погоду. Спробуйте оновити сторінку.</p>
      </div>
    `;
  }
}
getWeather(url);
