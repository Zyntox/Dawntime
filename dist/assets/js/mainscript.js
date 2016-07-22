// Helper function : Got tired of writing document.getEleme....
function outputToDomById(id, value){
    document.getElementById(id).innerHTML = value;
}

// *NOT FUNCTIONAL* Needs to be updated!! 
function removeError(id){
    console.log(id);
    var element = document.getElementById(id),
        parent = element.parentNode;

    console.log(element);
    
    parent.removeChild(element);
}

// Creates a new errormessage and appends it to the error container list. 
function addErrorMessageToList(message){
     
    /*  Function for keeping track of how many error messages there are in "errorcontainer__list". 
        If zera, return that. If there are more than one item, return the id of the last item and 
        plus one to the returned number.The number will be used to set an ID to a newly created error message.
    */

    function fetchIndex(){
        var elements = document.getElementById('errorcontainer__list'),
            num = elements.childElementCount;

        if (num == 0)
            return 0;
        else
            return Number(elements.childNodes[num].id) + 1;
    }

    
    
    var id = fetchIndex();

    var container = document.getElementById('errorcontainer__list');
    var element = document.createElement("li");
    element.setAttribute('id', id);
    element.setAttribute('class', 'errorcontainer__item animated FadeIn');
    message = document.createTextNode(message);
    element.appendChild(message);
    var img = document.createElement('img');
    element.appendChild(img);

    container.appendChild(element); 
    img.setAttribute('src', '/assets/img/icons/error_w.svg');
    img.setAttribute('class', 'errorcontainer__btn');
    img.setAttribute('onclick', 'removeError(' +id +')'); //Need to be fixed in *see remove()*

}



function getConditionsAtUserPosition(){
    
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };


    
        // This function is used as a callback parameter in the navigator function.
        function success(position){
            //Fetches the weather information at the user location.
            position = position.coords;
            fetchWeatherInfo("", position.latitude, position.longitude);
            //fetchSunInfo(position.latitude, position.longitude);
        }
        
    
    
        // This function is used as a callback parameter in the navigator function.
        function error(error){
            addErrorMessageToList("Was not able to fetch the user position. (connection problem?)");
            console.log("Was not able to fetch the user position.");
            console.log("you should still be able to search for the weather manually");
        }
        

    
        function hasBrowserSupport(){
            if (navigator.geolocation){           
                console.log("Your brower has support for HTML5 geolocation.")
                return true;
            }
            else{
                var text = "Your browser does not have support for HTML5 geolocation!";
                console.log(text);
                addErrorMessageToList(text);         
                return false;    
            }
        }

    
    
    if ( hasBrowserSupport() ){
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}
 


// Function for making Asynchronous API calls.
function fetchDataFromApi(url, query, callback){
    var request  = new XMLHttpRequest();
    request.open( 'GET', url + query , true);
     request.onload = function(){
        if (request.status >= 200 && request.status < 400){
            // Sucess!
            var data = JSON.parse(request.responseText);
            callback(data);

        } else {
            // Failure
            addErrorMessageToList('Was unable to fetch API data from server.');
            console.log("Reached the server, but it responded with: " + request.status);    
        }  
    };   
    request.send();
}

    
function fetchWeatherInfo(location, lat, lon){
    //Checks what parameters was put in. If a location was put in that case will be handled before coords. 
    var query;

    if (location){
        query = "q=" + location;
    }
    else if (lat && lon){
         query = "lat=" + lat + "&lon=" + lon;    
    }else{
        var lat = 40.730610;
        var lon = -73.935242;
        query = "lat=" + lat + "&lon=" + lon;
        console.log("no position was chosen: using default position - Long island City, NY, USA");
    }

    var url = 'http://api.openweathermap.org/data/2.5/weather?';
    query = query +"&lang=en" + '&appid=162ddbc8bffed6c3d7cdc2f4f35535a7';


    var data = fetchDataFromApi(url,query, function(data){
    console.log(data);
    if (data){        
        // Sucess!
            console.log(data.sys.sunrise);
            var rise = stampConverter(data.sys.sunrise),
                set = stampConverter(data.sys.sunset);

            outputToDomById('country', data.sys.country);
            outputToDomById('location', data.name);
            outputToDomById('latitude', data.coord.lat);
            outputToDomById('longitude', data.coord.lon);
            outputToDomById('currentweather', data.weather[0].description);
            outputToDomById('sunrise', rise);
            outputToDomById('sunset', set);

        } else {
            // Failure
            addErrorMessageToList("Failed to fetch the weather! :(");
            console.log("Failed to fetch the Weather. :(");
        }   

    });       
}



