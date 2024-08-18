import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import useActive from '../../hooks/useActive';
import productsData from '../../data/productsData';
import ProductCard from './ProductCard';


const TopProducts = ({ artists, gigs}) => {

    const [filteredArtists, setFilteredArtists] = useState(artists);
    const { activeClass, handleActive } = useActive(0);

    // making a unique set of product's category
    const gigsCategory = [
        'All',
        ...gigs
    ];

    // handling product's filtering
    const handleArtists = (category, i) => {
        if (category === 'All') {
            setFilteredArtists(artists);
            handleActive(i);
            return;
        }

        const filteredList = artists.filter(item => item.preferredGigs.includes(category));
        setFilteredArtists(filteredList);
        handleActive(i);
    };


    return (
        <>
            <div className="products_filter_tabs">
                <ul className="tabs">
                    {
                        gigsCategory.map((item, i) => (
                            <li
                                key={i}
                                className={`tabs_item ${activeClass(i)}`}
                                onClick={() => handleArtists(item, i)}
                            >
                                {item}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="wrapper products_wrapper">
                {
                    filteredArtists.slice(0, 11).map(item => (
                        <ProductCard
                            key={item.id}
                            {...item}
                        />
                    ))
                }
                <div className="card products_card browse_card">
                    <Link to="/all-products">
                        Browse All <br /> Products <BsArrowRight />
                    </Link>
                </div>
            </div>
        </>
    );
};

export default TopProducts;