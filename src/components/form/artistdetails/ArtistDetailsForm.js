import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import './ArtistDetailsForm.scss';
import commonContext from '../../../contexts/common/commonContext';

const ArtistDetailsForm = () => {
  const { loginResponse, setArtistDetails } = useContext(commonContext);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId') || loginResponse.userId;
  
  const [formData, setFormData] = useState({
    userId: userIdParam,
    fullName: loginResponse.fullName || '',
    email: '',
    contactNumber: '',
    dob: '',
    description: '',
    soloOrTeam: 'solo',
    teamSize: 1,
    preferredLocations: [],
    preferredGigs: [],
    categories: {},
    eventPriceMap: {},
    socialMediaHandles: {},
    professionalCertificates: [],
  });

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleFinish = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/artist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log('Failed to save artist details');
        return;
      }

      const result = await response.json();
      setArtistDetails(result.artists[0]);
      navigate(`/profile?userId=${loginResponse.userId}`); // Adjust the route as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle error, show error message, etc.
    }
  };

  const steps = [
    <Step1 formData={formData} handleChange={handleChange} />,
    <Step2 formData={formData} handleChange={handleChange} />,
    <Step3 formData={formData} handleChange={handleChange} />,
    <Step4 formData={formData} handleChange={handleChange} />,
    <Step5 formData={formData} handleChange={handleChange} />,
  ];

  return (
    <div className="form-container">
      <h2>Artist Details Form</h2>
      <form className="form">
        {steps[currentStep - 1]}
        <div className="btn-group">
          {currentStep > 1 && (
            <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
              Back
            </button>
          )}
          {currentStep < steps.length ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleFinish}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ArtistDetailsForm;
