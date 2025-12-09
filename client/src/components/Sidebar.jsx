import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ pins, onPinClick, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleStatusFilterChange = (filter) => {
    setActiveStatusFilter(filter);
    onFilterChange({ status: filter, category: activeCategoryFilter });
  };

  const handleCategoryFilterChange = (filter) => {
    setActiveCategoryFilter(filter);
    onFilterChange({ status: activeStatusFilter, category: filter });
  };

  const getCounts = () => {
    return {
      all: pins.length,
      wishlisted: pins.filter(p => p.status === 'wishlisted').length,
      visited: pins.filter(p => p.status === 'visited').length,
      favorite: pins.filter(p => p.status === 'favorite').length,
      trip: pins.filter(p => p.category === 'trip').length,
      hotel: pins.filter(p => p.category === 'hotel').length,
      restaurant: pins.filter(p => p.category === 'restaurant').length,
      attraction: pins.filter(p => p.category === 'attraction').length,
      other: pins.filter(p => p.category === 'other').length,
    };
  };

  const filteredPins = pins.filter(pin => {
    const matchesStatusFilter = activeStatusFilter === 'all' || pin.status === activeStatusFilter;
    const matchesCategoryFilter = activeCategoryFilter === 'all' || pin.category === activeCategoryFilter;
    const matchesSearch = pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pin.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatusFilter && matchesCategoryFilter && matchesSearch;
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

        <div className="filter-section">
          <h3 className="filter-section-title">Status</h3>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeStatusFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('all')}
            >
              All ({counts.all})
            </button>
            <button
              className={`filter-tab wishlisted ${activeStatusFilter === 'wishlisted' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('wishlisted')}
            >
              Wishlist {counts.wishlisted}
            </button>
            <button
              className={`filter-tab visited ${activeStatusFilter === 'visited' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('visited')}
            >
              Visited {counts.visited}
            </button>
            <button
              className={`filter-tab favorite ${activeStatusFilter === 'favorite' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('favorite')}
            >
              Favorites {counts.favorite}
            </button>
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">Category</h3>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeCategoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange('all')}
            >
              All ({counts.all})
            </button>
            <button
              className={`filter-tab ${activeCategoryFilter === 'trip' ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange('trip')}
            >
              Trip {counts.trip}
            </button>
            <button
              className={`filter-tab ${activeCategoryFilter === 'hotel' ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange('hotel')}
            >
              Hotel {counts.hotel}
            </button>
            <button
              className={`filter-tab ${activeCategoryFilter === 'restaurant' ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange('restaurant')}
            >
              Restaurant {counts.restaurant}
            </button>
            <button
              className={`filter-tab ${activeCategoryFilter === 'attraction' ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange('attraction')}
            >
              Attraction {counts.attraction}
            </button>
            <button
              className={`filter-tab ${activeCategoryFilter === 'other' ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange('other')}
            >
              Other {counts.other}
            </button>
          </div>
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
                    {pin.status === 'wishlisted'}
                    {pin.status === 'visited'}
                    {pin.status === 'favorite'}
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
                    {pin.is_public ? 'Public' : 'Private'}
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