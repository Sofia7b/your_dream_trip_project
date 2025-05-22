require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.WEATHER_API_KEY;
const rateLimit = require("express-rate-limit");
const BACKEND_URL = `http://api.weatherapi.com/v1/forecast.json`;
const limiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: "Слишком много запросов",
});
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);
app.use(express.json());
app.use(limiter);
const AUTH_STRATEGY = process.env.AUTH_STRATEGY || "API_KEY";
function getAuth(request) {
  const query = {
    q: request.query.city || "Paris",
    dates: 5,
  };
  const headers = {};
  switch (AUTH_STRATEGY) {
    case "API_KEY":
      query.key = KEY;
      break;
    case "JWT":
      headers.Autorization = `Bearer ${req.cookies?.token || ""}`;
      break;
    case "OAUTH":
      headers.Autorization = `Bearer ${req.headers["x-excess-token"] || ""}`;
      break;
  }
  return {
    headers,
    params: query,
  };
}

app.get("/weather", async (req, res) => {
  try {
    const config = getAuth(req);
    console.log(config);
    const response = await axios.get(BACKEND_URL, config);

    res.json({ weather: response.data });
  } catch (error) {
    console.error("[Error] Не удалось получить погоду...", error.message);
    res.status(502).json({
      error: "Не удалось загрузить погоду",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
