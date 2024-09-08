import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASEURL } from '../../../util/Util';
import './SearchBar.scss';
import commonContext from '../../../contexts/common/commonContext';

const SearchBar = () => {
    const navigate = useNavigate();
    const { setLoading, setProfileData } = useContext(commonContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
      };

    // Debounced search function
    const handleSearch = useCallback(
        debounce(async (searchQuery) => {
            if (searchQuery.trim()) {
                try {
                    const response = await axios.get(`${BASEURL}/artist/search`, {
                        params: { q: searchQuery }
                    });
                    setResults(response.data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500), []); // Increased debounce time to 500ms

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value); // Debounced search
    };

    // Close dropdown on clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef]);

    const handleViewProfileClick = (result) => {
        setProfileData({
            userId: result.userId,
            type: 'ARTIST'
        });
        navigate(`/profile?userId=${result.userId}`);
        setLoading(true); 
    }

    return (
        <div className="search-bar-container" ref={searchRef}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for artists..."
            />
            {showDropdown && results.length > 0 && (
                <div className="dropdown-results">
                    <ul>
                        {results.map(result => (
                            <li key={result.id}>
                                <label onClick={() => handleViewProfileClick(result)}>
                                    <img src={result.profilePicture} alt={result.fullName} className="profile-pic" />
                                    <div className="result-info">
                                        <span className="full-name">{result.fullName}</span>
                                        <span className="preferred-gigs"> ({result.preferredGigs.join(', ')}) </span>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
