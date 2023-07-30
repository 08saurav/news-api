const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const cors = require("cors"); // Import the cors package
const app = express();
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes

// Middleware to parse JSON data in request body
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Serve the frontend static files
app.use(express.static("public"));

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API endpoint for fetching news articles
app.get("/api/news", async (req, res) => {
  try {
    const { n, q, in: searchIn } = req.query;
    const cacheKey = `news:${n || ""}:${q || ""}:${searchIn || ""}`;

    // Check if data is present in the cache
    if (cache.has(cacheKey)) {
      console.log("Cache hit for key:", cacheKey);
      const cachedData = cache.get(cacheKey);
      return res.json(cachedData);
    }

    console.log("Cache miss for key:", cacheKey);

    const baseUrl = "https://gnews.io/api/v4/search";
    const apiKey = "aa46755b2b9fd44ab71552aecdc7b840"; // Replace with your GNews API key

    const queryParams = new URLSearchParams({
      token: apiKey,
      ...req.query,
    });

    const url = `${baseUrl}?${queryParams}`;

    const response = await axios.get(url);

    // Store the data in the cache
    cache.set(cacheKey, response.data.articles);

    return res.json(response.data.articles);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