function searchWeather(){
    var location = document.getElementById('search');
    fetchWeatherInfo(location.value);
    location.value = "";   
}



//Checks so that if a timepoint is a single digit, it will add a zero ifront of it.     
function fixSingleDigit(i){
    if (i < 10)
        i = "0" + i;
    return i; 
}     



// Converts a timestamp to a clock value.  
function stampConverter(timestamp){
    var myDate = new Date(timestamp * 1000),
        hours = fixSingleDigit( myDate.getHours() ),
        minutes = fixSingleDigit( myDate.getMinutes() ),
        seconds = fixSingleDigit( myDate.getSeconds() ),
        formattedString = hours + ":" + minutes + ":" + seconds; 

    return formattedString;
}



function getLocalTime(){

     var today = new Date(),
         date = today.getDate(),
         weekday = today.getDay(),
         month = today.getMonth(),
         suffix;


    //Set up a clock from the new Date.
    function localClock(){
    var time = new Date(),    
        hours = time.getHours(),
        minutes = time.getMinutes(),
        seconds = time.getSeconds();


        // By calling this function the localClock function will autoupdate every 1000ms
        function updateClock(time){
            setTimeout(function(){ localClock(); }, 1000);
        }

    hours = fixSingleDigit(hours);
    minutes = fixSingleDigit(minutes);
    seconds = fixSingleDigit(seconds);

    outputToDomById('clock', hours + ":" + minutes + ":" + seconds );
    updateClock();    
    }


    // Depending of what value date has an appropriate suffix is given 
    if (date >= 4 && date <= 20 || date >= 24 && date <= 30)
        suffix = ":th";
    else if (date == 1 || date == 21 || date == 31)
        suffix = ":st";
    else if (date == 2 || date == 22)
        suffix = ":nd";
    else if (date == 3 || date == 23)
        suffix = ":rd";


    // Exchanges the value of "today.getDay() to a name string instead of a number"  
    if (weekday == 1)
        weekday = "Monday";
    else if (weekday == 2)
        weekday = "Tuesday";
    else if (weekday == 3)
        weekday = "Wednesday";
    else if (weekday == 4)
        weekday = "Thursday";
    else if (weekday == 5)
        weekday = "Friday"
    else if (weekday == 6)
        weekday = "Saturday";
    else
        weekday = "Sunday";

    // Exchanges the value of "today.getMonth() to a name string instead of a number"  
    switch(month){
    case 1:
        month = "January";
        break;
    case 2:
        month = "February";
        break;
    case 3:
        month = "Mars";
        break;
    case 4:
        month = "April";
        break;        
    case 5:
        month = "May";
        break;
    case 6:
        month = "June";
        break;
    case 7:
        month = "July";
        break;        
    case 8:
        month = "August";
        break;
    case 9:
        month = "September";
        break;
    case 4:
        month = "October";
        break;        
    case 5:
        month = "November";
        break;
    case 6:
        month = "December";
        break;
    }        


    outputToDomById('date', weekday + " - " + date + suffix);
    outputToDomById('month', month);
    localClock(today);
}



window.onload = function(){   
    getLocalTime();
    getConditionsAtUserPosition();    
}