    // Helper function : Got tired of writing document.getEleme....
    function outputToDomById(id, value){
        document.getElementById(id).innerHTML = value;
    }
    // Creates a new eroor message and appends it to the error container list. 
    function addErrorMessageToList(message, callback){
        
                var id = callback();
        
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
                img.setAttribute('onclick', 'remove(' +id +')'); //Need to be fixed in *see remove()*
        
    }

    // Need to be updated!! 
    function remove(id){
        console.log(id);
        id = document.getElementById(id);
        id.parentNode.removeChild(id);
    }

    function fetchIndex(){
        var elements = document.getElementById('errorcontainer__list'),
            num = elements.childElementCount;
            
        if (num == 0)
            return 0;
        else
            return Number(elements.childNodes[num].id) + 1;
    }


    function getConditionsAtUserPosition(){
    
            function hasBrowserSupport(){
                if (navigator.geolocation){
                    
                    //This section should be moved to the other side of the if statement.
                    var text = "Your browser does not have support for HTML5 geolocation!";
                    addErrorMessageToList(text, fetchIndex);
                    addErrorMessageToList('Bleigh!', fetchIndex);
                    addErrorMessageToList('James Bond!', fetchIndex);

                    
                    
                    console.log("Your brower has support for HTML5 geolocation.")
                    return true;
                }
                else{
                    console.log("Your browser does not have support for HTML5 geolocation");
                    return false;    
                }
            }
        
        if ( hasBrowserSupport() ){
            navigator.geolocation.getCurrentPosition(function(position){
                //Fetches the weather information at the user location.
                position = position.coords;
                //fetchWeatherByCoords(position.latitude, position.longitude);
                fetchWeatherInfo("Jönköping");
                });
        } else{
            console.log("Was not able to fetch the user position.");
            console.log("you should still be able to search for the weather manually");
        } 
    }
        
    
    function fetchWeatherInfo(location, lat, long){
        //Checks what parameters was put in. If a location was put in that case will be handled before coords. 
        if (location){
            var query = "q=" + location;
        }
        else if (lat && long){
            var query = "lat=" + lat + "&lon=" + long;    
        }else{
            var lat = 40.730610;
            var long = -73.935242;
            var query = "lat=" + lat + "&lon=" + long;
            console.log("no position was chosen: using default position - Long island City, NY, USA");
        }
        
        
        var url = 'http://api.openweathermap.org/data/2.5/weather?' +query +"&lang=en" + '&appid=162ddbc8bffed6c3d7cdc2f4f35535a7'
        var request  = new XMLHttpRequest();
        request.open( 'GET', url, true);

        request.onload = function(){
            if (request.status >= 200 && request.status < 400){
                // Sucess!
                var data = JSON.parse(request.responseText);     
                
                outputToDomById('location', data.name);
                outputToDomById('latitude', data.coord.lat);
                outputToDomById('longitude', data.coord.lon);
                outputToDomById('currentweather', data.weather[0].description);
                
            } else {
                // Failure
                console.log("Reached the server, but it responded with: " + request.status);    
            }   
        };   

        request.send();
    }
    
    function searchWeather(){
        var location = document.getElementById('search');
        fetchWeatherInfo(location.value);
        location.value = "";
        
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
        
                    
            //Checks so that if a timepoint is a single digit, it will add a zero ifront of it.     
            function fixSingleDigit(i){
                if (i < 10)
                    i = "0" + i;
                return i;
            } 
        
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