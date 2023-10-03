// Global Variables
var APIKey = "ac447bae7925ca40d90866afd750b493";
var currentDay = dayjs().format('MM/DD/YYYY');
var userCity = document.querySelector("#search-form");
var searchHistory = document.querySelector("#search-history")
var currWXContainer = document.querySelector("#current-container");
var fiveDayContainer = $("#five-day-container");


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
                alert("City not found");
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
            fiveDayContainer[0].innerHTML = "";

            for (let i = 0; i < fiveDayWXData.list.length; i++) {
                const daysArr = fiveDayWXData.list[i];

                if (dayjs(daysArr.dt_txt).isSame(thisDay.add(1, "day"))) {
                    console.log("found next day");
                    //display day
                    displayFiveDayWX(daysArr);
                    //update thisDay
                    thisDay = dayjs(daysArr.dt_txt);
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
}

// Display five day forecast in individual cards for each day
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
    var cityHistory = JSON.parse(localStorage.getItem("cityHist")) || [];
    console.log(cityHistory);
    cityHistory.push(cityInput);

    localStorage.setItem("cityHist", JSON.stringify(cityHistory));
    console.log(cityHistory);

    displayCityHist(cityHistory);
}

// Retrieve cities from local storage and create clickable buttons that search for that city
function displayCityHist(cityHistory) {
    searchHistory.innerHTML = "";
    console.log(cityHistory);
    for (let i = 0; i < cityHistory.length; i++) {
        var cityList = cityHistory[i];

        var cityButton = document.createElement("button");
        cityButton.textContent = cityList;

        cityButton.addEventListener("click", function () {
        });
        searchHistory.appendChild(cityButton);
    }
}

// Display CurrWX and fiveDayWX on a click on button on the history section

function displayHistoryCity (event) {
    var clickedCity = event.target.textContent;
    
    if (event.target.textContent = clickedCity) {
        getCurrWX(clickedCity);
    }
}


userCity.addEventListener('submit', formSubmitHandler);
searchHistory.addEventListener('click', displayHistoryCity)




