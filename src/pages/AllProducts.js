import React, { useContext, useState, useEffect } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import axios from 'axios';
import useDocTitle from '../hooks/useDocTitle';
import FilterBar from '../components/filters/FilterBar';
import ProductCard from '../components/product/ProductCard';
import Services from '../components/common/Services';
import filtersContext from '../contexts/filters/filtersContext';
import EmptyView from '../components/common/EmptyView';
import Loader from '../components/common/loader/Loader';
import commonContext from '../contexts/common/commonContext';


const AllProducts = () => {

    useDocTitle('All Products');

    const { allProducts } = useContext(filtersContext);
    const { loading, setLoading } = useContext(commonContext);
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        fetchAllArtists();
    }, []);

    const fetchAllArtists = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/artist`);
            if (response.data.success) {
              setArtists(response.data.artists);
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
        <>
            <section id="all_products" className="section">
                <FilterBar />

                <div className="container">
                    {
                        allProducts.length ? (
                            <div className="wrapper products_wrapper">
                                {
                                    artists.map(item => (
                                        <ProductCard
                                            key={item.id}
                                            {...item}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <EmptyView
                                icon={<BsExclamationCircle />}
                                msg="No Results Found"
                            />
                        )
                    }
                </div>
            </section>

            {/* <Services /> */}
        </>
    );
};

export default AllProducts;