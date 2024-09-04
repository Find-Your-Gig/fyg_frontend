import React, { useContext, useState } from 'react';
import './ReservationForm.scss';
import commonContext from '../../../contexts/common/commonContext';
import { BASEURL } from '../../../util/Util';

const ReservationForm = ({ show, handleClose }) => {
  const { companyDetails, artistDetails, loginResponse } = useContext(commonContext); // Assuming userId is available in the commonContext
  const [formData, setFormData] = useState({
    email: companyDetails.email || '',
    companyName: companyDetails.companyName || '',
    date: '',
    time: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    console.log("handle submit clicked")
    e.preventDefault();

    const reservation = {
      artistId: artistDetails.artistId,
      companyId: companyDetails.companyId,
      userId: companyDetails.userId,
      event: {
        artistUserId: artistDetails.userId,
        artistId: artistDetails.artistId,
        artistName: artistDetails.fullName,
        artistEmail: artistDetails.email,
        artistProfilePicture: artistDetails.profilePicture,
        companyUserId: companyDetails.userId,
        companyId: companyDetails.companyId,
        companyName: formData.companyName,
        companyLocation: companyDetails.location,
        companyEmail: formData.email,
        companyUserFullName: loginResponse.fullName,
        event: "CORPORATE",
        price: artistDetails.eventPriceMap["CORPORATE"],
        date: formData.date,
        time: formData.time.toString()
      },
      status: null,
      subStatus: null,
      transactionId: null
    };

    try {
      const response = await fetch(`${BASEURL}/reservation/makeReservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: companyDetails.userId, reservation: reservation })
      });

      const result = await response.json();

      if (result.success) {
        // Handle successful response
        console.log(result);
        console.log('Reservation made successfully');
        handleClose();
      } else {
        // Handle error response
        console.error('Error making reservation');
      }
    } catch (error) {
      console.error('Error making reservation', error);
    }
  };

  if (!show) {
    return null;
  }

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="reservation-form-overlay">
      <div className="reservation-form">
        <h2>Send Invitation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Event Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getTomorrowDate()}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Event Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" onClick={handleSubmit}>
              Send
            </button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
