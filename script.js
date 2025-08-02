// --- Popular Indian Cities Weather Cards ---
const popularCities = [
    { name: 'Delhi' },
    { name: 'Mumbai' },
    { name: 'Bangalore' },
    { name: 'Kolkata' },
    { name: 'Chennai' },
    { name: 'Hyderabad' },
    { name: 'Pune' },
    { name: 'Ahmedabad' }
];

const apiKey = '9406fcdccec035d9cf44912d235aca02';
const popularCitiesContainer = document.getElementById('popular-cities');

function createCityCard(city, weather) {
    const card = document.createElement('div');
    card.className = 'city-card collapsed';
    card.innerHTML = `
        <div class="city-name">${city.name}</div>
        <div class="city-temp">${weather ? `${Math.round(weather.main.temp)}°C` : '--'}</div>
        <div class="city-details">
            ${weather ? `
                <div><strong>Weather:</strong> ${weather.weather[0].main} - ${weather.weather[0].description}</div>
                <div><strong>Humidity:</strong> ${weather.main.humidity}%</div>
                <div><strong>Wind:</strong> ${weather.wind.speed} m/s</div>
            ` : '<div>Loading...</div>'}
        </div>
    `;
    // Expand/collapse on hover (desktop) and click (mobile)
    card.addEventListener('mouseenter', () => {
        card.classList.add('expanded');
        card.classList.remove('collapsed');
    });
    card.addEventListener('mouseleave', () => {
        card.classList.remove('expanded');
        card.classList.add('collapsed');
    });
    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
        card.classList.toggle('collapsed');
    });
    return card;
}

function updateCityCard(card, city, weather) {
    card.querySelector('.city-temp').textContent = weather ? `${Math.round(weather.main.temp)}°C` : '--';
    card.querySelector('.city-details').innerHTML = weather ? `
        <div><strong>Weather:</strong> ${weather.weather[0].main} - ${weather.weather[0].description}</div>
        <div><strong>Humidity:</strong> ${weather.main.humidity}%</div>
        <div><strong>Wind:</strong> ${weather.wind.speed} m/s</div>
    ` : '<div>Loading...</div>';
}

function fetchAndDisplayPopularCities() {
    if (!popularCitiesContainer) return;
    popularCitiesContainer.innerHTML = '';
    popularCities.forEach(city => {
        const card = createCityCard(city, null);
        popularCitiesContainer.appendChild(card);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.name)}&appid=${apiKey}&units=metric`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) updateCityCard(card, city, data);
            });
    });
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayPopularCities);


const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

function getWeather(city) {
    weatherInfo.innerHTML = 'Loading...';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Create a card for the searched city
            const card = document.createElement('div');
            card.className = 'city-card collapsed';
            card.innerHTML = `
                <div class="city-name">${data.name}, ${data.sys.country}</div>
                <div class="city-temp">${Math.round(data.main.temp)}°C</div>
                <div class="city-details">
                    <div><strong>Weather:</strong> ${data.weather[0].main} - ${data.weather[0].description}</div>
                    <div><strong>Humidity:</strong> ${data.main.humidity}%</div>
                    <div><strong>Wind:</strong> ${data.wind.speed} m/s</div>
                </div>
            `;
            card.addEventListener('mouseenter', () => {
                card.classList.add('expanded');
                card.classList.remove('collapsed');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('expanded');
                card.classList.add('collapsed');
            });
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
                card.classList.toggle('collapsed');
            });
            weatherInfo.innerHTML = '';
            weatherInfo.appendChild(card);
        })
        .catch(() => {
            weatherInfo.innerHTML = '<p style="color:red;">City not found. Please try again.</p>';
        });
}
