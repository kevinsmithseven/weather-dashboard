// Global Variables
var APIKey = "ac447bae7925ca40d90866afd750b493";
var currentDay = dayjs().format('MM/DD/YYYY');
var userCity = document.querySelector("#search-form");
var searchHistory = document.querySelector("#search-history")
var currWXContainer = document.querySelector("#current-container");
var fiveDayContainer = document.querySelector("#five-day-container");




// Handles click or enter press by user and checks if City exists
function formSubmitHandler(event) {
    event.preventDefault();

    var cityInput = userCity.elements.city.value.trim();

    if (cityInput) {
        getCurrWX(cityInput);

        // Add city to local storage and add clickable button

    } else {
        alert("Please enter a valid city name");
    }
}

// Function to fetch current weather data
function getCurrWX(cityInput) {
    var currWXURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey + "&units=imperial"

    fetch(currWXURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("City not found");
            }
        })
        .then(function (currWXdata) {
            //display data logic
            console.log(currWXdata);


            displayCurrWX(currWXdata);
            //need to grab long and lat and do another fetch to get 5 Day forecast
            var lat = currWXdata.coord.lat;
            var lon = currWXdata.coord.lon;
            console.log(lat);
            console.log(lon);


        })
        .catch(function (error) {
            console.error(error.message);
        });
}

function displayCurrWX(currWXdata) {
    
    var currWXCityDate = document.createElement("h3");
    var currWXTemp = document.createElement("p");
    var currWXWind = document.createElement("p");
    var currWXHum = document.createElement("p");
    currWXContainer.textContent = "";
    currWXCityDate.textContent = currWXdata.name + "  (" + currentDay + ")";
    currWXTemp.textContent = "Temp: " + currWXdata.main.temp + " °F";
    currWXWind.textContent = "Wind: " + currWXdata.wind.speed + " MPH";
    currWXHum.textContent = "Humidity: " + currWXdata.main.humidity + "%";
    currWXContainer.append(currWXCityDate);
    currWXContainer.append(currWXTemp);
    currWXContainer.append(currWXWind);
    currWXContainer.append(currWXHum);
}


 
  



userCity.addEventListener('submit', formSubmitHandler);
console.log(userCity);

console.log(currentDay);

