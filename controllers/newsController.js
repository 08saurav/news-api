// const axios = require("axios");
// const NodeCache = require("node-cache");

// const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes

// const getNews = async (req, res) => {
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
//     console.error(url);

//     const response = await axios.get(url);

//     // Store the data in the cache
//     cache.set(cacheKey, response.data);

//     return res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching news:", error.message);
//     return res.status(500).json({ error: "Something went wrong." });
//   }
// };

// module.exports = {
//   getNews,
// };

const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL set to 5 minutes

const getNews = async (req, res) => {
  try {
    const { n, q, in: searchIn } = req.query;
    const cacheKey = `news:${n || ""}:${q || ""}:${searchIn || ""}`;

    // Check if data is present in the cache
    if (cache.has(cacheKey)) {
      console.log("Cache hit for key:", cacheKey);
      const cachedData = cache.get(cacheKey);
      return res.json(formatNewsArticles(cachedData));
    }

    console.log("Cache miss for key:", cacheKey);

    const baseUrl = "https://gnews.io/api/v4/search";
    const apiKey = "aa46755b2b9fd44ab71552aecdc7b840"; // Replace with your API key

    const queryParams = new URLSearchParams({
      token: apiKey,
      ...req.query,
    });

    const url = `${baseUrl}?${queryParams}`;

    const response = await axios.get(url);

    // Store the data in the cache
    cache.set(cacheKey, response.data);

    return res.json(formatNewsArticles(response.data));
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

// Function to format news articles
function formatNewsArticles(newsData) {
  return newsData.articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    source: article.source.name,
    publishedAt: article.publishedAt,
    image: article.image,
  }));
}

module.exports = {
  getNews,
};
