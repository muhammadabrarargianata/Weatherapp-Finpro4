// state
let currCity = "";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

// Search input handler
const handleSearch = async () => {
  const searchInput = document.querySelector(".weather__searchform");
  currCity = searchInput.value;
  await getWeather();
};

// Debounce search input with a delay of 2000 milliseconds
const debouncedSearch = debounce(handleSearch, 2000);

// Event listener for search input
// document.querySelector(".weather__searchform").addEventListener('input', debouncedSearch);
document.querySelector(".weather__searchform").addEventListener('change', debouncedSearch);


// Temperature units change event listeners
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // change to metric
        units = "metric";
        // get weather forecast 
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // change to imperial
        units = "imperial";
        // get weather forecast 
        getWeather();
    }
});

// // Event listener untuk suhu dalam Celsius
// document.querySelector(".weather_unit_celsius").addEventListener('change', () => {
//   if (units !== "metric") {
//       // Mengganti ke satuan metrik
//       units = "metric";
//       // Mendapatkan prakiraan cuaca
//       getWeather();
//   }
// });

// // Event listener untuk suhu dalam Fahrenheit
// document.querySelector(".weather_unit_farenheit").addEventListener('change', () => {
//   if (units !== "imperial") {
//       // Mengganti ke satuan imperial
//       units = "imperial";
//       // Mendapatkan prakiraan cuaca
//       getWeather();
//   }
// });


// Function to convert timestamp to formatted date string
function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600; // convert seconds to hours 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options);
}

// Function to convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country);
}

// Function to fetch weather data
async function getWeather() {
    const API_KEY = 'fae3674c1823289e3d0d9f94a6b20d63';
  
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`);
      const data = await response.json();
  
      if (response.ok) {
        city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
        datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
        weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
        weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
        weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
        weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
        weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
        weather__humidity.innerHTML = `${data.main.humidity}%`;
        weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
        weather__pressure.innerHTML = `${data.main.pressure} hPa`;
      } else {
        // Handle case when city is not found or other API error
        city.innerHTML = "City not found";
        datetime.innerHTML = "";
        weather__forecast.innerHTML = "-";
        weather__temperature.innerHTML = "";
        weather__icon.innerHTML = "";
        weather__minmax.innerHTML = "";
        weather__realfeel.innerHTML = "0&#176";
        weather__humidity.innerHTML = "0%";
        weather__wind.innerHTML = "0 m/s";
        weather__pressure.innerHTML = "0 hpa";
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
  

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', getWeather);
