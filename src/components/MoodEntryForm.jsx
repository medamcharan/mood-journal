import { useState, useEffect } from 'react'
import WeatherDisplay from './WeatherDisplay'
import useWeather from '../hooks/useWeather'
import { format } from 'date-fns'
import '../styles/MoodEntryForm.css'

const moodOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFD700' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#A9A9A9' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#4682B4' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#FF4500' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#9370DB' },
]

function MoodEntryForm({ selectedDate, saveEntry, existingEntryList }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [notes, setNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { weather, loading } = useWeather()

  useEffect(() => {
    setSelectedMood(null)
    setNotes('')
    setShowConfirmation(false)
  }, [selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedMood) return

    const entry = {
      id: Date.now(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      notes,
      weather: weather ? {
        temp: weather.main.temp,
        condition: weather.weather[0].main,
        icon: weather.weather[0].icon
      } : null
    }

    saveEntry(entry) 

    setShowConfirmation(true)
    setNotes('')
    setSelectedMood(null)

    // Show confirmation for 2 seconds
    setTimeout(() => {
      setShowConfirmation(false)
    }, 2000)
  }

  return (
    <div className="mood-entry-form">
      <div className="weather-mini-display">
        {weather && !loading && (
          <div className="weather-badge">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
              alt={weather.weather[0].main} 
              className="weather-icon"
            />
            <span>{Math.round(weather.main.temp)}°C</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mood-options">
          <h3>How are you feeling today?</h3>
          <div className="mood-buttons">
            {moodOptions.map(mood => (
              <button
                key={mood.id}
                type="button"
                className={`mood-button ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood)}
                style={{ 
                  backgroundColor: mood.color,
                  '--hover-color': `${mood.color}CC`
                }}
                aria-label={mood.label}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="notes-section">
          <label htmlFor="notes">Notes (optional):</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write about your day..."
            rows="4"
          />
        </div>

        {!showConfirmation && (
          <button
            type="submit"
            className="submit-button"
            disabled={!selectedMood}
          >
            <span className="button-text">Save Entry</span>
            <span className="button-icon">✓</span>
          </button>
        )}

        {showConfirmation && (
          <div className="confirmation-message">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            Entry saved successfully!
          </div>
        )}
      </form>

      <div className="previous-entries">
        <h3>Previous Entries for This Day</h3>
        {existingEntryList && existingEntryList.length > 0 ? (
          <div className="entries-grid">
            {[...existingEntryList].reverse().map((entry, index) => (
              <div key={entry.id || index} className="entry-card">
                <div className="entry-header">
                  <span className="entry-time">{entry.time}</span>
                  <span 
                    className="entry-mood" 
                    style={{ backgroundColor: entry.mood.color }}
                  >
                    {entry.mood.emoji}
                  </span>
                </div>
                {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                {entry.weather && (
                  <div className="entry-weather">
                    <img 
                      src={`https://openweathermap.org/img/wn/${entry.weather.icon}.png`} 
                      alt={entry.weather.condition} 
                    />
                    <span>{Math.round(entry.weather.temp)}°C</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-entries">No previous entries</p>
        )}
      </div>
    </div>
  )
}

export default MoodEntryForm
