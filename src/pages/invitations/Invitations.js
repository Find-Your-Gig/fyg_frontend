import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Invitations.scss';
import { useLocation } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import { BASEURL } from '../../util/Util';

const Invitations = () => {
  const { loginResponse } = useContext(commonContext);
  const [invitations, setInvitations] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId') || loginResponse.userId;

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(`${BASEURL}/invitation/user/${userIdParam}`);
      setInvitations(response.data.invitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  const updateInvitationStatus = async (invitation, status) => {
    try {
      await axios.post(`${BASEURL}/invitation/updateInvitation`, {
        userId: userIdParam,
        invitation: {
          ...invitation,
          status
        }
      });
      fetchInvitations();
    } catch (error) {
      console.error(`Error updating invitation status to ${status}:`, error);
    }
  };

  const handleAccept = (invitation) => {
    updateInvitationStatus(invitation, 'ACCEPTED');
  };

  const handleReject = (invitation) => {
    updateInvitationStatus(invitation, 'REJECTED');
  };

  const renderInvitations = (status) => {
    const filteredInvitations = invitations.filter(inv => inv.status === status);
    if (filteredInvitations.length === 0) {
      return <p className="no-invitations">No invitations found</p>;
    }
    return filteredInvitations.map((invitation) => (
      <div key={invitation.invitationId} className="invitation">
        <img src={invitation.event.artistProfilePicture} alt="Profile" className="profile-picture" />
        <div className="invitation-details">
          <h3>{invitation.event.companyName}</h3>
          <p>Email: {invitation.event.companyEmail}</p>
          <p>Event Type: {invitation.event.event}</p>
          <p>Date: {new Date(invitation.event.date).toLocaleDateString()}</p>
          <p>Status: {invitation.status}</p>
          {status === 'PENDING' && (
            <div className="invitation-actions">
              <button onClick={() => handleAccept(invitation)}>Accept</button>
              <button onClick={() => handleReject(invitation)}>Reject</button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="invitations">
      <div className="tabs">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((status) => (
          <button
            key={status}
            className={`tab ${activeTab === status ? 'active' : ''}`}
            onClick={() => handleTabClick(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="invitations-list">
        {activeTab === 'ALL' ? (
          <>
            <h2>PENDING</h2>
            {renderInvitations('PENDING')}
            <h2>ACCEPTED</h2>
            {renderInvitations('ACCEPTED')}
            <h2>REJECTED</h2>
            {renderInvitations('REJECTED')}
          </>
        ) : (
          <>
            <h2>{activeTab}</h2>
            {renderInvitations(activeTab)}
          </>
        )}
      </div>
    </div>
  );
};

export default Invitations;
