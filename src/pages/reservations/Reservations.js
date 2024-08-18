import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Reservations.scss';
import { useLocation } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import { BASEURL } from '../../util/Util';

const Reservations = () => {
  const { loginResponse } = useContext(commonContext);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get('userId') || loginResponse.userId;

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${BASEURL}/reservation/user/${userIdParam}`);
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  const handlePayNow = (reservationId) => {
    // Implement payment logic here
    console.log(`Pay Now for reservation ${reservationId}`);
  };

  const handleCancel = async (reservation) => {
    try {
      await axios.post(`${BASEURL}/reservation/cancelReservation`, {
        userId: userIdParam,
        reservation: {
          ...reservation,
          status: "CANCELLED",
          subStatus: "CANCELLED_BY_COMPANY"
        },
      });
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const renderReservations = (status) => {
    const filteredReservations = reservations.filter(res => res.status === status);
    if (filteredReservations.length === 0) {
      return <p className="no-reservations">No reservations found</p>;
    }
    return filteredReservations.map((reservation) => (
      <div key={reservation.reservationId} className="reservation">
        <img src={reservation.event.artistProfilePicture} alt="Profile" className="profile-picture" />
        <div className="reservation-details">
          <h3>{reservation.event.artistName}</h3>
          <p>Email: {reservation.event.artistEmail}</p>
          <p>Event Type: {reservation.event.event}</p>
          <p>Price: ₹{reservation.event.price}</p>
          <p>Date: {new Date(reservation.event.date).toLocaleDateString()}</p>
          <p>Status: {reservation.status}</p>
          <p>Sub Status: {reservation.subStatus}</p>
          {reservation.subStatus === 'PAYMENT_PENDING' && (
            <div className="payment-section">
              <button onClick={() => handlePayNow(reservation.reservationId)}>Pay Now</button>
            </div>
          )}
          {status === 'ONGOING' && (
            <div className="cancel-section">
              <button onClick={() => handleCancel(reservation)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="reservations">
      <div className="tabs">
        {['ALL', 'ONGOING', 'COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'].map((status) => (
          <button
            key={status}
            className={`tab ${activeTab === status ? 'active' : ''}`}
            onClick={() => handleTabClick(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="reservations-list">
        {activeTab === 'ALL' ? (
          <>
            <h2>ONGOING</h2>
            {renderReservations('ONGOING')}
            <h2>COMPLETED</h2>
            {renderReservations('COMPLETED')}
            <h2>CANCELLED</h2>
            {renderReservations('CANCELLED')}
            <h2>REJECTED</h2>
            {renderReservations('REJECTED')}
            <h2>FAILED</h2>
            {renderReservations('FAILED')}
          </>
        ) : (
          <>
            <h2>{activeTab}</h2>
            {renderReservations(activeTab)}
          </>
        )}
      </div>
    </div>
  );
};

export default Reservations;
