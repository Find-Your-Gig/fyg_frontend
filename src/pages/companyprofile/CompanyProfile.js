import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import Select from 'react-select';
import axios from 'axios';
import './CompanyProfile.scss';
import commonContext from '../../contexts/common/commonContext';
import Loader from '../../components/common/loader/Loader';
import { useLocation } from 'react-router-dom';
const _ = require('lodash');

const CompanyProfile = () => {
  const { loginResponse, loading, setLoading, setCompanyDetails } = useContext(commonContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [showProfilePicOptions, setShowProfilePicOptions] = useState(false);
  const [locations, setLocations] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId') || loginResponse.userId;
  const [formData, setFormData] = useState({
    userId: userIdParam,
    fullName: '',
    email: '',
    contactNumber: '',
    location: '',
    companyName: ''
  });
  const [updatedFormData, setUpdatedFormData] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchEditProfileFormData();
    }
    fetchCompanyDetails();
  }, [isEditing]);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/company/user/${loginResponse.userId}`);
      if (response.data.success) {
        const companyData = response.data.companies[0];
        setFormData({
          companyId: companyData.companyId,
          userId: companyData.userId,
          fullName: companyData.fullName,
          email: companyData.email,
          contactNumber: companyData.contactNumber,
          location: companyData.location,
          companyName: companyData.companyName
        });
        setCompanyDetails(companyData);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditProfileFormData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/company/editProfileFormData');
      if (response.data.success) {
        setLocations(response.data.locations.map(location => ({ value: location, label: location })));
      } else {
        console.error('Error fetching locations:', response.data.errorDetails);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const saveCompanyDetails = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/company/${formData.companyId}`, formData);
      if (response.data.success) {
        const companyData = response.data.companies[0];
        setFormData({
          ...formData,
          userId: companyData.userId,
          fullName: companyData.fullName,
          email: companyData.email,
          contactNumber: companyData.contactNumber,
          location: companyData.location,
          companyName: companyData.companyName
        });
        setCompanyDetails(companyData);
      } else {
        // show error message
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company details:', error);
    }
  }

  const handleChange = (name, value) => {
    setUpdatedFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Add save functionality here, such as making an API call to save the data
    saveCompanyDetails();
    setFormData(updatedFormData);
    setUpdatedFormData(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUpdatedFormData(null);
    setIsEditing(false);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setUpdatedFormData(formData);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="company-profile-container">
      <div className="profile-header">
        <div className="profile-pic" onClick={() => setShowProfilePicOptions(!showProfilePicOptions)}>
          {profilePic ? <img src={profilePic} alt="Profile" /> : <FiUser size={50} />}
        </div>
        {showProfilePicOptions && (
          <div className="profile-pic-options">
            <button onClick={() => alert('Viewing profile picture')}>View Profile Pic</button>
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
          </div>
        )}
        {isEditing ? (
          <div className="btn-group">
            <button className="btn btn-save" onClick={handleSave}>
              <FaSave /> Save
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <button className="btn btn-edit" onClick={handleEditProfile}>
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>
      <div className="profile-details">
        <div className="profile-row">
          <label>Full Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedFormData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          ) : (
            <span>{formData.fullName}</span>
          )}
        </div>
        <div className="profile-row">
          <label>Company Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedFormData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          ) : (
            <span>{formData.companyName}</span>
          )}
        </div>
        <div className="profile-row">
          <label>Location:</label>
          {isEditing ? (
            <Select
              className="select-control"
              options={locations}
              value={{ value: updatedFormData.location, label: updatedFormData.location }}
              onChange={(selectedOption) => handleChange('location', selectedOption.value)}
            />
          ) : (
            <span>{formData.location}</span>
          )}
        </div>
        <div className="profile-row">
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={updatedFormData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          ) : (
            <span>{formData.email}</span>
          )}
        </div>
        <div className="profile-row">
          <label>Contact Number:</label>
          {isEditing ? (
            <input
              type="text"
              value={updatedFormData.contactNumber}
              onChange={(e) => handleChange('contactNumber', e.target.value)}
            />
          ) : (
            <span>{formData.contactNumber}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
