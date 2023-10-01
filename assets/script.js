// Global Variables
var APIKey = "ac447bae7925ca40d90866afd750b493";
var currentDay = dayjs().format('MM/DD/YYYY');
var userCity = document.querySelector("#search-form");
var searchHistory = document.querySelector("#search-history")
var currWXContainer = document.querySelector("#current-container");
var fiveDayContainer = document.querySelector("#five-day-container");
// var weatherIcons =





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

            // Parse latitude and longitude from CurrWXData
            var lat = currWXdata.coord.lat;
            var lon = currWXdata.coord.lon;
            // console.log(lat);
            // console.log(lon);

            getFiveDayWX();

            // Function to fetch 5 day forecast for entered city
            function getFiveDayWX() {
                var fiveDayWXURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" + "lon=" + lon + "&appid=" + APIKey + "&units=imperial";

                fetch(fiveDayWXURL)
                    .then(function (response) {
                        if (response.ok) {
                            return response.json();
                        }
                    })
                    .then(function (fiveDayWXData) {
                        console.log(fiveDayWXData);


                        // var dateTime = [];

                        // for (let i = 0; i < fiveDayWXData.list.length; i++) {
                        //     var dateTimeArr = fiveDayWXData.list[i].dt_txt.split(" ");
                        //     dateTime.push(...dateTimeArr);
                        //     console.log(dateTimeArr);

                        //     var date = [];

                        //     for (let i = 0; i < dateTimeArr.length; i++) {
                        //     var dateArr = dateTimeArr[i].split(",");
                        //     date.push(...dateArr);
                        //     console.log(dateArr);
                        //     }
                        // }

                        // Attempting to use UNIX instead of above

                        var dateNew = [];

                        for (let i = 0; i < fiveDayWXData.list.length; i++) {
                            var dateArrNew = fiveDayWXData.list[i].dt;
                            var reformatDate = dayjs.unix(dateArrNew).format("MM/DD/YYYY");
                            dateNew.push(reformatDate);
                            console.log(dateNew);
                        }

                        // Calculate average temp - how do I associate with the date and exclude current day?
                        var totalTemp = 0;
                        for (let i = 0; i < fiveDayWXData.list.length; i++) {
                            var temp = fiveDayWXData.list[i].main.temp;
                            totalTemp += temp;
                        }
                        var avgTemp = totalTemp / fiveDayWXData.list.length;
                        console.log(avgTemp);
                        var avgTempRound = Math.round(avgTemp * 100) / 100;
                        console.log(avgTempRound);

                        


                        // displayFiveDayWX(fiveDayWXData);
                    })
            }
        })
        .catch(function (error) {
            console.error(error.message);
        });
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

    // Attempting to append an image based on description in array
    // if (currWXdata.weather[0].description = "few clouds")
    //     currWXCityDate.appendChild()
}

// Display five day forecast in individual cards for each day
// function displayFiveDayWX(fiveDayWXData) {

// }





userCity.addEventListener('submit', formSubmitHandler);
// console.log(userCity);

// console.log(currentDay);


