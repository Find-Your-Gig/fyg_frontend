import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './ArtistDetailsForm.scss'; // Ensure this path is correct

const Step2 = ({ formData, handleChange }) => {
  const [preferredGigs, setPreferredGigs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/common/gigs')
      .then(response => {
        setPreferredGigs(response.data.map(gig => ({ value: gig, label: gig })));
      })
      .catch(error => {
        console.error('Error fetching preferred gigs:', error);
      });
  }, []);

  return (
    <div className="form-container">
      <h2>Step 2: Preferred Gigs</h2>
      <div className="form">
        <div className="form-group">
          <label>Preferred Gigs</label>
          <Select
            isMulti
            className="select-control"
            options={preferredGigs}
            name="preferredGigs"
            value={formData.preferredGigs.map(gig => ({ value: gig, label: gig }))}
            onChange={(selectedOptions) => handleChange('preferredGigs', selectedOptions.map(option => option.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
