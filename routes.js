const express = require("express");
const router = express.Router();

// Controller for handling API routes
const newsController = require("./controllers/newsController");

// Route for fetching news articles
router.get("/news", newsController.getNews);

module.exports = router;
