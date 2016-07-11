// 1. Get the users geoposition. 

// 2. Use the geo position in conjunction with conecting to sun API.

// 3. If the the "Sun API" wasn't able to get the geoposition (User declined prompt.), use statoc position of New York.

// 4. ???

// 5. Profit!

/* Fetches the users position and then outputs it to the dom.  */

var fetchUserPosition = function(callback){
    
    //checks if browser has support for geolocation.
    var hasbrowserSupport = function(){
        if (navigator.geolocation){
            console.log("The browser supports geolocation!")
            return true;
        }
        else{ 
            console.log("The browser does not support geolocation.")
            return false;
        }
    }
    
    if (hasbrowserSupport){
        return navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude,
                long = position.coords.longitude;
            
            document.getElementById('startLat').innerHTML += lat.toFixed(4);
            document.getElementById('startLon').innerHTML += long.toFixed(4);   
            var weatherObject = fetchWeatherByCoords(lat, long);
            console.log(weatherObject);
        })                                          
    } else{
        console.log("was not able to locate the users position.")
        return;
    } 
        
}


var fetchLocalTime = function(){
        
        //Fetches the timestamp! (...why did I need it?)
        function getTimestamp(){
            
            var errorcontainer = document.getElementById("errormessages"),
                 errornode = document.createElement("LI"),
                 //message = document.createTextNode(),
                 time;

            // Checks for browser compatability for method 'Date.now()'
            if (Date.now()){
                // gets the timestamp and converts it to seconds. 
                time = (Math.floor(Date.now() /1000));
                return time;
            } else {
                //this section is a W.I.P!
                errorcontainer.appendChild(errormessage);
            }

        }
        
        
        function getLocalTime(){
            var today = new Date(),
                month = today.getMonth(),
                date = today.getDate(),
                hours = today.getHours(),
                minutes = today.getMinutes(),
                seconds = today.getSeconds(),
                output;
            
            date = fixSingledigit(date);
            hours = fixSingledigit(hours);
            minutes = fixSingledigit(minutes);
            seconds = fixSingledigit(seconds);
            
            function fixSingledigit(i){
                if(i < 10){
                    i = "0"+ i;
                    return i;
                }
                return i;
            }  
            
            function updateClock(){
                setTimeout(function(){ getLocalTime(); }, 1000);
            }
            
            
            //output the month to the DOM.
            output = month + 1; //...somehow it outputs the month number before?
            switch(output){
            case 1:
                output = "January";
                break;
            case 2:
                output = "February";
                break;
            case 3:
                output = "Mars";
                break;
            case 4:
                output = "April";
                break;        
            case 5:
                output = "May";
                break;
            case 6:
                output = "June";
                break;
            case 7:
                output = "July";
                break;        
            case 8:
                output = "August";
                break;
            case 9:
                output = "September";
                break;
            case 4:
                output = "October";
                break;        
            case 5:
                output = "November";
                break;
            case 6:
                output = "December";
                break;
            }        
            document.getElementById("month").innerHTML = output;
            
            //output the date to the DOM.
            output = date;
            document.getElementById("date").innerHTML = output;
            
            //output the local time
            document.getElementById("clock").innerHTML = hours + ":" + minutes + ":" + seconds;
            
            updateClock();
        }
            
    getLocalTime();
    document.getElementById('timestamp').innerHTML = getTimestamp();
}


function fetchWeatherByCoords(lat, long){
    //Checks if any position was put in.
    if (lat == undefined || long == undefined){
        var lat = 40.730610;
        var long = -73.935242;
        console.log("no position was chosen: using default position - Long island City, NY, USA");
    }

    
    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +lat +'&lon=' + long +'&appid=162ddbc8bffed6c3d7cdc2f4f35535a7'
    
    var request  = new XMLHttpRequest();
    request.open( 'GET', url, true);
    
    request.onload = function(){
        if (request.status >= 200 && request.status < 400){
            // Sucess!
            var data = JSON.parse(request.responseText);
            return data;
        } else {
            // Failure
            console.log("Reached the server, but it responded with: " + request.status);    
        }   
    };   

    request.send();
}

window.onload = function(){
    fetchUserPosition();
    fetchLocalTime();
}