let locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=`
let weatherUrl = `https://api.open-meteo.com/v1/gfs?`

let searchBar = document.querySelector(".searchBar");
let locationArr = [];
let date = new Date();

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

    fullUrl = weatherUrl + `latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&forecast_days=1&temperature_unit=fahrenheit&windspeed_unit=mph`

    let weatherData = await fetch(fullUrl);
    let jsonWeatherData = await weatherData.json();

    console.log(jsonWeatherData);
}

function addDateDropDown()
{
    let dayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let dropDown = document.querySelector('#dropDownDate');
    let children = dropDown.children;
}

function setDateDisplay(){
    let dropDown = document.querySelector('#dropDownDate');
    let dateSelector = document.querySelector('#dateSelection');

    console.log(getComputedStyle(dropDown).getPropertyValue('left'));

    if(getComputedStyle(dropDown).getPropertyValue('left')=='-40px'){
        dropDown.style.left = '140%';
        dateSelector.style.left = '0%';
    }
    else{
        dateSelector.style.left = '-140%';
        dropDown.style.left = '-40%';
    }
}

searchBar.addEventListener('keydown', function(e){
    if(e.key == "Enter")
    {
        getUSLocation().then( function(val)
        {
            getWeatherOfLocation(val);
        });
    }
});

document.querySelector('.leftArrow').addEventListener('click',setDateDisplay);
document.querySelector('.rightArrow').addEventListener('click',setDateDisplay);