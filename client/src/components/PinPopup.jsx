import './PinPopup.css';

function PinPopup({ pin, onDelete, onEdit, onClose, onCopy, currentUserId }) {
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

  const isOwner = pin.user_id === currentUserId;

  return (
    <div className="pin-detail-overlay" onClick={onClose}>
      <div className="pin-detail-model" onClick={(e) => e.stopPropagation()}>
        <button className="close-detail-btn" onClick={onClose}>×</button>
        
        {pin.image && (
          <div className="pin-detail-image-container">
            <img src={pin.image} alt={pin.title} className="pin-detail-image" />
          </div>
        )}
        
        <div className="pin-detail-content">
          <h1 className="pin-detail-title">{pin.title}</h1>
          
          <div className="pin-detail-badges">
            <span className={`pin-status-badge status-${pin.status}`}>
              {getStatusLabel(pin.status)}
            </span>
            <span className={`privacy-badge privacy-${pin.is_public ? 'public' : 'private'}`}>
              {pin.is_public ? 'Public' : 'Private'}
            </span>
            <span className="category-badge">
              {getCategoryLabel(pin.category)}
            </span>
          </div>

          {pin.sections && pin.sections.length > 0 && (
            <div className="pin-sections-grid">
              {pin.sections.map((section, index) => (
                <div key={index} className="section-tile">
                  <h3 className="section-tile-title">{section.title}</h3>
                  <p className="section-tile-content">{section.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="pin-detail-actions">
            {isOwner ? (
              <>
                <button onClick={() => onEdit(pin)} className="detail-edit-btn">
                  Edit Pin
                </button>
                <button onClick={() => onDelete(pin.id)} className="detail-delete-btn">
                  Delete Pin
                </button>
              </>
            ) : (
              <button onClick={() => onCopy(pin.id)} className="detail-copy-btn">
                Add to My Pins
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PinPopup;