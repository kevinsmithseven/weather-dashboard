// Global Variables
var APIKey = "ac447bae7925ca40d90866afd750b493";
var currentDay = dayjs().format('MM/DD/YYYY');
var userCity = document.querySelector("#search-form");
var searchHistory = document.querySelector("#search-history")
var currWXContainer = document.querySelector("#current-container");
var fiveDayContainer = $("#five-day-container");
// var weatherIcons =
// TODO need to add icon logic - there is a path to an icon in the API data at weather[i].icon, but no image





// Handles click or enter press by user and checks if City exists
function formSubmitHandler(event) {
    event.preventDefault();

    var cityInput = userCity.elements.city.value.trim();

    if (cityInput) {
        getCurrWX(cityInput);

        storeCityHist(cityInput);

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

            // Call function to display current day weather info
            displayCurrWX(currWXdata);

            // Parse latitude and longitude from CurrWXData
            var lat = currWXdata.coord.lat;
            var lon = currWXdata.coord.lon;
            // console.log(lat);
            // console.log(lon);

            getFiveDayWX(lat, lon);


        })
        .catch(function (error) {
            console.error(error.message);
        });
}

// Function to fetch 5 day forecast for entered city
function getFiveDayWX(lat, lon) {
    var fiveDayWXURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" + "lon=" + lon + "&appid=" + APIKey + "&units=imperial";

    fetch(fiveDayWXURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (fiveDayWXData) {
            console.log(fiveDayWXData);


            var thisDay = dayjs(currentDay);

            for (let i = 0; i < fiveDayWXData.list.length; i++) {
                const d = fiveDayWXData.list[i];

                if (dayjs(d.dt_txt).isSame(thisDay.add(1, "day"))) {
                    console.log("found next day");
                    //display day
                    displayFiveDayWX(d);
                    //update thisDay
                    thisDay = dayjs(d.dt_txt);
                }
            }
        })
}

// Display current weather data on right portion of screen
function displayCurrWX(currWXdata) {

    var currWXCityDate = document.createElement("h3");
    var currWXTemp = document.createElement("p");
    var currWXWind = document.createElement("p");
    var currWXHum = document.createElement("p");
    currWXContainer.textContent = "";
    currWXCityDate.textContent = currWXdata.name + "  (" + currentDay + ")"
    currWXTemp.textContent = "Temp: " + currWXdata.main.temp + " °F";
    currWXWind.textContent = "Wind: " + currWXdata.wind.speed + " MPH";
    currWXHum.textContent = "Humidity: " + currWXdata.main.humidity + "%";
    currWXContainer.append(currWXCityDate);
    currWXContainer.append(currWXTemp);
    currWXContainer.append(currWXWind);
    currWXContainer.append(currWXHum);

    //* Attempting to append an image based on description in array
    // if (currWXdata.weather[0].description = "few clouds")
    //     currWXCityDate.appendChild()
}

//* Display five day forecast in individual cards for each day

function displayFiveDayWX(dayObj) {
    var cardHTML = $(`
    <div class="col">
        <div class="card">
        <img src="https://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png" class="card-img-top" alt="${dayObj.weather[0].description}">
        <div class="card-body">
            <h5 class="card-title">${dayjs(dayObj.dt_txt).format("MM/DD/YYYY")}</h5>
            <ul>
            <li>Temp: ${dayObj.main.temp} °F</li>
            <li>Wind: ${dayObj.wind.speed} MPH</li>
            <li>Humidity: ${dayObj.main.humidity}%</li>
            </ul>
        </div>
        </div>
    </div>
    `);

    fiveDayContainer.append(cardHTML);
}


function storeCityHist(cityInput) {
    localStorage.setItem("city", cityInput);
}

function displayCityHist() {
    
}





userCity.addEventListener('submit', formSubmitHandler);
// console.log(userCity);

// console.log(currentDay);


