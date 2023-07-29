// const express = require("express");
// const axios = require("axios");
// const NodeCache = require("node-cache");

// const app = express();
// const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes

// // Middleware to parse JSON data in request body
// app.use(express.json());

// // API endpoint for fetching news articles
// app.get("/api/news", async (req, res) => {
//   try {
//     const { n, q, in: searchIn } = req.query;
//     const cacheKey = `news:${n || ""}:${q || ""}:${searchIn || ""}`;

//     // Check if data is present in the cache
//     if (cache.has(cacheKey)) {
//       const cachedData = cache.get(cacheKey);
//       return res.json(cachedData);
//     }

//     const baseUrl = "https://gnews.io/api/v4/search";
//     const apiKey = "aa46755b2b9fd44ab71552aecdc7b840"; // Replace with your API key

//     const queryParams = new URLSearchParams({
//       token: apiKey,
//       ...req.query,
//     });

//     const url = `${baseUrl}?${queryParams}`;

//     const response = await axios.get(url);

//     // Store the data in the cache
//     cache.set(cacheKey, response.data);

//     return res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching news:", error.message);
//     return res.status(500).json({ error: "Something went wrong." });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// const express = require("express");
// const axios = require("axios");
// const NodeCache = require("node-cache");

// const app = express();
// const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes
// const path = require("path");

// ...

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON data in request body
// app.use(express.json());

// // API endpoint for fetching news articles
// const express = require("express");
// const axios = require("axios");
// const NodeCache = require("node-cache");

// const app = express();
// const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes

// // Middleware to parse JSON data in request body
// app.use(express.json());

// // Serve the frontend static files
// app.use(express.static("public"));

// // API endpoint for fetching news articles
// app.get("/api/news", async (req, res) => {
//   try {
//     const { n, q, in: searchIn } = req.query;
//     const cacheKey = `news:${n || ""}:${q || ""}:${searchIn || ""}`;

//     // Check if data is present in the cache
//     if (cache.has(cacheKey)) {
//       console.log("Cache hit for key:", cacheKey);
//       const cachedData = cache.get(cacheKey);
//       return res.json(cachedData);
//     }

//     console.log("Cache miss for key:", cacheKey);

//     const baseUrl = "https://gnews.io/api/v4/search";
//     const apiKey = "aa46755b2b9fd44ab71552aecdc7b840"; // Replace with your GNews API key

//     const queryParams = new URLSearchParams({
//       token: apiKey,
//       ...req.query,
//     });

//     const url = `${baseUrl}?${queryParams}`;

//     const response = await axios.get(url);

//     // Store the data in the cache
//     cache.set(cacheKey, response.data.articles);

//     return res.json(response.data.articles);
//   } catch (error) {
//     console.error("Error fetching news:", error.message);
//     return res.status(500).json({ error: "Something went wrong." });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const cors = require("cors"); // Import the cors package
const app = express();
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes

// Middleware to parse JSON data in request body
app.use(express.json());

app.use(
  cors({
    origin: "http://127.0.0.1:60681",
  })
);
// Serve the frontend static files
app.use(express.static("public"));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});