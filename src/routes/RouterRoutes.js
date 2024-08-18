import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore';
import AllProducts from '../pages/AllProducts';
import Cart from '../pages/Cart';
import Home from '../pages/home/Home';
import ProductDetails from '../pages/ProductDetails';
import ErrorPage from '../pages/ErrorPage';
import ArtistDetailsForm from '../components/form//artistdetails/ArtistDetailsForm';
import Profile from '../pages/Profile';
import CompanyDetailsForm from '../components/form/companydetails/CompanyDetailsForm';
import Reservations from '../pages/reservations/Reservations';
import Invitations from '../pages/invitations/Invitations';

const RouterRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/all-products" element={<AllProducts />} />
                <Route path="/product-details/:productId" element={<ProductDetails />} />
                <Route path="/artistDetailsForm" element={<ArtistDetailsForm />} />
                <Route path="/companyDetailsForm" element={<CompanyDetailsForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/invitations" element={<Invitations />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </>
    );
};

export default RouterRoutes;