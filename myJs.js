let locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=`
let weatherUrl = `https://api.open-meteo.com/v1/gfs?`

let searchBar = document.querySelector(".searchBar");
let timeInput = document.querySelector('#timeInput');

let locationArr = [];
let date = new Date();
let addDropVis = true;

let dateSelector = document.querySelector('#dateSelection')

console.log(date);

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

    fullUrl = weatherUrl + `latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&forecast_days=7&temperature_unit=fahrenheit&windspeed_unit=mph`

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
    indexOfValues.append(index);
    indexOfValues.append(index +1);
    indexOfValues.append(index +3);

    let averageTemp = averageTemp();
    let averageWeather = averageWeather();

    document.querySelector('#tempDisplay').innerHTML += averageTemp();
}

function averageTemp(){

}

function averageWeather(){

}


function enter(e){
    if(e.key == "Enter")
    {
        getUSLocation().then( function(val)
        {
            if(!addDropVis && !Boolean(dateSelector.value))
            {
                document.querySelector('#errorMessage').style.display = 'block';
                document.querySelector('#errorMessage').innerHTML = 'You need to add a valid date'
                document.querySelector('.informationDisplay').style.display ='none';
            }
            else if(!document.querySelector('#timeInput').value)
            {
                document.querySelector('#errorMessage').style.display = 'block';
                document.querySelector('#errorMessage').innerHTML = 'You need to add a valid time';
                document.querySelector('.informationDisplay').style.display ='none';
            }
            else{
                document.querySelector('#errorMessage').style.display = 'none';
                document.querySelector('.informationDisplay').style.display ='flex';
                getWeatherOfLocation(val); 
            }
        });
    }
}

searchBar.addEventListener('keydown', function(e) {enter(e)});
timeInput.addEventListener('keydown', function(e) {enter(e)});
