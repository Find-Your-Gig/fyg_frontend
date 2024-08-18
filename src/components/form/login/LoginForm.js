import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import commonContext from '../../../contexts/common/commonContext';
import useForm from '../../../hooks/useForm';
import useOutsideClose from '../../../hooks/useOutsideClose';
import useScrollDisable from '../../../hooks/useScrollDisable';

const LoginForm = () => {
    const { isFormOpen, toggleForm, setLoggedIn, setLoginResponse, loading, setLoading, setProfileData } = useContext(commonContext);
    const { inputValues, handleInputValues, /*handleFormSubmit*/ } = useForm();

    const formRef = useRef();
    const navigate = useNavigate();

    useOutsideClose(formRef, () => {
        toggleForm(false);
    });

    useScrollDisable(isFormOpen);

    const [isSignupVisible, setIsSignupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Signup-form visibility toggling
    const handleIsSignupVisible = () => {
        setIsSignupVisible(prevState => !prevState);
        setErrorMessage(''); // Clear error message when toggling forms
    };

    // Handle form submission
    const handleFormSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        setErrorMessage(''); // Clear any previous error messages

        const apiUrl = isSignupVisible ? 'http://localhost:8080/api/user/register' : 'http://localhost:8080/api/user/login';
        const requestBody = isSignupVisible
            ? {
                  fullName: inputValues.username,
                  email: inputValues.mail,
                  password: inputValues.password,
                  type: inputValues.register_as.toUpperCase() // Assuming type is either 'ARTIST' or 'COMPANY'
              }
            : {
                  email: inputValues.mail,
                  password: inputValues.password
              };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            if (result.success) {
                toggleForm(false); // Close the form on success
                setLoggedIn(true);
                setLoginResponse({
                    userId: result.userId,
                    fullName: result.fullName,
                    email: result.email,
                    type: result.type
                });
                setProfileData({
                    userId: result.userId,
                    type: result.type
                });

                if (isSignupVisible) {
                    if (result.type === 'ARTIST')
                        navigate(`/artistDetailsForm?userId=${result.userId}`);
                    else if (result.type === 'COMPANY')
                        navigate(`/companyDetailsForm?userId=${result.userId}`)
                } else {
                    if (result.type === 'ARTIST') {
                        navigate(`/profile?userId=${result.userId}`);
                    } else if (result.type === 'COMPANY') {
                        navigate(`/profile?userId=${result.userId}`);
                    }
                }
            } else {
                setErrorMessage(result.errorDetail.description); // Show error message
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred.'); // General error message
        }
    };

    return (
        <>
            {isFormOpen && (
                <div className="backdrop">
                    <div className="modal_centered">
                        <form id="account_form" ref={formRef} onSubmit={handleFormSubmit}>
                            {/*===== Form-Header =====*/}
                            <div className="form_head">
                                <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                                <p>
                                    {isSignupVisible ? 'Already have an account?' : 'New user?'}
                                    &nbsp;&nbsp;
                                    <button style={{ color: "#00ffff" }} type="button" onClick={handleIsSignupVisible}>
                                        {isSignupVisible ? 'Login' : 'Create an account'}
                                    </button>
                                </p>
                            </div>

                            {/*===== Error Message =====*/}
                            {errorMessage && (
                                <div className="error_message">
                                    {errorMessage}
                                </div>
                            )}

                            {/*===== Form-Body =====*/}
                            <div className="form_body">
                                {isSignupVisible && (
                                    <div className="input_box">
                                        <input
                                            type="text"
                                            name="username"
                                            className="input_field"
                                            value={inputValues.username || ''}
                                            onChange={handleInputValues}
                                            required
                                        />
                                        <label className="input_label">Full Name</label>
                                    </div>
                                )}

                                <div className="input_box">
                                    <input
                                        type="email"
                                        name="mail"
                                        className="input_field"
                                        value={inputValues.mail || ''}
                                        onChange={handleInputValues}
                                        required
                                    />
                                    <label className="input_label">Email</label>
                                </div>

                                <div className="input_box">
                                    <input
                                        type="password"
                                        name="password"
                                        className="input_field"
                                        value={inputValues.password || ''}
                                        onChange={handleInputValues}
                                        required
                                    />
                                    <label className="input_label">Password</label>
                                </div>

                                {isSignupVisible && (
                                    <div className="input_box">
                                        <input
                                            type="password"
                                            name="conf_password"
                                            className="input_field"
                                            value={inputValues.conf_password || ''}
                                            onChange={handleInputValues}
                                            required
                                        />
                                        <label className="input_label">Confirm Password</label>
                                    </div>
                                )}

                                {isSignupVisible && (
                                    <div className="input_box">
                                        <select
                                            name="register_as"
                                            className="input_field dropdown_field"
                                            value={inputValues.register_as || ''}
                                            onChange={handleInputValues}
                                            required
                                        >
                                            <option value="" disabled hidden>Select</option>
                                            <option className="option_style" value="Artist">Artist</option>
                                            <option className="option_style" value="Company">Company</option>
                                        </select>
                                        <label className="input_label">Register as</label>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn login_btn"
                                >
                                    {isSignupVisible ? 'Signup' : 'Login'}
                                </button>
                            </div>

                            {/*===== Form-Close-Btn =====*/}
                            <div
                                className="close_btn"
                                title="Close"
                                onClick={() => toggleForm(false)}
                            >
                                &times;
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginForm;
