import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Home.scss';
import HeroSlider from '../../components/sliders/HeroSlider';
import FeaturedSlider from '../../components/sliders/FeaturedSlider';
import SectionsHead from '../../components/common/SectionsHead';
import TopProducts from '../../components/product/TopProducts';
import Services from '../../components/common/Services';
import commonContext from '../../contexts/common/commonContext';
import Loader from '../../components/common/loader/Loader';
import { BASEURL } from '../../util/Util';
const _ = require("lodash");

const Home = () => {
    const { loading, setLoading, toggleForm, isLoggedIn } = useContext(commonContext);
    const [artists, setArtists] = useState([]);
    const [locations, setLocations] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [sliderData, setSliderData] = useState([]);

    useEffect(() => {
        fetchLandingPageData();
    }, []);

    const fetchLandingPageData = async () => {
        try {
            const response = await axios.get(`${BASEURL}/common/landingPageData`);
            if (response.data.success) {
                setArtists(response.data.artists);
                setLocations(response.data.locations);
                setGigs(response.data.gigs);
                setSliderData(response.data.sliderDataList);
            } else {
                // show error page
            }
        } catch (error) {
            console.error('Error fetching artist details:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <main>
            <section id="cta-section">
                <div className="cta-content">
                    {!isLoggedIn && <button type="button" className="cta-button" onClick={() => toggleForm(true)}>Register</button>}
                    {!isLoggedIn && <button type="button" className="cta-button" onClick={() => toggleForm(true)}>Login</button>}
                </div>
            </section>

            <section id="hero">
                <HeroSlider sliderData={sliderData} />
            </section>

            <section id="products" className="section">
                <div className="container">
                    <SectionsHead heading="Top Artists" />
                    <TopProducts artists={artists} gigs={gigs} />
                </div>
            </section>

            {/* <Services /> */}
        </main>
    );
};

export default Home;
