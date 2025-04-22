import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import { groupBy, map } from 'lodash';
  import { useState } from 'react';
  import '../styles/MoodGraph.css';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  function MoodGraph({ entries }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
    // Filter based on selected date range
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || entryDate >= start) && (!end || entryDate <= end);
    });
  
    const sortedEntries = [...filteredEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
  
    if (sortedEntries.length === 0) {
      return (
        <div className="mood-graph">
          <div className="date-filters">
            <label>
              Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </label>
            <label>
              End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
          </div>
          <div className="no-data">No entries to display</div>
        </div>
      );
    }
  
    const moodCounts = groupBy(sortedEntries, (entry) => entry.mood?.id);
    const moodData = map(moodCounts, (entriesGroup, moodId) => ({
      moodId,
      count: entriesGroup.length,
      color: entriesGroup[0]?.mood?.color || '#999',
      label: entriesGroup[0]?.mood?.label || 'Unknown',
    }));
  
    const recent7 = sortedEntries.slice(-7).map(entry => ({
      date: entry.date,
      mood: entry.mood?.label || 'Unknown',
      color: entry.mood?.color || '#999',
    }));
  
    const barData = {
      labels: moodData.map((mood) => mood.label),
      datasets: [
        {
          label: 'Mood Count',
          data: moodData.map((mood) => mood.count),
          backgroundColor: moodData.map((mood) => mood.color),
          borderColor: moodData.map((mood) => mood.color),
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Your Mood Distribution' },
      },
    };
  
    return (
      <div className="mood-graph">
        <div className="date-filters">
          <label>
            Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>
        </div>
  
        <div className="chart-container">
          <Bar data={barData} options={options} />
        </div>
  
        <div className="weekly-moods">
          <h3>Recent Moods</h3>
          <div className="weekly-list">
            {recent7.map((day, index) => (
              <div key={index} className="weekly-item">
                <div
                  className="mood-indicator"
                  style={{ backgroundColor: day.color }}
                ></div>
                <span>{day.mood}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default MoodGraph;
  