import axios from "axios";

export const fetchArtistDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/artist/user/${userId}`
      );
      if (response.data.success) {
        return response.data.artists[0];
      } else {
          // show error page
          return null;
      }
    } catch (error) {
      console.error('Error fetching artist details:', error);
    }
    return null;
  };

  export const fetchCompanyDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/company/user/${userId}`);
      if (response.data.success) {
        return response.data.companies[0];
      } else {
        // show error page
        return null;
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
    return null;
  };