import React, { useContext } from 'react';
import ArtistProfile from './artistprofile/ArtistProfile';
import CompanyProfile from './companyprofile/CompanyProfile';
import commonContext from '../contexts/common/commonContext';
import ErrorPage from './ErrorPage';

const Profile = () => {
  const { loginResponse, profileData } = useContext(commonContext);

  const renderProfile = () => {
    switch (profileData.type) {
      case 'ARTIST':
        return <ArtistProfile />;
      case 'COMPANY':
        return <CompanyProfile />;
      default:
        return <ErrorPage />;
    }
  };

  return (
    <div className="profile-container">
      {renderProfile()}
    </div>
  );
};

export default Profile;
