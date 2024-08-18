import { createContext, useReducer } from 'react';
import commonReducer from './commonReducer';

// Common-Context
const commonContext = createContext();

// Initial State
const initialState = {
    isFormOpen: false,
    formUserInfo: '',
    isSearchOpen: false,
    isLoggedIn: false,
    loginResponse: {},
    searchResults: [],
    profileData: {},
    artistDetails: {},
    companyDetails: {},
    loading: true
};

// Common-Provider Component
const CommonProvider = ({ children }) => {

    const [state, dispatch] = useReducer(commonReducer, initialState);

    // Form actions
    const toggleForm = (toggle) => {
        return dispatch({
            type: 'TOGGLE_FORM',
            payload: { toggle }
        });
    };

    const setFormUserInfo = (info) => {
        return dispatch({
            type: 'SET_FORM_USER_INFO',
            payload: { info }
        });
    };

    // Search actions
    const toggleSearch = (toggle) => {
        return dispatch({
            type: 'TOGGLE_SEARCH',
            payload: { toggle }
        });
    };

    const setLoggedIn = (val) => {
        return dispatch({
            type: "SET_LOGGED_IN",
            payload: { val }
        })
    }

    const setLoginResponse = (val) => {
        return dispatch({
            type: "SET_LOGIN_RESPONSE",
            payload: { val }
        })
    }

    const setSearchResults = (results) => {
        return dispatch({
            type: 'SET_SEARCH_RESULTS',
            payload: { results }
        });
    };

    const setProfileData = (val) => {
        return dispatch({
            type: 'SET_PROFILE_DATA',
            payload: { val }
        });
    };

    const setArtistDetails = (val) => {
        return dispatch({
            type: 'SET_ARTIST_DETAILS',
            payload: { val }
        });
    };

    const setCompanyDetails = (val) => {
        return dispatch({
            type: 'SET_COMPANY_DETAILS',
            payload: { val }
        });
    };

    const setLoading = (val) => {
        return dispatch({
            type: 'SET_LOADING',
            payload: { val }
        });
    }

    // Context values
    const values = {
        ...state,
        toggleForm,
        setFormUserInfo,
        toggleSearch,
        setLoggedIn,
        setLoginResponse,
        setSearchResults,
        setProfileData,
        setArtistDetails,
        setCompanyDetails,
        setLoading
    };

    return (
        <commonContext.Provider value={values}>
            {children}
        </commonContext.Provider>
    );
};

export default commonContext;
export { CommonProvider };