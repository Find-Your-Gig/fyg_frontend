import React from 'react';
import './ArtistDetailsForm.scss'; // Ensure this path is correct

const Step5 = ({ formData, handleChange }) => {
  const platforms = ['YOUTUBE', 'INSTAGRAM', 'LINKEDIN', 'OTHER'];

  const handleChangeSocialMedia = (platform, value) => {
    const updatedSocialMediaHandles = {
      ...formData.socialMediaHandles,
      [platform]: value,
    };
    handleChange('socialMediaHandles', updatedSocialMediaHandles);
  };

  const handleDescriptionChange = (e) => {
    handleChange('description', e.target.value);
  };

  return (
    <div className="form-container">
      <h2>Step 5: Optional Fields</h2>
      <div className="form">
        {platforms.map(platform => (
          <div className="form-group" key={platform}>
            <label>{platform}</label>
            <input
              type="text"
              className="form-control"
              name={platform}
              value={formData.socialMediaHandles[platform] || ''}
              onChange={(e) => handleChangeSocialMedia(platform, e.target.value)}
            />
          </div>
        ))}
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description || ''}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Step5;
