import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const BannerOne = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const scrollToProducts = () => {
    const productSection = document.getElementById('new-arrival-section');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="banner">
      <div className="container container-lg">
        <div
          className="banner-item rounded-24 overflow-hidden position-relative"
          style={{ backgroundColor: 'rgba(59, 146, 81, 0.60)' }} 
        >
          <div className="banner-slider">
            <Slider {...settings}>
              <div className="banner-slider__item">
                <div className="banner-slider__inner flex-between position-relative">
                  <div className="banner-item__content">
                    <h1 className="banner-item__title bounce">
                      Power Up with <span style={{ color: '#fff', fontWeight: 'bold' }}>RigitX</span> - Top PC Parts Await
                    </h1>
                    <button
                      onClick={scrollToProducts}
                      className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-16"
                    >
                      Shop Now{' '}
                      <span className="icon text-xl d-flex">
                        <i className="ph ph-cpu" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="banner-slider__item">
                <div className="banner-slider__inner flex-between position-relative">
                  <div className="banner-item__content">
                    <h1 className="banner-item__title">
                      Build Your Rig with <span style={{ color: '#fff', fontWeight: 'bold' }}>RigitX</span> - Fast Shipping
                    </h1>
                    <button
                      onClick={scrollToProducts}
                      className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-16"
                    >
                      Shop Now{' '}
                      <span className="icon text-xl d-flex">
                        <i className="ph ph-cpu" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerOne;