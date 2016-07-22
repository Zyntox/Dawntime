 function fetchWeatherInfo(location, lat, long){
        //Checks what parameters was put in. If a location was put in that case will be handled before coords. 
        if (location){
            var query = "q=" + location;
        }
        else if (lat && long){
            var query = "lat=" + lat + "&lon=" + long;    
        }else{
            var lat = 40.730610;
            var lon = -73.935242;
            var query = "lat=" + lat + "&lon=" + lon;
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
    

/**************************************************************************************************/



  if ( hasBrowserSupport()){
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







