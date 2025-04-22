import { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'your_api_key_here'

export default function useWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
          setWeather(response.data)
          setLoading(false)
        } catch (err) {
          setError('Failed to fetch weather data')
          setLoading(false)
        }
      },
      (err) => {
        setError('Please enable location access to see weather')
        setLoading(false)
      }
    )
  }, [])

  return { weather, loading, error }
}