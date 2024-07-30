const apiKey = 'b7b204ded01d6e1f9c448b7b38b7503e';

function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
}

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data: ' + error.message);
        });
}

function displayWeatherData(data) {
    const temperature = data.main.temp;
    const iconCode = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;

    document.getElementById('temp-div').innerHTML = `<p>${Math.round(temperature)}°C</p>`;
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}.png`;
    weatherIcon.alt = weatherDescription;
    weatherIcon.style.display = 'block';

    fetchHourlyForecast(data.coord.lat, data.coord.lon);
}

function fetchHourlyForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hourly forecast not available');
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
        });
}

function displayHourlyForecast(data) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = ''; // Clear previous data

    data.list.slice(0, 8).forEach(item => {
        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;

        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <p>${hour}:00</p>
            <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>${temp}°C</p>
        `;
        hourlyForecast.appendChild(hourlyItem);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', getWeather);
});