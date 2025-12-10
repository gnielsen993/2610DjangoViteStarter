import './PinPopup.css';

function PinPopup(props) {
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

  const isOwner = props.pin.user_id === props.currentUserId;

  return (
    <div className="pin-detail-overlay" onClick={props.onClose}>
      <div className="pin-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-detail-btn" onClick={props.onClose}>×</button>
        
        {props.pin.image && (
          <div className="pin-detail-image-container">
            <img src={props.pin.image} alt={props.pin.title} className="pin-detail-image" />
          </div>
        )}
        
        <div className="pin-detail-content">
          <h1 className="pin-detail-title">{props.pin.title}</h1>
          
          <div className="pin-detail-badges">
            <span className={`pin-status-badge status-${props.pin.status}`}>
              {getStatusLabel(props.pin.status)}
            </span>
            <span className={`privacy-badge privacy-${props.pin.is_public ? 'public' : 'private'}`}>
              {props.pin.is_public ? 'Public' : 'Private'}
            </span>
            <span className="category-badge">
              {getCategoryLabel(props.pin.category)}
            </span>
          </div>

          {props.pin.sections && props.pin.sections.length > 0 && (
            <div className="pin-sections-grid">
              {props.pin.sections.map((section, index) => (
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
                <button onClick={() => props.onEdit(props.pin)} className="detail-edit-btn">
                  Edit Pin
                </button>
                <button onClick={() => props.onDelete(props.pin.id)} className="detail-delete-btn">
                  Delete Pin
                </button>
              </>
            ) : (
              <button onClick={() => props.onCopy(props.pin.id)} className="detail-copy-btn">
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