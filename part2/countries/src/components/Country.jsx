import { useEffect, useState } from "react"
import axios from "axios"

const Country = ({ country }) => {
    const [weatherData, setWeatherData] = useState(null)
    const apikey = import.meta.env.VITE_WEATHER_KEY;

    useEffect(() => {
        if (country) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${apikey}&units=metric`).then(
                function (response) {
                    setWeatherData(response.data)
                    console.log(response.data)
                }
            )
        }
    }, [country, apikey])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            <h2>Languages</h2>
            <ul>
            {Object.values(country.languages).map(lang => (
                <li key={lang}>{lang}</li>
            ))}
            </ul>
            <img width="150" src={country.flags.svg} alt="Example" />
            <h1>Weather in {country.capital[0]}</h1>
            {weatherData ? 
                <>
                    <p>Temprature: {weatherData.main.temp} Celcius</p> 
                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
                    <p>Wind: {weatherData.wind.speed} m/s</p>
                </> : null}
        </div>
    )
}

export default Country
