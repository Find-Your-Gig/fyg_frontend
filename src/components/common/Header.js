import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineShop } from 'react-icons/ai';
import { dropdownMenu } from '../../data/headerData';
import commonContext from '../../contexts/common/commonContext';
import cartContext from '../../contexts/cart/cartContext';
import LoginForm from '../form/login/LoginForm';
import SearchBar from './SearchBar';


const Header = () => {

    const { formUserInfo, toggleForm, toggleSearch, isLoggedIn, setLoading, loginResponse } = useContext(commonContext);
    const { cartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);


    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);

        window.addEventListener('scroll', handleIsSticky);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
        };
    }, [isSticky]);


    const cartQuantity = cartItems.length;

    const handleAllProducts = () => {
        setLoading(true);
    }

    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">FindYourGig</Link>
                        </h2>
                        <nav className="nav_actions">
                            <div className="search_action">
                                <span onClick={() => toggleSearch(true)}>
                                    <AiOutlineSearch />
                                </span>
                                <div className="tooltip">Search</div>
                            </div>

                            <div className="vendors_action">
                                <Link to="/all-products">
                                    <AiOutlineShop onClick={handleAllProducts} />
                                </Link>
                                <div className="tooltip">Artists</div>
                            </div>

                            {/* <div className="cart_action">
                                <Link to="/cart">
                                    <AiOutlineShoppingCart />
                                    {
                                        cartQuantity > 0 && (
                                            <span className="badge">{cartQuantity}</span>
                                        )
                                    }
                                </Link>
                                <div className="tooltip">Cart</div>
                            </div> */}

                            <div className="user_action">
                                <span>
                                    <AiOutlineUser />
                                </span>
                                <div className="dropdown_menu">
                                    <h4>Hello! {formUserInfo && <Link to="*">&nbsp;{formUserInfo}</Link>}</h4>
                                    <p>Access account and manage orders</p>
                                    {
                                        !formUserInfo && !isLoggedIn && (
                                            <button
                                                type="button"
                                                onClick={() => toggleForm(true)}
                                            >
                                                Login / Signup
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