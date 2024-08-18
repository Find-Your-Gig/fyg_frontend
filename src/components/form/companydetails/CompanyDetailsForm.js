import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import './CompanyDetailsForm.scss';
import commonContext from '../../../contexts/common/commonContext';

const CompanyDetailsForm = () => {
  const { loginResponse, setCompanyDetails } = useContext(commonContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId') || loginResponse.userId;
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

  const [formData, setFormData] = useState({
    userId: userIdParam,
    fullName: loginResponse.fullName || '',
    email: '',
    contactNumber: '',
    companyName: '',
    location: ''
  });

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFinish = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log('Failed to save company details');
        return;
      }

      const result = await response.json();
      setCompanyDetails(result.companies[0]);
      navigate(`/all-products`); // Adjust the route as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div className="form-container">
      <h2>Company Details Form</h2>
      <form className="form">
        <div className="form-container">
          <h2>Step 1: Basic Information</h2>
          <div className="form">
            <div className="form-group">
              <label>Work Email</label>
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
              <label>Company Name</label>
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>            
            <div className="form-group">
              <label>Location</label>
              <Select
                className="select-control"
                options={locations}
                name="location"
                value={locations.find(option => option.value === formData.location)}
                onChange={(selectedOption) => handleChange('location', selectedOption.value)}
              />
            </div>
          </div>
        </div>        
        <div className="btn-group">
          <button type="button" className="btn btn-primary" onClick={handleFinish}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsForm;
