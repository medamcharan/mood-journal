import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { FaSun, FaMoon, FaCalendarAlt, FaChartLine, FaHome } from 'react-icons/fa'
import '../styles/Navbar.css'

function Navbar({ activeView, setActiveView }) {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <nav className="navbar">
      <div className="nav-links">
        <button 
          onClick={() => setActiveView('entry')} 
          className={activeView === 'entry' ? 'active' : ''}
          aria-label="Home"
        >
          <FaHome />
        </button>
        <button 
          onClick={() => setActiveView('calendar')} 
          className={activeView === 'calendar' ? 'active' : ''}
          aria-label="Calendar"
        >
          <FaCalendarAlt />
        </button>
        <button 
          onClick={() => setActiveView('stats')} 
          className={activeView === 'stats' ? 'active' : ''}
          aria-label="Statistics"
        >
          <FaChartLine />
        </button>
      </div>
      <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle dark mode">
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
    </nav>
  )
}

export default Navbar