import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
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
  const [formData, setFormData] = useState({ title: '', description: '', image: null });
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
    console.log('Map clicked at:', latlng);
    setNewPinLocation(latlng);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Create preview
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
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/pins/create/', {
        method: 'POST',
        credentials: 'same-origin',
        body: formDataToSend,
      });

      if (response.ok) {
        const newPin = await response.json();
        setPins([...pins, newPin]);
        setShowForm(false);
        setFormData({ title: '', description: '', image: null });
        setImagePreview(null);
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
    setFormData({ title: '', description: '', image: null });
    setImagePreview(null);
    setNewPinLocation(null);
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
          <Marker key={pin.id} position={[pin.latitude, pin.longitude]}>
            <Popup maxWidth={300}>
              <div className="pin-popup">
                <strong className="pin-popup-title">{pin.title}</strong>
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