import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Home.css';
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const createCustomIcon = (color) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  wishlisted: createCustomIcon('orange'),
  visited: createCustomIcon('green'),
  favorite: createCustomIcon('red'),
};

function Home({ isAuthenticated, onNavigateToMap }) {
  const [pins, setPins] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [center] = useState([20, 0]);

  useEffect(() => {
    loadPublicPins();
  }, []);

  const loadPublicPins = async () => {
    try {
      const response = await fetch('/api/pins/public/');
      if (response.ok) {
        const data = await response.json();
        setPins(data);
        setFilteredPins(data);
      }
    } catch (error) {
      console.error('Error loading public pins:', error);
    }
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredPins(pins);
    } else {
      setFilteredPins(pins.filter(pin => pin.category === category));
    }
  };

  const getCategoryCounts = () => {
    return {
      all: pins.length,
      trip: pins.filter(p => p.category === 'trip').length,
      hotel: pins.filter(p => p.category === 'hotel').length,
      restaurant: pins.filter(p => p.category === 'restaurant').length,
      attraction: pins.filter(p => p.category === 'attraction').length,
      other: pins.filter(p => p.category === 'other').length,
    };
  };

  const counts = getCategoryCounts();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Pin Traveler</h1>
        <div className="home-nav">
          {isAuthenticated ? (
            <>
              <button onClick={onNavigateToMap} className="nav-btn">My Map</button>
              <a href="/registration/logout/" className="nav-btn logout-btn">Logout</a>
            </>
          ) : (
            <a href="/registration/sign_in/" className="nav-btn">Login</a>
          )}
        </div>
      </header>

      <div className="home-content">
        <div className="home-sidebar">
          <h2>Categories</h2>
          <button 
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('all')}
          >
            All ({counts.all})
          </button>
          <button 
            className={`category-btn ${activeCategory === 'trip' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('trip')}
          >
            Trips ({counts.trip})
          </button>
          <button 
            className={`category-btn ${activeCategory === 'hotel' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('hotel')}
          >
            Hotels ({counts.hotel})
          </button>
          <button 
            className={`category-btn ${activeCategory === 'restaurant' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('restaurant')}
          >
            Restaurants ({counts.restaurant})
          </button>
          <button 
            className={`category-btn ${activeCategory === 'attraction' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('attraction')}
          >
            Attractions ({counts.attraction})
          </button>
          <button 
            className={`category-btn ${activeCategory === 'other' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('other')}
          >
            Other ({counts.other})
          </button>
        </div>

        <MapContainer center={center} zoom={2} className="home-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredPins.map((pin) => (
            <Marker 
              key={pin.id} 
              position={[pin.latitude, pin.longitude]}
              icon={icons[pin.status]}
            >
              <Popup maxWidth={300}>
                <div>
                  <strong>{pin.title}</strong>
                  <p>By: {pin.user}</p>
                  {pin.description && <p>{pin.description}</p>}
                  {pin.image && <img src={pin.image} alt={pin.title} style={{width: '100%', maxHeight: '150px'}} />}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Home;