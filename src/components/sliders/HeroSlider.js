import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper';
import { displayMoney } from '../../helpers/utils';
import productsData from '../../data/productsData';
import landingPageDance from '../../images/landingPageDance.jpeg';
import landingPageMusic from '../../images/landingPageMusic.jpeg';
import landingPageSports from '../../images/landingPageSports.jpeg';
import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/pagination';
import './Slider.scss';


const HeroSlider = ({ sliderData }) => {

    const heroProducts = productsData.filter(item => item.tag === 'hero-product');

    const getImagePath = (val) => {
        switch (val) {
            case "landingPageDance":
                return landingPageDance;
            case "landingPageMusic":
                return landingPageMusic;
            case "landingPageSports":
                return landingPageSports;
            default:
                return null;            
        }
    }

    return (
        <Swiper
            modules={[Pagination, A11y, Autoplay]}
            loop={true}
            speed={400}
            spaceBetween={100}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
            className='swiper-background'
        >
            {
                sliderData.map((item, id) => {
                    // const { id, title, tagline, heroImage, finalPrice, originalPrice, path } = item;
                    const { title, subTitle, imageUrl, path, buttonName } = item;
                    // const newPrice = displayMoney(finalPrice);
                    // const oldPrice = displayMoney(originalPrice);

                    return (
                        <SwiperSlide
                            key={id}
                            className={`wrapper hero_wrapper hero_slide-${id}`}
                        >
                            <div className="hero_item_txt">
                                <h3>{title}</h3>
                                <h1>{subTitle}</h1>
                                {/* <h2 className="hero_price">
                                    {newPrice} &nbsp;
                                    <small><del>{oldPrice}</del></small>
                                </h2> */}
                                <Link to={`${path}${id}`} className="btn">{buttonName}</Link>
                            </div>
                            <figure className="hero_item_img">
                                <img src={getImagePath(imageUrl)} alt="product-img" />
                            </figure>
                        </SwiperSlide>
                    );
                })
            }
        </Swiper>
    );
};

export default HeroSlider;