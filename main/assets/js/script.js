var searchInput = document.querySelector("#search-input");
var form = document.querySelector("#form");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"))||[];
var APIKey = "4611b2cedce9965f8a30b04bfa26cc7d";
var forecastContainer = document.querySelector("#forecast-contianer");
var fiveDayContainer = document.querySelector("#fiveday-forecast");
var searchBtn = document.querySelector("#search-btn");
var searchHistoryBtn = document.querySelector("#search-history");

console.log(searchHistory);


//function to handle the search input and remove the white space 
saveHistory();

function handlesearchInput (event){
    event.preventDefault();
    var userInput = searchInput.value.trim();
    getCityLatLon(userInput);

}

//function to save user input to the locol storage

function saveTolocalStorage(city){


//check to see if there is a duplicate in the search history
    if (searchHistory.indexOf(city) !== -1){
        return;
    }

    //Add push function to add new searched city to the search history

    searchHistory.push(city);

    //save the searched history to the locol storage

    var myJson = JSON.stringify(searchHistory)

    localStorage.setItem("searchHistory", myJson)


}


//Function to retrive date form the locol storage to save the userinput searched

function retriveLocoalStorage (){
    var history = localStorage.getItem(searchHistory);
      if (history){
       searchHistory = JSON.parse(history);
}

}

retriveLocoalStorage();


// Function to control the functionally of the seach history
function saveHistory (){

    searchHistoryBtn.innerHTML =""

    for (var i = 0; i < searchHistory.length; i++){

        var btn = document.createElement("button");
        btn.textContent = searchHistory[i];
        btn.setAttribute("value", searchHistory[i]);
        btn.addEventListener("click", historyBtn);
        searchHistoryBtn.append(btn);
    }
}

function historyBtn(event){
    event.preventDefault();
    console.log(event);
    getCityLatLon(this.value);



}


//Function to get the city date from  the API

function getCityLatLon(){
    var city = searchInput.value;
    console.log(city);
    
   var cityLatLonUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid="+ APIKey;
   console.log(cityLatLonUrl);
   fetch(cityLatLonUrl).then(function(response){
    return response.json();
   })

   .then(function (date) {
       console.log("fetch by city name", date);
       
       var lat = date.coord.lat
       var lon = date.coord.lon
       getCurrentWeather(lat, lon);
       fiveDayForecast(lat, lon);
       saveTolocalStorage(date.name)
       
   })
}

//Function takes the city lalitude and longitude and returns a selected city date from the API to display current date, temp, wind, and humdidity 

function getCurrentWeather(lat, lon){
 
    var weatherForecastUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    fetch(weatherForecastUrl).then(function(response){
        return response.json();
    })
        .then(function(data){
            console.log("Current Weather", data);

            forecastContainer.innerHTML = "";

            // variables for the date API call 

            var city = data.name;
            console.log(city);

            var date = new Date(data.dt * 1000).toLocaleDateString();
            var icon = data.weather[0].icon;
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;


          

            var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";

            //create elements and append elemements for the weather forcast
            var cardEl  = document.createElement("div");
                cardEl.setAttribute("class", "card col-8 m-2");
                // cardEl.setAttribute('style', 'position:absolute;left:-70px;opacity:0.4;border-radius: 150px;-webkit-border-radius: 150px;-moz-border-radius: 150px;');
            var cardBodyEl = document.createElement("div");
                cardBodyEl.setAttribute("class", "card-body");
            var cityEl = document.createElement("h1");
                cityEl.textContent = city + " " + date;
                cityEl.setAttribute("class", "card-title");
            var iconEl = document.createElement("img");
                iconEl.setAttribute("src", iconUrl);
            var tempEl = document.createElement("h4");
                tempEl.textContent = "Temp:" + temp;
                 tempEl.setAttribute("class", "card-text");
            var windEl = document.createElement("h4");
                windEl.textContent = "Wind:" + wind;
                windEl.setAttribute("class", "card-text");
            var humidityEl = document.createElement("h4");
                humidityEl.textContent = "Humidity:" + humidity;
                humidityEl.setAttribute("class", "card-text");

          //append created elements 

          cardBodyEl.append(cityEl,iconEl, tempEl, windEl, humidityEl);
          cityEl.append(cardEl);
          forecastContainer.append(cardBodyEl);
          


        })

}


 //function to request the five day forecast 

   function fiveDayForecast (lat, lon){
    
     var fiveDayForecastUrl =  "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

     fetch(fiveDayForecastUrl).then(function(response){
        return response.json();
     })
        .then(function(data){
            console.log("five day forecast", data);

            fiveDayContainer.innerHTML = "<h1>5-Day Forecast</h1>";
           

            //array to obtain the five day forecast date

            var daysArr = [data.list[6], data.list[14], data.list[22], data.list[30], data.list[38]];
            var cardContainer = document.createElement("div")
            cardContainer.setAttribute("class", "row");

            //loop through through the five day forecast date

            for ( var i = 0; i < daysArr.length; i++){

                console.log("loop for five day forecast", daysArr);
                
                //Variable to call the five day forecast 
                var date = new Date(daysArr[i].dt * 1000).toLocaleDateString();
                var icon = daysArr[i].weather[0].icon;
            var temp = daysArr[i].main.temp;
            var wind = daysArr[i].wind.speed;
            var humidity = daysArr[i].main.humidity;

            //create element, add text content to the created elements, and set attrabute 

            var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";

            var cardEl  = document.createElement("div");
                cardEl.setAttribute("class", "card col-md-2 m-2");
            var cardBodyEl = document.createElement("div");
                cardBodyEl.setAttribute("class", "card-body");
            var dateEl = document.createElement("h3");
                dateEl.textContent = date;
                dateEl.setAttribute("class", "card-title");
            var iconEl = document.createElement("img");
                iconEl.setAttribute("src", iconUrl);
            var tempEl = document.createElement("h4");
                tempEl.textContent = "temp:" + temp;
                tempEl.setAttribute("class", "card-text");
            var windEl = document.createElement("h4");
                windEl.textContent = "wind:" + wind;
                windEl.setAttribute("class", "card-text");
            var humidityEl = document.createElement("h4");
                humidityEl.textContent = "humidity:" + humidity;
                humidityEl.setAttribute("class", "card-text");

                //appeend the created elements 
                
                cardBodyEl.append(dateEl,iconEl,tempEl,windEl,humidityEl);
                cardEl.append(cardBodyEl);
                fiveDayContainer.append(cardEl);

                
            }

        })
   }


searchBtn.addEventListener("click", handlesearchInput);