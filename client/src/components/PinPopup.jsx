import './PinPopup.css';

function PinPopup({ pin, onDelete, onEdit }) {
  const getStatusLabel = (status) => {
    const labels = {
      wishlisted: 'Wishlisted',
      visited: 'Visited',
      favorite: 'Favorite'
    };
    return labels[status];
  };

  const getCategoryLabel = (category) => {
    const labels = {
      trip: 'Trip',
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      attraction: 'Attraction',
      other: 'Other'
    };
    return labels[category];
  };

  return (
    <div className="pin-popup">
      <strong className="pin-popup-title">{pin.title}</strong>
      <div>
        <span className={`pin-status-badge status-${pin.status}`}>
          {getStatusLabel(pin.status)}
        </span>
        <span className={`privacy-badge privacy-${pin.is_public ? 'public' : 'private'}`}>
          {pin.is_public ? 'Public' : 'Private'}
        </span>
      </div>
      {pin.category && (
        <div className="pin-category">
          Category: {getCategoryLabel(pin.category)}
        </div>
      )}
      {pin.description && <p className="pin-popup-description">{pin.description}</p>}
      {pin.image && (
        <img 
          src={pin.image} 
          alt={pin.title}
          className="pin-popup-image"
        />
      )}
      <div style={{ display: 'flex', gap: '5px' }}>
        <button 
          onClick={() => onEdit(pin)}
          className="pin-edit-btn"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(pin.id)}
          className="pin-delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default PinPopup;