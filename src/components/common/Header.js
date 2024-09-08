import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineBell, AiOutlineUser, AiOutlineShop } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { BASEURL } from '../../util/Util';
import commonContext from '../../contexts/common/commonContext';
import cartContext from '../../contexts/cart/cartContext';
import LoginForm from '../form/login/LoginForm';
import SearchBar from './searchbar/SearchBar';
import axios from 'axios';
import './Common.scss';

const Header = () => {
    const { formUserInfo, toggleForm, isLoggedIn, setLoading, loginResponse, setLoggedIn, setFormUserInfo, setLoginResponse } = useContext(commonContext);
    const { cartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await axios.post(`${BASEURL}/notification`, {
                userId: loginResponse.userId,
                userType: loginResponse.type
            });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Close dropdown on clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);
        window.addEventListener('scroll', handleIsSticky);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
        };
    }, [isSticky]);

    // Fetch notifications from the backend
    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
        }
    }, [loginResponse, isLoggedIn]);

    useEffect(() => {

    }, [notifications])

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleAllProducts = () => {
        setLoading(true);
    };

    const handleSignOut = () => {
        setLoggedIn(false);
        setFormUserInfo('');
        setLoginResponse({});
        navigate('/');
    };

    const updateNotification = async (id) => {
        try {
            const response = await axios.post(`${BASEURL}/notification/update`, {
                userId: loginResponse.userId,
                userType: loginResponse.type,
                id: id
            });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }
    
    const handleNotificationClick = (id) => {
        updateNotification(id);
        toggleDropdown();
        if (loginResponse.type === 'COMPANY') {
            navigate('/reservations?userId='+loginResponse.userId);
        } else if (loginResponse.type === 'ARTIST') {
            navigate('/invitations?userId='+loginResponse.userId);
        }
    }

    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">FindYourGig</Link>
                        </h2>
                        <SearchBar />
                        <nav className="nav_actions">
                            <div className="vendors_action">
                                <Link to="/all-products">
                                    <AiOutlineShop onClick={handleAllProducts} />
                                </Link>
                                <div className="tooltip">Artists</div>
                            </div>

                            {/* Bell Icon for Notifications */}
                            <div className="notifications_action" ref={dropdownRef}>
                                <span className="bell_icon" onClick={toggleDropdown}>
                                    <AiOutlineBell />
                                    {notifications.length > 0 && (
                                        <span className="badge">{notifications.length}</span>
                                    )}
                                </span>

                                {isLoggedIn && showDropdown && (
                                    <div className="dropdown_menu notifications_dropdown">
                                        <h4>Notifications</h4>
                                        <ul>
                                            {notifications.length === 0 ? (
                                                <li>No notifications</li>
                                            ) : (
                                                notifications.map(notification => (
                                                    <li key={notification.id} onClick={() => handleNotificationClick(notification.id)}>{notification.text}</li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="user_action">
                                <span>
                                    <AiOutlineUser />
                                </span>
                                <div className="dropdown_menu">
                                    <h4>Hello! {formUserInfo && <Link to="*">&nbsp;{formUserInfo}</Link>}</h4>
                                    <p>Access account and manage orders</p>
                                    {
                                        !formUserInfo && !isLoggedIn ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleForm(true)}
                                            >
                                                Login / Signup
                                            </button>
                                        ) : (
                                            <button
                                            type="button"
                                            onClick={() => handleSignOut()}
                                            >
                                                Sign Out
                                            </button> 
                                        )
                                    }
                                    <div className="separator"></div>
                                    <ul>
                                        <li>
                                            <Link to={`profile?userId=${loginResponse.userId}`}>Profile</Link>
                                        </li>
                                        {loginResponse.type !== 'ARTIST' && <li>
                                            <Link to={`reservations?userId=${loginResponse.userId}`}>View All Reservations</Link>
                                        </li>}
                                        {loginResponse.type === 'ARTIST' && <li>
                                            <Link to={`invitations?userId=${loginResponse.userId}`}>View All Invitations</Link>
                                        </li>}
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <SearchBar />
            <LoginForm />
        </>
    );
};

export default Header;
