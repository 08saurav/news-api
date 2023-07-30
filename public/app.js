// Define the API endpoint URL (update it to match your backend's route)
const apiUrl = "http://localhost:3000/api/news";
// const apiUrl = "http://localhost:3000/api/news";

async function getNews(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const newsContainer = document.getElementById("news-container");

    // Clear previous news
    newsContainer.innerHTML = "";

    if (data.length === 0) {
      newsContainer.innerHTML =
        "<p>No news found matching the search criteria.</p>";
    } else {
      data.forEach((article) => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
      });
    }
  } catch (error) {
    console.error("Error fetching news:", error.message);
  }
}

function createNewsCard(article) {
  const newsCard = document.createElement("div");
  newsCard.classList.add("news-card");
  newsCard.innerHTML = `
    <h2>${article.title}</h2>
    <p>${article.description}</p>
    <p>Source: ${article.source.name}</p>
    <p>Published At: ${new Date(article.publishedAt).toLocaleString()}</p>
    <a href="${article.url}" target="_blank">Read More</a>
  `;
  return newsCard;
}

document.addEventListener("DOMContentLoaded", () => {
  // Initial fetch of news without any parameters
  getNews(apiUrl);

  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchInput = document.getElementById("search-input").value.trim();
    const newsCountInput = document.getElementById("news-count").value;
    const searchInInput = document.getElementById("search-in").value;

    const queryParams = new URLSearchParams({
      q: searchInput,
      n: newsCountInput,
      in: searchInInput,
    });

    const url = `${apiUrl}?${queryParams}`;
    getNews(url);
  });
});
