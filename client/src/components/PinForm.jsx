import './PinForm.css';

function PinForm(props) {
  const handleAddSection = () => {
    const newSection = { title: '', content: '' };
    props.setFormData({ ...props.formData, sections: [...(props.formData.sections || []), newSection] });
  };

  const handleRemoveSection = (index) => {
    const newSections = props.formData.sections.filter((_, i) => i !== index);
    props.setFormData({ ...props.formData, sections: newSections });
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...props.formData.sections];
    newSections[index][field] = value;
    props.setFormData({ ...props.formData, sections: newSections });
  };

  return (
    <div className="pin-form-overlay">
      <h2 className="pin-form-title">{props.editingPin ? 'Edit Pin' : 'Create New Pin'}</h2>
      <form onSubmit={props.handleFormSubmit}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            value={props.formData.title}
            onChange={(e) => props.setFormData({ ...props.formData, title: e.target.value })}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Sections</label>
          {props.formData.sections && props.formData.sections.map((section, index) => (
            <div key={index} className="section-item">
              <input
                type="text"
                placeholder="Section title"
                value={section.title}
                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                className="form-input section-title-input"
              />
              <textarea
                placeholder="Section content"
                value={section.content}
                onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                rows="2"
                className="form-textarea section-content-input"
              />
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="remove-section-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSection}
            className="add-section-btn"
          >
            + Add Section
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={props.formData.category}
            onChange={(e) => props.setFormData({ ...props.formData, category: e.target.value })}
            className="form-input"
          >
            <option value="trip">Trip</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
            <option value="attraction">Attraction</option>
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
                checked={props.formData.status === 'wishlisted'}
                onChange={(e) => props.setFormData({ ...props.formData, status: e.target.value })}
              />
              <label htmlFor="wishlisted">Wishlisted</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="visited"
                name="status"
                value="visited"
                checked={props.formData.status === 'visited'}
                onChange={(e) => props.setFormData({ ...props.formData, status: e.target.value })}
              />
              <label htmlFor="visited">Visited</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="favorite"
                name="status"
                value="favorite"
                checked={props.formData.status === 'favorite'}
                onChange={(e) => props.setFormData({ ...props.formData, status: e.target.value })}
              />
              <label htmlFor="favorite">Favorite</label>
            </div>
          </div>
        </div>

        <div className="form-checkbox-group">
          <input
            type="checkbox"
            id="is_public"
            checked={props.formData.is_public}
            onChange={(e) => props.setFormData({ ...props.formData, is_public: e.target.checked })}
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
            onChange={props.handleImageChange}
            className="form-file-input"
          />
          {props.imagePreview && (
            <img 
              src={props.imagePreview} 
              alt="Preview" 
              className="image-preview"
            />
          )}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-submit">
            {props.editingPin ? 'Update Pin' : 'Create Pin'}
          </button>
          <button type="button" onClick={props.handleCancelForm} className="btn btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PinForm;