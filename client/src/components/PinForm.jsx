import './PinForm.css';

function PinForm({ formData, setFormData, imagePreview, handleImageChange, handleFormSubmit, handleCancelForm }) {
  return (
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
            <label className="form-label">Category</label>
            <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
            >
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="attraction">Attraction</option>
                <option value="country">Country</option>
                <option value="other">Other</option>
            </select>
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
              <label htmlFor="wishlisted">Wishlisted</label>
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
              <label htmlFor="visited">Visited</label>
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
              <label htmlFor="favorite">Favorite</label>
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
            Public
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
  );
}

export default PinForm;