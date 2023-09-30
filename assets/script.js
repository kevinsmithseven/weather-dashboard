// Global Variables
var APIKey = "ac447bae7925ca40d90866afd750b493";
var userCity = document.querySelector("#search-form");


// Handles click or enter press by user and checks if City exists
function formSubmitHandler(event) {
    event.preventDefault();

    var cityInput = userCity.elements.city.value.trim();

    if (cityInput) {
        getCurrWX(cityInput);

        // Add city to a new button in history
        alert("Please enter a valid city name");
    }
}

// Function to fetch current weather data
function getCurrWX(cityInput) {
    var currWXURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey;

    fetch(currWXURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("City not found");
            }
        })
        .then(function (data) {
            //display data logic
            console.log(data);
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

userCity.addEventListener('submit', formSubmitHandler);
console.log(userCity);

