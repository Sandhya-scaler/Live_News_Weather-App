const GNEWS_API_KEY = "4d2607c82545680eabea2e01b9075699"; // Gnews API Key
const WEATHER_API_KEY = "3fc727f143c08c298801a7df1d865ddf"; // OpenWeather API key
let currentCategory = "technology";

// Fetch News from GNews
async function fetchNews(query = "") {
    try {
        let url = `https://gnews.io/api/v4/top-headlines?category=${currentCategory}&lang=en&apikey=${GNEWS_API_KEY}`;
        if (query) {
            url = `https://gnews.io/api/v4/search?q=${query}&lang=en&apikey=${GNEWS_API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.articles?.length) {
            displayNews(data.articles);
        } else {
            document.getElementById("newsContainer").innerHTML = "<p>No news found.</p>";
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("newsContainer").innerHTML = "<p>Failed to load news.</p>";
    }
}

// Display News
function displayNews(articles) {
    const newsContainer = document.getElementById("newsContainer");
    newsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.image || !article.title || !article.description || !article.url) return;

        const newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.innerHTML = `
            <img src="${article.image}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
    });
}

// Fetch Weather
async function fetchWeather() {
    const location = document.getElementById("locationInput")?.value || "New York";

    try {
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            alert("Location not found.");
            return;
        }

        let emoji = "🌍";
        const condition = weatherData.weather[0].description.toLowerCase();

        if (condition.includes("clear")) emoji = "☀";
        else if (condition.includes("cloud")) emoji = "☁";
        else if (condition.includes("rain")) emoji = "🌧";
        else if (condition.includes("thunderstorm")) emoji = "⛈";
        else if (condition.includes("snow")) emoji = "❄";
        else if (condition.includes("mist") || condition.includes("fog")) emoji = "🌫";

        const weatherPage = window.open("", "_blank");
        if (weatherPage) {
            weatherPage.document.write(`
                <html>
                <head>
                    <title>Weather Information</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: linear-gradient(to bottom, #001F3F, #004080); color: white; }
                        .weather-container { padding: 20px; background: rgba(255, 255, 255, 0.2); border-radius: 10px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="weather-container">
                        <h2>Weather in ${weatherData.name}</h2>
                        <p style="font-size: 2em;">${emoji}</p>
                        <p>${weatherData.main.temp}°C, ${weatherData.weather[0].description}</p>
                    </div>
                </body>
                </html>
            `);
        } else {
            alert("Pop-ups are blocked! Allow pop-ups to see the weather.");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Failed to load weather.");
    }
}

// Update category
async function setCategory(category) {
    currentCategory = category;
    await fetchNews();

    document.querySelectorAll(".categories button").forEach(btn => btn.classList.remove("active"));
    const activeButton = document.querySelector(`.categories button[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

// Update Date & Time
function updateDateTime() {
    document.getElementById("dateTime").innerText = new Date().toLocaleString();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
    fetchWeather();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
