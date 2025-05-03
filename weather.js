// weather.js
document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '64973089fe6a4015bab192414253004';
    let currentCity = 'Cairo';
    let weatherData = null;

    const elements = {
        citySearch: document.getElementById('city-search'),
        searchBtn: document.getElementById('search-btn'),
        currentDay: document.getElementById('current-day'),
        currentDate: document.getElementById('current-date'),
        location: document.getElementById('location'),
        currentTemp: document.getElementById('current-temp'),
        currentCondition: document.getElementById('current-condition'),
        humidity: document.getElementById('humidity'),
        wind: document.getElementById('wind'),
        emailInput: document.getElementById('email'),
        subscribeBtn: document.getElementById('subscribe-btn'),
        forecastCards: document.querySelectorAll('.forecast-card'),
        weatherIcon: document.querySelector('.weather-icon'),
        socialIcons: document.querySelectorAll('.social-icons a')
    };

    const weatherIcons = {
        'Sunny': 'fa-sun sunny-icon',
        'Clear': 'fa-moon night-icon',
        'Cloudy': 'fa-cloud cloudy-icon',
        'Rain': 'fa-cloud-rain rainy-icon',
        'Thunderstorm': 'fa-bolt storm-icon',
        'Snow': 'fa-snowflake snow-icon',
        'Mist': 'fa-smog mist-icon',
        'Partly cloudy': 'fa-cloud-sun partly-cloudy-icon'
    };

    function init() {
        setupEventListeners();
        fetchWeather(currentCity);
        updateWeatherIcon('Sunny');
    }

    function setupEventListeners() {
        elements.searchBtn.addEventListener('click', handleSearch);
        elements.citySearch.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleSearch();
        });

        elements.subscribeBtn.addEventListener('click', function () {
            const email = elements.emailInput.value.trim();
            if (email && validateEmail(email)) {
                alert('Thank you for subscribing!');
                elements.emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });

        elements.socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-5px)';
                this.style.backgroundColor = '#3498db';
                this.style.color = 'white';
            });

            icon.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.backgroundColor = '#ecf0f1';
                this.style.color = '#7f8c8d';
            });
        });
    }

    function handleSearch() {
        const city = elements.citySearch.value.trim();
        if (city) {
            currentCity = city;
            fetchWeather(currentCity);
        } else {
            alert('Please enter a city name');
        }
    }

    function fetchWeather(city) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        document.querySelector('main').prepend(loadingIndicator);

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4&aqi=no&alerts=no`)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => {
                weatherData = data;
                updateCurrentWeather(data);
                updateForecast(data.forecast.forecastday);
                loadingIndicator.remove();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('City not found. Please try another location.');
                loadingIndicator.remove();
            });
    }

    function updateCurrentWeather(data) {
        if (!data.current || !data.location) return;

        const date = new Date(data.location.localtime);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        elements.currentDay.textContent = days[date.getDay()];
        elements.currentDate.textContent = `${date.getDate()} ${months[date.getMonth()]}`;
        elements.location.textContent = data.location.name;
        elements.currentTemp.textContent = `${data.current.temp_c}°C`;
        elements.currentCondition.textContent = data.current.condition.text;
        elements.humidity.textContent = `${data.current.humidity}%`;
        elements.wind.textContent = `${data.current.wind_kph}km/h`;
        updateWeatherIcon(data.current.condition.text);
    }

    function updateForecast(forecastData) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date().getDay();

        elements.forecastCards.forEach((card, i) => {
            const forecastDay = forecastData[i + 1];
            if (!forecastDay) return;

            const dayIndex = (today + i + 1) % 7;
            const dayElement = card.querySelector('.day');
            const highTempElement = card.querySelector('.temp-high');
            const lowTempElement = card.querySelector('.temp-low');
            const conditionElement = card.querySelector('.condition');
            const conditionIcon = card.querySelector('.condition-icon');

            if (dayElement) dayElement.textContent = days[dayIndex];
            if (highTempElement) highTempElement.textContent = `${forecastDay.day.maxtemp_c}°C`;
            if (lowTempElement) lowTempElement.textContent = `${forecastDay.day.mintemp_c}°`;
            if (conditionElement) conditionElement.textContent = forecastDay.day.condition.text;

            if (conditionIcon) {
                const iconClass = weatherIcons[forecastDay.day.condition.text] || 'fa-cloud';
                conditionIcon.className = `fas ${iconClass} condition-icon`;
            }
        });
    }

    function updateWeatherIcon(conditionText) {
        if (!elements.weatherIcon) return;
        const iconClass = weatherIcons[conditionText] || 'fa-cloud';
        elements.weatherIcon.className = `fas ${iconClass} weather-icon`;
        elements.weatherIcon.style.animation = 'pulse 2s infinite';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    init();

    // Smooth scroll to contact section
    document.querySelector('a[href="#contact"]').addEventListener('click', function (event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 50,
            behavior: 'smooth'
        });
    });
});
