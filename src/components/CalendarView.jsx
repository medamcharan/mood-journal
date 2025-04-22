import { format, isSameDay, parseISO, startOfMonth, getDay } from 'date-fns';
import { useState, useEffect } from 'react';
import '../styles/CalendarView.css';

function CalendarView({ entries, selectedDate, setSelectedDate, setActiveView }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterMood, setFilterMood] = useState(null);
  const [emojiMap, setEmojiMap] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newMap = {};
      entries.forEach(entry => {
        const day = entry.date;
        const moodEmoji = entry.mood.emoji;
        if (!newMap[day]) {
          newMap[day] = [];
        }
        if (!newMap[day].includes(moodEmoji)) {
          newMap[day].push(moodEmoji);
        }
      });
      setEmojiMap(prev => {
        const updated = { ...prev };
        Object.keys(newMap).forEach(day => {
          const index = (prev[day]?.index || 0) + 1;
          updated[day] = {
            emojis: newMap[day],
            index: index % newMap[day].length
          };
        });
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [entries]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOffset = getDay(startOfMonth(currentMonth));

  const monthDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) => {
    if (i < firstDayOffset) return null;
    const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1 - firstDayOffset);
    return day;
  });

  const getEntriesForDay = (day) => {
    return entries.filter(entry => isSameDay(parseISO(entry.date), day));
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setActiveView('entry');
  };

  const filteredEntries = filterMood
    ? entries.filter(entry => entry.mood.id === filterMood)
    : entries;

  const getMoodAnimationClass = (moodId) => {
    switch(moodId) {
      case 'angry': return 'mood-thunder';
      case 'sad': return 'mood-rain';
      case 'happy': return 'mood-party';
      default: return '';
    }
  };

  return (
    <div className="calendar-view">
      <div className="calendar-controls">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
          &#8592;
        </button>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
          &#8594;
        </button>
      </div>

      <div className="mood-filter">
        <label>Filter by mood:</label>
        <select value={filterMood || ''} onChange={(e) => setFilterMood(e.target.value || null)}>
          <option value="">All moods</option>
          <option value="happy">Happy</option>
          <option value="neutral">Neutral</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="anxious">Anxious</option>
        </select>
        <button className="reset-filter" onClick={() => setFilterMood(null)}>Reset</button>
      </div>

      <div className="weekday-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {monthDays.map((day, index) => {
          if (!day) return <div key={index} className="calendar-day empty"></div>;
          const entriesForDay = getEntriesForDay(day);
          const today = new Date();
          const emojiCycle = emojiMap[format(day, 'yyyy-MM-dd')];
          const emojiToShow = emojiCycle?.emojis[emojiCycle.index] || entriesForDay[0]?.mood.emoji;

          return (
            <div 
              key={`${day.toString()}-${index}`}
              className={`calendar-day ${isSameDay(day, selectedDate) ? 'selected' : ''} ${isSameDay(day, today) ? 'today' : ''}`}
              onClick={() => handleDayClick(day)}
              title={entriesForDay.map(e => `${e.mood.label}: ${e.notes || 'No notes'}`).join('\n')}
            >
              <div className="day-number">{format(day, 'd')}</div>
              {entriesForDay.length > 0 && (
                <div className="day-mood">
                  {emojiToShow}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredEntries.length > 0 && (
        <div className="entries-list">
            
          <h3>Filtered Entries</h3>
          {filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              className={`entry-item ${getMoodAnimationClass(entry.mood.id)}`}
              data-mood={entry.mood.id}
            >
              <div className="entry-date">{format(parseISO(entry.date), 'MMM do, yyyy')}</div>
              <div className="entry-mood" style={{ backgroundColor: entry.mood.color }}>
                {entry.mood.emoji} {entry.mood.label}
              </div>
              {entry.weather && (
                <div className="entry-weather">
                  {Math.round(entry.weather.temp)}°C - {entry.weather.condition}
                </div>
              )}
              {entry.notes && <div className="entry-notes">{entry.notes}</div>}
                        
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarView;