require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

class IWeatherService {
  async getWeather(city, days, headers) {
    throw new Error("Not implemented");
  }
}

class CoreWeatherService extends IWeatherService {
  async getWeather(city, days = 5, headers = {}) {
    const res = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${city}&days=${days}`,
      { headers }
    );
    return res.data;
  }
}

class WeatherProxy extends IWeatherService {
  constructor(realService = new CoreWeatherService(), { apiKey, getToken }) {
    super();
    this.realService = realService;
    this.apiKey = apiKey;
    this.getToken = getToken;
  }

  async getWeather(city, days = 5) {
    const headers = {
      "API-KEY": this.apiKey,
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    return this.realService.getWeather(city, days, headers);
  }
}

const weatherService = new WeatherProxy(new CoreWeatherService(), {
  apiKey: process.env.WEATHER_API_KEY,
  getToken: async () => null,
});

app.use(cors());
app.use(express.json());

app.get("/weather", async (req, res) => {
  try {
    const data = await weatherService.getWeather(req.query.city || "Paris");
    res.json({ weather: data });
  } catch (e) {
    console.error("[Помилка]", e.message);
    res.status(502).json({ error: "Не вдалося завантажити погоду" });
  }
});
app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
