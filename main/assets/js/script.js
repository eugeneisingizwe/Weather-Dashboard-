var searchInput = document.querySelector("#enterCity");
var form = document.querySelector("#form");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"))||[];
var APIKey = "4611b2cedce9965f8a30b04bfa26cc7d";
var forecastContainer = document.querySelector("#cityDetail");
var fiveDayContainer = document.querySelector("#fiveDay");
var searchBtn = document.querySelector("#searchBtn");
var searchHistoryBtn = document.querySelector("#searchHistory");

console.log(searchBtn);
console.log(searchHistory);

var today = moment().format('L');

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

function getCityLatLon(city){
    // var city = searchInput.value;
    console.log(city);
    
   var cityLatLonUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
   console.log(cityLatLonUrl);
   fetch(cityLatLonUrl).then(function(response){
    return response.json();
   })

   .then(function (data) {
       console.log("fetch by city name", data);

       $("#weatherContent").css("display", "block");
       $("#cityDetail").empty();

       var iconCode = data.weather[0].icon;
       var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

       var currentCityWeather = $(`<h2 id="currentCityWeather">
       ${data.name} ${today} <img src = "${iconURL}" alt="${data.weather[0].description}" /> </h2>
       <p>Temperature: ${data.main.temp} °F</p>
       <p>Humidity: ${data.main.humidity}\%</p>
       <p>Wind Speed: ${data.wind.speed} MPH</p>
       `);

       $("#cityDetail").append(currentCityWeather);

       var lat = data.coord.lat;
        var lon = data.coord.lon;

        var timeZoneQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
        fetch(timeZoneQueryUrl).then(function(response){
            return response.json();
        })
        .then(function(uviResponse){
         console.log(uviResponse);
         
         var timeZone = uviResponse.timezone;
         console.log(timeZone);
         var uvIndexP = $(`
                <p>Time Zone: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${timeZone}</span>
                </p>
            `);
            $("#cityDetail").append(uvIndexP);

            fiveDayForecast(lat, lon);

            if (timeZone >= 0 && timeZone <= 2) {
                $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (timeZone >= 3 && timeZone <= 5) {
                $("#uvIndexColor").css("background-color", "#FFF300");
            } else if (timeZone >= 6 && timeZone <= 7) {
                $("#uvIndexColor").css("background-color", "#F18B00");
            } else if (timeZone >= 8 && timeZone <= 10) {
                $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
            } else {
                $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white"); 
            };  
        });
        

   
       saveTolocalStorage(data.name)

         fiveDayForecast(lat, lon);
       
   })
}


   function fiveDayForecast (lat, lon){

           
     var fiveDayForecastUrl =  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;

     fetch(fiveDayForecastUrl).then(function(response){
        return response.json();
     })
        .then(function(data){
            console.log("five day forecast", data);

            
            fiveDayContainer.innerHTML = "<h4>5-Day Forecast</h4>";
          

            //array to obtain the five day forecast date

            var daysArr = [data.list[6], data.list[14], data.list[22], data.list[30], data.list[38]];
            var cardContainer = document.createElement("div")
            cardContainer.setAttribute("class", "row");

            
            //loop through through the five day forecast date

            for ( var i = 0; i < daysArr.length; i++){

                console.log("loop for five day forecast", daysArr);
                
                //Variable to call the five day forecast
                var cityInfo = {

                     date : daysArr[i].dt,
                    icon : daysArr[i].weather[0].icon,
                     temp : daysArr[i].main.temp,
                     wind : daysArr[i].wind.speed,
                     humidity : daysArr[i].main.humidity,
                } ;

            

            //create element, add text content to the created elements, and set attrabute 
            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${daysArr[i].weather[0].main}" />`;

            var cardEl = $(`
                <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                <div class="card-body">
                <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Wind Speed: ${cityInfo.wind.speed} MPH</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `)

          
                $("#fiveDay").append(cardEl);

                
            }

        })
   }


searchBtn.addEventListener("click", handlesearchInput);