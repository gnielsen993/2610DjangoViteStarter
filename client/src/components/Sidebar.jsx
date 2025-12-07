import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ pins, onPinClick, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const getCounts = () => {
    return {
      all: pins.length,
      wishlisted: pins.filter(p => p.status === 'wishlisted').length,
      visited: pins.filter(p => p.status === 'visited').length,
      favorite: pins.filter(p => p.status === 'favorite').length,
    };
  };

  const filteredPins = pins.filter(pin => {
    const matchesFilter = activeFilter === 'all' || pin.status === activeFilter;
    const matchesSearch = pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pin.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = getCounts();

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>My Pins</h2>
          <span className="pin-count">{counts.all} total</span>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search pins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All ({counts.all})
          </button>
          <button
            className={`filter-tab wishlisted ${activeFilter === 'wishlisted' ? 'active' : ''}`}
            onClick={() => handleFilterChange('wishlisted')}
          >
            ⭐ {counts.wishlisted}
          </button>
          <button
            className={`filter-tab visited ${activeFilter === 'visited' ? 'active' : ''}`}
            onClick={() => handleFilterChange('visited')}
          >
            ✓ {counts.visited}
          </button>
          <button
            className={`filter-tab favorite ${activeFilter === 'favorite' ? 'active' : ''}`}
            onClick={() => handleFilterChange('favorite')}
          >
            ❤️ {counts.favorite}
          </button>
        </div>

        <div className="pins-list">
          {filteredPins.length === 0 ? (
            <div className="no-pins">No pins found</div>
          ) : (
            filteredPins.map(pin => (
              <div 
                key={pin.id} 
                className="pin-item"
                onClick={() => onPinClick(pin)}
              >
                <div className="pin-item-header">
                  <h3>{pin.title}</h3>
                  <span className={`status-indicator status-${pin.status}`}>
                    {pin.status === 'wishlisted' && '⭐'}
                    {pin.status === 'visited' && '✓'}
                    {pin.status === 'favorite' && '❤️'}
                  </span>
                </div>
                {pin.description && (
                  <p className="pin-item-description">
                    {pin.description.length > 60 
                      ? `${pin.description.substring(0, 60)}...` 
                      : pin.description}
                  </p>
                )}
                <div className="pin-item-footer">
                  <span className={`privacy-indicator ${pin.is_public ? 'public' : 'private'}`}>
                    {pin.is_public ? '🌍' : '🔒'}
                  </span>
                  <span className="pin-date">
                    {new Date(pin.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;