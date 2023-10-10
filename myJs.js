let locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=`
let weatherUrl = `https://api.open-meteo.com/v1/gfs?`

let searchBar = document.querySelector(".searchBar");
let timeInput = document.querySelector('#timeInput');
let weatherImg = document.querySelector('#weatherImg');
let dateSelector = document.querySelector('#dateSelection')

let date = new Date();

async function getUSLocation(){
    let url = locationUrl + searchBar.value + "&count=8";

    let data = await fetch(url);
    let jsonData = await data.json();
    let dataArray = jsonData.results;

    let usArray = dataArray.filter(function(obj){
        return obj.country_code === "US";
    });

    return usArray;
}

async function getWeatherOfLocation(usArray)
{
    let lat = usArray[0].latitude;
    let lon = usArray[0].longitude;

    fullUrl = weatherUrl + `latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&forecast_days=16&temperature_unit=fahrenheit&windspeed_unit=mph`

    let weatherData = await fetch(fullUrl);
    let jsonWeatherData = await weatherData.json();

    console.log(jsonWeatherData);
    getDisplayWeatherData(jsonWeatherData);
}

function getDisplayWeatherData(weatherData){
    let time;
    let timeSelect = document.querySelector('#timeAmPm');
    if(timeInput.value == 12){
        if(timeSelect.value === 'am')
        {
            time = `00:00` 
        }
        else if(timeSelect.value === 'pm')
        {
            time = `12:00` 
        }
    }
    else if(timeInput.value < 10 && timeSelect.value === 'am')
    {
        time = `0${timeInput.value}:00`;
    }
    else if(timeSelect.value === 'am'){
        time = `${timeInput.value}:00`
    }
    else if(timeSelect.value === 'pm')
    {
        time = `${Number(timeInput.value) + 12}:00`;
    }

    let timeString = `${dateSelector.value}T${time}`

    let indexOfValues = []
    let index = weatherData.hourly.time.indexOf(timeString);
    indexOfValues.push(index);
    indexOfValues.push(index +1);
    indexOfValues.push(index +3);

    let averageTemp = function (indexArray, weatherData){
        let sumOfTemps = 0;
        for(let i = 0; i < indexArray.length; i++)
        {
            sumOfTemps += weatherData.hourly.temperature_2m[indexArray[i]];
        }
    
        return sumOfTemps/indexArray.length;
    }

    let averageWeather = function(indexArray, weatherData){
        let maxCode = -1;
        for(let i = 0; i < indexArray.length; i++)
        {
            maxCode = Math.max(maxCode, weatherData.hourly.weathercode[indexArray[i]]);
        }
        return maxCode;
    }

    let maxCode = averageWeather(indexOfValues,weatherData)
    let weatherText = document.querySelector('#weatherDisplay');

    console.log(maxCode < 20);

    if(maxCode < 20)
    {
        weatherImg.setAttribute('src','images/sunny.png');
        weatherText.innerHTML += 'Sunny';
    }
    else if (maxCode >= 20 && maxCode < 49)
    {
        weatherImg.setAttribute('src','images/part-cloudy.png');
        weatherText.innerHTML += 'Patialy Cloudy';
    }
    else if (maxCode >= 50 && maxCode < 60)
    {
        weatherImg.setAttribute('src','images/part-rain.png');
        weatherText.innerHTML += 'Patialy Cloudy';
    }
    else if (maxCode >= 60 && maxCode < 66)
    {
        weatherImg.setAttribute('src','images/rain.png');
        weatherText.innerHTML += 'Rain';
    }
    else if (maxCode >= 66 && maxCode < 80)
    {
        weatherImg.setAttribute('src','images/snow.png');
        weatherText.innerHTML += 'Snow';
    }
    else
    {
        weatherImg.setAttribute('src','images/thunder.png');
        weatherText.innerHTML += 'Thunder';
    }

    document.querySelector('#tempDisplay').innerHTML += Math.round(averageTemp(indexOfValues, weatherData)) + '&degF';
}

function enter(e){
    if(e.key == "Enter")
    {
        let errorMessage = document.querySelector('#errorMessage');
        let informationDIsplay =  document.querySelector('.informationDisplay');

        getUSLocation().then( function(val)
        {
            if(!Boolean(dateSelector.value))
            {
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = 'You need to add a valid <span style="color:rgba(253, 29, 29, 0.871)">DATE</span>';
                informationDIsplay.style.display ='none';
            }
            else if(!document.querySelector('#timeInput').value)
            {
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = 'You need to add a valid <span style="color:rgba(253, 29, 29, 0.871)">TIME</span>';
                informationDIsplay.style.display ='none';
            }
            else{
                errorMessage.style.display = 'none';
                informationDIsplay.style.display ='flex';
                getWeatherOfLocation(val); 
            }
        }).catch(function (e)
        {
            errorMessage.style.display = 'block';
            informationDIsplay.style.display ='none';
            errorMessage.innerHTML = 'You need to add a valid <span style="color:rgba(253, 29, 29, 0.871)">CITY</span>';
            return;
        });
    }
}

searchBar.addEventListener('keydown', function(e) {enter(e)});
timeInput.addEventListener('keydown', function(e) {enter(e)});
