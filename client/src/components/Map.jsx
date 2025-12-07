import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
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
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    image: null,
    is_public: true,
    status: 'wishlisted'
  });
  const [imagePreview, setImagePreview] = useState(null);

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
    setNewPinLocation(latlng);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('latitude', newPinLocation.lat);
      formDataToSend.append('longitude', newPinLocation.lng);
      formDataToSend.append('is_public', formData.is_public);
      formDataToSend.append('status', formData.status);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/pins/add/', {
        method: 'POST',
        credentials: 'same-origin',
        body: formDataToSend,
      });

      if (response.ok) {
        const newPin = await response.json();
        setPins([...pins, newPin]);
        setShowForm(false);
        setFormData({ title: '', description: '', image: null, is_public: true, status: 'wishlisted' });
        setImagePreview(null);
        setNewPinLocation(null);
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
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({ title: '', description: '', image: null, is_public: true, status: 'wishlisted' });
    setImagePreview(null);
    setNewPinLocation(null);
  };

  const getStatusLabel = (status) => {
    const labels = {
      wishlisted: 'Wishlisted',
      visited: 'Visited',
      favorite: 'Favorite'
    };
    return labels[status];
  };

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.latitude, pin.longitude]}
            icon={icons[pin.status]}
          >
            <Popup maxWidth={300}>
              <div className="pin-popup">
                <strong className="pin-popup-title">{pin.title}</strong>
                <div>
                  <span className={`pin-status-badge status-${pin.status}`}>
                    {getStatusLabel(pin.status)}
                  </span>
                  <span className={`privacy-badge privacy-${pin.is_public ? 'public' : 'private'}`}>
                    {pin.is_public ? '🌍 Public' : '🔒 Private'}
                  </span>
                </div>
                {pin.description && <p className="pin-popup-description">{pin.description}</p>}
                {pin.image && (
                  <img 
                    src={pin.image} 
                    alt={pin.title}
                    className="pin-popup-image"
                  />
                )}
                <button 
                  onClick={() => handleDeletePin(pin.id)}
                  className="pin-delete-btn"
                >
                  Delete
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showForm && (
        <div className="pin-form-overlay">
          <h2 className="pin-form-title">Create New Pin</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="form-radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="wishlisted"
                    name="status"
                    value="wishlisted"
                    checked={formData.status === 'wishlisted'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  <label htmlFor="wishlisted">⭐ Wishlisted</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="visited"
                    name="status"
                    value="visited"
                    checked={formData.status === 'visited'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  <label htmlFor="visited">✓ Visited</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="favorite"
                    name="status"
                    value="favorite"
                    checked={formData.status === 'favorite'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  <label htmlFor="favorite">❤️ Favorite</label>
                </div>
              </div>
            </div>

            <div className="form-checkbox-group">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="is_public" className="form-label" style={{ marginBottom: 0 }}>
                🌍 Make this pin public
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-file-input"
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="image-preview"
                />
              )}
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-submit">
                Create Pin
              </button>
              <button type="button" onClick={handleCancelForm} className="btn btn-cancel">
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