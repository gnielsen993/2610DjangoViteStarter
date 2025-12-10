import { useState, useEffect } from 'react';
import './Stats.css';

function Stats(props) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/pins/stats/', {
        credentials: 'same-origin'
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-container">Loading...</div>;
  }

  if (!stats) {
    return <div className="stats-container">Error loading stats</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>My Travel Statistics</h1>
        <button onClick={props.onClose} className="close-stats-btn">Back to Map</button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h2>Total Pins</h2>
          <p className="stat-number">{stats.total_pins}</p>
        </div>

        <div className="stat-card">
          <h2>Wishlisted</h2>
          <p className="stat-number">{stats.wishlisted_pins}</p>
        </div>

        <div className="stat-card">
          <h2>Visited</h2>
          <p className="stat-number">{stats.visited_pins}</p>
        </div>

        <div className="stat-card">
          <h2>Favorites</h2>
          <p className="stat-number">{stats.favorite_pins}</p>
        </div>
      </div>

      <h2 className="section-title">By Category</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Trips</h3>
          <p className="stat-number">{stats.trip_pins}</p>
        </div>

        <div className="stat-card">
          <h3>Hotels</h3>
          <p className="stat-number">{stats.hotel_pins}</p>
        </div>

        <div className="stat-card">
          <h3>Restaurants</h3>
          <p className="stat-number">{stats.restaurant_pins}</p>
        </div>

        <div className="stat-card">
          <h3>Attractions</h3>
          <p className="stat-number">{stats.attraction_pins}</p>
        </div>

        <div className="stat-card">
          <h3>Other</h3>
          <p className="stat-number">{stats.other_pins}</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;