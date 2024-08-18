const commonReducer = (state, action) => {
    switch (action.type) {

        case 'TOGGLE_FORM':
            return {
                ...state,
                isFormOpen: action.payload.toggle
            };


        case 'SET_FORM_USER_INFO':
            return {
                ...state,
                formUserInfo: action.payload.info
            };


        case 'TOGGLE_SEARCH':
            return {
                ...state,
                isSearchOpen: action.payload.toggle
            };

        case 'SET_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: action.payload.val
            };
            
        case 'SET_LOGIN_RESPONSE':
            return {
                ...state,
                loginResponse: action.payload.val
            };

        case 'SET_SEARCH_RESULTS':
            return {
                ...state,
                searchResults: action.payload.results
            };

        case 'SET_PROFILE_DATA':
            return {
                ...state,
                profileData: action.payload.val
            };

        case 'SET_ARTIST_DETAILS':
            return {
                ...state,
                artistDetails: action.payload.val
            };
                
        case 'SET_COMPANY_DETAILS':
            return {
                ...state,
                companyDetails: action.payload.val
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload.val
            }; 

        default:
            return state;
    }
};

export default commonReducer;