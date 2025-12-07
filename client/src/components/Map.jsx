import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function PinMap() {
  const [pins, setPins] = useState([]);
  const [center] = useState([41.7370, -111.8338]);
  const [showForm, setShowForm] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    try {
      const response = await fetch('/api/pins/', {
        credentials: 'same-origin'
      });
      if (response.ok) {
        const data = await response.json();
        setPins(data);
      }
    } catch (error) {
      console.error('Error loading pins:', error);
    }
  };

  const handleMapClick = (latlng) => {
    console.log('Map clicked at:', latlng);
    setNewPinLocation(latlng);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/pins/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          latitude: newPinLocation.lat,
          longitude: newPinLocation.lng,
        }),
      });

      if (response.ok) {
        const newPin = await response.json();
        setPins([...pins, newPin]);
        setShowForm(false);
        setFormData({ title: '', description: '' });
        setNewPinLocation(null);
      } else {
        console.error('Error creating pin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeletePin = async (pinId) => {
    if (!window.confirm('Are you sure you want to delete this pin?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pins/${pinId}/delete/`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (response.ok) {
        setPins(pins.filter(pin => pin.id !== pinId));
      } else {
        console.error('Error deleting pin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({ title: '', description: '' });
    setNewPinLocation(null);
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.latitude, pin.longitude]}>
            <Popup>
              <div>
                <strong>{pin.title}</strong>
                {pin.description && <p>{pin.description}</p>}
                <button 
                  onClick={() => handleDeletePin(pin.id)}
                  style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginTop: '5px'
                  }}
                >
                  Delete
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showForm && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          minWidth: '300px'
        }}>
          <h2 style={{ marginTop: 0 }}>Create New Pin</h2>
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Pin
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PinMap;