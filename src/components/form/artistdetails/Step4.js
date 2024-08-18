import React from 'react';
import './ArtistDetailsForm.scss'; // Ensure this path is correct
const _ = require('lodash');

const Step4 = ({ formData, handleChange }) => {
  const eventTypes = ['CORPORATE', 'FAMILY_FUNCTION', 'INDIVIDUAL'];

  const handleCheckboxChange = (eventType, checked) => {
    if (checked) {
        const eventPriceMap = formData.eventPriceMap;
        eventPriceMap[eventType] = 0;
        const updatedEventPriceMap = eventPriceMap;
        handleChange(`eventPriceMap`, updatedEventPriceMap); // Set to 0 initially
    } else {
        const eventPriceMap = formData.eventPriceMap;
        const updatedEventPriceMap = _.omit(eventPriceMap, eventType);
        handleChange(`eventPriceMap`, updatedEventPriceMap); // Remove from state
    }
  };

  const handlePriceChange = (eventType, value) => {
    const eventPriceMap = formData.eventPriceMap;
    eventPriceMap[eventType] = parseFloat(value);
    const updatedEventPriceMap = eventPriceMap;
    handleChange(`eventPriceMap`, updatedEventPriceMap);
  };

  return (
    <div className="form-container">
      <h2>Step 4: Event Pricing</h2>
      <div className="form">
        {eventTypes.map(eventType => (
          <div className="form-group checkbox-group" key={eventType}>
            <label>
              <input
                type="checkbox"
                checked={formData.eventPriceMap.hasOwnProperty(eventType)}
                onChange={(e) => handleCheckboxChange(eventType, e.target.checked)}
              />
              {eventType}
            </label>
            {formData.eventPriceMap.hasOwnProperty(eventType) && (
              <div className="price-input-container">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter price"
                  name={eventType}
                  value={formData.eventPriceMap[eventType] || ''}
                  onChange={(e) => handlePriceChange(eventType, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step4;
