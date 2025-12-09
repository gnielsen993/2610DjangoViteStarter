import { useState, useEffect } from 'react';
import PinMap from './components/Map.jsx';
import Home from './components/Home';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/pins/', {
        credentials: 'same-origin'
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin",
    });
    if (res.ok) {
      window.location = "/registration/sign_in/";
    }
  }

  const handleNavigateToMap = () => {
    setCurrentView('map');
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'map' && isAuthenticated) {
    return (
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}>
          <h1 
            onClick={handleNavigateToHome}
            style={{
              margin: 0,
              fontSize: '28px',
              color: '#2196F3',
              cursor: 'pointer',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Pin Traveler
          </h1>
        </div>
        <button
          onClick={logout}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '10px 20px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
        <PinMap />
      </div>
    );
  }

  return <Home isAuthenticated={isAuthenticated} onNavigateToMap={handleNavigateToMap} />;
}

export default App;