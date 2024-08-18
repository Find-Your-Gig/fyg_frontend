import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './ArtistDetailsForm.scss'; // Ensure this path is correct

const Step1 = ({ formData, handleChange }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/common/locations')
      .then(response => {
        setLocations(response.data.map(location => ({ value: location, label: location })));
      })
      .catch(error => {
        console.error('Error fetching preferred locations:', error);
      });
  }, []);

  return (
    <div className="form-container">
      <h2>Step 1: Basic Information</h2>
      <div className="form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            className="form-control"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={formData.dob}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Solo or Team</label>
          <select
            className="form-control"
            name="soloOrTeam"
            value={formData.soloOrTeam}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          >
            <option value="solo">Solo</option>
            <option value="team">Team</option>
          </select>
        </div>
        {formData.soloOrTeam === 'team' && (
          <div className="form-group">
            <label>Team Size</label>
            <input
              type="number"
              className="form-control"
              name="teamSize"
              value={formData.teamSize}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <label>Preferred Locations</label>
          <Select
            isMulti
            className="select-control"
            options={locations}
            name="preferredLocations"
            value={formData.preferredLocations.map(location => ({ value: location, label: location }))}
            onChange={(selectedOptions) => handleChange('preferredLocations', selectedOptions.map(option => option.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
