import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'
import '../styles/WeatherDisplay.css'

const weatherIcons = {
  Clear: <WiDaySunny size={48} />,
  Clouds: <WiCloudy size={48} />,
  Rain: <WiRain size={48} />,
  Snow: <WiSnow size={48} />,
  Thunderstorm: <WiThunderstorm size={48} />,
  Drizzle: <WiRain size={48} />,
  Mist: <WiFog size={48} />,
  Fog: <WiFog size={48} />,
}

function WeatherDisplay({ weather, loading, error }) {
  if (loading) return <div className="weather-display loading">Loading weather...</div>
  if (error) return <div className="weather-display error">Weather data unavailable</div>
  if (!weather) return <div className="weather-display">Enable location to see weather</div>

  const weatherCondition = weather.weather[0].main
  const icon = weatherIcons[weatherCondition] || <WiDaySunny size={48} />

  return (
    <div className="weather-display">
      <div className="weather-icon">{icon}</div>
      <div className="weather-details">
        <h3>{Math.round(weather.main.temp)}°C</h3>
        <p>{weather.weather[0].description}</p>
        <p>{weather.name}</p>
      </div>
    </div>
  )
}

export default WeatherDisplay