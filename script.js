document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '5d8587a1e7aeba9ffea0185c262cc073'; 
    const getWeatherButton = document.getElementById('getWeatherButton');
    const locationInput = document.getElementById('locationInput');
    const unitToggle = document.getElementById('unitToggle');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const getCurrentLocationButton = document.getElementById('getCurrentLocationButton');
    const permissionStatus = document.getElementById('permissionStatus');

    getWeatherButton.addEventListener('click', function () {
        const location = locationInput.value;
        const units = unitToggle.value;

        if (!location) {
            showError('Please enter a location.');
            return;
        }

        // Construct the API URL
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherData(data);
            })
            .catch(error => {
                showError('Error fetching weather data. Please try again later.');
                console.error('Fetch error:', error);
            });
    });

    getCurrentLocationButton.addEventListener('click', async function () {
        if (navigator.geolocation) {
            // Request geolocation permissions
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;
                const units = unitToggle.value;
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                displayWeatherData(data);
            } catch (error) {
                showError('Error fetching weather data for your location. Please try again later.');
                console.error('Geolocation or fetch error:', error);
            }
        } else {
            // Geolocation API not supported
            showPermissionStatus('Geolocation is not supported by your browser.');
        }
    });

    function displayWeatherData(data) {
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherDescription = data.weather[0].description;

        const unitSymbol = unitToggle.value === 'metric' ? '°C' : '°F';

        weatherDisplay.innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p>Temperature: ${temperature}${unitSymbol}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Weather Description: ${weatherDescription}</p>
        `;
    }

    function showError(message) {
        weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
    }

    function showPermissionStatus(message) {
        permissionStatus.textContent = message;
    }
});
