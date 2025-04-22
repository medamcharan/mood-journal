import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import MoodEntryForm from './components/MoodEntryForm'
import CalendarView from './components/CalendarView'
import MoodGraph from './components/MoodGraph'
import { format } from 'date-fns'
import './styles/global.css'

function App() {
  const [activeView, setActiveView] = useState('entry')
  const [entries, setEntries] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('moodJournalEntries')) || []
    setEntries(storedEntries)
  }, [])

  const saveEntry = (newEntry) => {
    const updatedEntries = [...entries.filter(e => e.date !== newEntry.date), newEntry]
    setEntries(updatedEntries)
    localStorage.setItem('moodJournalEntries', JSON.stringify(updatedEntries))
  }

  const addMultipleEntries = (newEntry) => {
    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)
    localStorage.setItem('moodJournalEntries', JSON.stringify(updatedEntries))
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
        
        <main>
          <h1>{format(selectedDate, 'MMMM do, yyyy')}</h1>
          
          {activeView === 'entry' && (
            <MoodEntryForm 
              selectedDate={selectedDate} 
              saveEntry={addMultipleEntries} 
              existingEntryList={entries.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd'))} // Pass all previous entries
            />
          )}
          
          {activeView === 'calendar' && (
            <CalendarView 
              entries={entries} 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setActiveView={setActiveView}
            />
          )}
          
          {activeView === 'stats' && (
            <MoodGraph entries={entries} />
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
