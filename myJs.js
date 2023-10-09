let locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=`
let weatherUrl = `https://api.open-meteo.com/v1/gfs?`

let searchBar = document.querySelector(".searchBar");
let locationArr = [];
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
    console.log(usArray);

    fullUrl = weatherUrl + `latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&forecast_days=1&temperature_unit=fahrenheit&windspeed_unit=mph`

    let weatherData = await fetch(fullUrl);
    let jsonWeatherData = await weatherData.json();
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