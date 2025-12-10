import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import Sidebar from './Sidebar';
import PinForm from './PinForm';
import PinPopup from './PinPopup';
import Stats from './Stats';
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
  const [filteredPins, setFilteredPins] = useState([]);
  const [center] = useState([41.7370, -111.8338]);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPinLocation, setNewPinLocation] = useState(null);
  const [editingPin, setEditingPin] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    sections: [],
    image: null,
    is_public: true,
    status: 'wishlisted',
    category: 'other',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    loadPins();
  }, []);

  useEffect(() => {
    setFilteredPins(pins);
  }, [pins]);

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

  const handleMarkerClick = (pin) => {
    setSelectedPin(pin);
  };

  const handleCloseDetail = () => {
    setSelectedPin(null);
  };

  const handlePinClick = (pin) => {
    if (mapRef.current) {
      mapRef.current.setView([pin.latitude, pin.longitude], 15);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = pins;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(pin => pin.status === filters.status);
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(pin => pin.category === filters.category);
    }
    
    setFilteredPins(filtered);
  };

  const handleStatsClick = () => {
    setShowStats(true);
  };

  const handleCloseStats = () => {
    setShowStats(false);
  };

  const handleEditPin = (pin) => {
    setSelectedPin(null);
    setEditingPin(pin);
    setFormData({
      title: pin.title,
      sections: pin.sections || [],
      image: null,
      is_public: pin.is_public,
      status: pin.status,
      category: pin.category,
    });
    setImagePreview(pin.image);
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
      formDataToSend.append('sections', JSON.stringify(formData.sections));
      formDataToSend.append('is_public', formData.is_public);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('category', formData.category);
      
      if (editingPin) {
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        const response = await fetch(`/api/pins/${editingPin.id}/update/`, {
          method: 'PUT',
          credentials: 'same-origin',
          body: formDataToSend,
        });

        if (response.ok) {
          const updatedPin = await response.json();
          setPins(pins.map(p => p.id === updatedPin.id ? updatedPin : p));
          setShowForm(false);
          setFormData({ title: '', sections: [], image: null, is_public: true, status: 'wishlisted', category: 'other' });
          setImagePreview(null);
          setEditingPin(null);
        }
      } else {
        formDataToSend.append('latitude', newPinLocation.lat);
        formDataToSend.append('longitude', newPinLocation.lng);
        
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
          setFormData({ title: '', sections: [], image: null, is_public: true, status: 'wishlisted', category: 'other' });
          setImagePreview(null);
          setNewPinLocation(null);
        }
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
        setSelectedPin(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({ title: '', sections: [], image: null, is_public: true, status: 'wishlisted', category: 'other' });
    setImagePreview(null);
    setNewPinLocation(null);
    setEditingPin(null);
  };

  if (showStats) {
    return <Stats onClose={handleCloseStats} />;
  }

  return (
    <div className="map-container">
      <Sidebar 
        pins={pins} 
        onPinClick={handlePinClick}
        onFilterChange={handleFilterChange}
        onStatsClick={handleStatsClick}
      />

      <MapContainer 
        center={center} 
        zoom={13}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        {filteredPins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.latitude, pin.longitude]}
            icon={icons[pin.status]}
            eventHandlers={{
              click: () => handleMarkerClick(pin)
            }}
          />
        ))}
      </MapContainer>

      {selectedPin && (
        <PinPopup 
          pin={selectedPin} 
          onDelete={handleDeletePin} 
          onEdit={handleEditPin}
          onClose={handleCloseDetail}
        />
      )}

      {showForm && (
        <PinForm
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleFormSubmit={handleFormSubmit}
          handleCancelForm={handleCancelForm}
          editingPin={editingPin}
        />
      )}
    </div>
  );
}

export default PinMap;