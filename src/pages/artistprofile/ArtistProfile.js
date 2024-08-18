import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import './ArtistProfile.scss';
import {
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
} from 'react-icons/fa';
import commonContext from '../../contexts/common/commonContext';
import Loader from '../../components/common/loader/Loader';
import { useLocation } from 'react-router-dom';
import ReservationForm from '../../components/form/reservationdetails/ReservationForm';
import { BASEURL } from '../../util/Util';

const ArtistProfile = () => {
  const { loginResponse, setLoading, loading, setArtistDetails } = useContext(commonContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId') || loginResponse.userId;
  const [artist, setArtist] = useState({
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
    profilePicture: '',
    imageUrls: [],
    videoUrls: []
  });
  const [selectedTab, setSelectedTab] = useState('description');
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    fetchArtistDetails();
  }, []);

  const fetchArtistDetails = async () => {
    try {
      const response = await axios.get(
        `${BASEURL}/artist/user/${userIdParam}`
      );
      if (response.data.success) {
        setArtist(response.data.artists[0]);
        setArtistDetails(response.data.artists[0]);
      } else {
          // show error page
      }
    } catch (error) {
      console.error('Error fetching artist details:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleEditProfile = () => {

  }

  const handleInviteClick = () => {
    setShowReservationForm(true);
  }

  const handleCloseReservationForm = () => {
    setShowReservationForm(false);
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'description':
        return (
          <div>
            <p>{artist.description}</p>
            <div className="categories">
              {Object.keys(artist.categories).map((category) => (
                <div key={category}>
                  <h4>{category}</h4>
                  <ul>
                    {artist.categories[category].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      case 'eventpricing':
        return (
          <div>
            <ul>
              {Object.entries(artist.eventPriceMap).map(([event, price]) => (
                <li key={event}>
                  {event}: ₹{price}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'reviews':
        return <div>Reviews will be shown here.</div>;
      case 'images':
        return (
          <div className="images-grid">
            {artist.imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Artist ${index}`} />
            ))}
          </div>
        );
      case 'videos':
        return (
          <div className="videos-grid">
            {artist.videoUrls.map((url, index) => (
              <iframe
                key={index}
                src={url}
                title={`Video ${index}`}
                allowFullScreen
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="artist-profile">
        <div className='edit-profile-btn'>
          <button onClick={handleEditProfile}>
            <FaEdit /> Edit Profile
          </button>
        </div>
      <div className="profile-header">
        <div className="profile-pic-container">
          <img
            src={artist.profilePicture}
            alt={`${artist.fullName}'s profile`}
            className="profile-pic"
          />
        </div>
        <div className="profile-info">
          <h2>{artist.fullName}</h2>
          <p>Preferred Gigs: {artist.preferredGigs.join(', ')}</p>
          <p>Preferred Locations: {artist.preferredLocations.join(', ')}</p>
          <div className="social-media">
            <a href={artist.socialMediaHandles.YOUTUBE} target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            <a href={artist.socialMediaHandles.INSTAGRAM} target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href={artist.socialMediaHandles.LINKEDIN} target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href={artist.socialMediaHandles.OTHER} target="_blank" rel="noopener noreferrer">
              <FaGlobe />
            </a>
          </div>
          <button type="button" className="invite-btn" onClick={handleInviteClick}>
            Invite
          </button>
        </div>
      </div>
      <div className="profile-content">
        <div className="tabs">
          {artist.description !== null && artist.description !== '' && <span
            className={`tab ${selectedTab === 'description' ? 'active' : ''}`}
            onClick={() => setSelectedTab('description')}
          >
            Description
          </span>}
          {artist.eventPriceMap !== null && <span
            className={`tab ${selectedTab === 'eventpricing' ? 'active' : ''}`}
            onClick={() => setSelectedTab('eventpricing')}
          >
            Pricing
          </span>}
          <span
            className={`tab ${selectedTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setSelectedTab('reviews')}
          >
            Reviews
          </span>
          {artist.imageUrls !== null && artist.imageUrls.length>0 &&<span
            className={`tab ${selectedTab === 'images' ? 'active' : ''}`}
            onClick={() => setSelectedTab('images')}
          >
            Images
          </span>}
          {artist.videoUrls !== null && artist.videoUrls.length>0 &&<span
            className={`tab ${selectedTab === 'videos' ? 'active' : ''}`}
            onClick={() => setSelectedTab('videos')}
          >
            Videos
          </span>}
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
      <ReservationForm show={showReservationForm} handleClose={handleCloseReservationForm} />
    </div>
  );
};

export default ArtistProfile;
