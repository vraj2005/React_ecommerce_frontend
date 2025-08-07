import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

// Memoized arrow components
const SampleNextArrow = memo(function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
    >
      <i className="ph ph-caret-right" />
    </button>
  );
});

const SamplePrevArrow = memo(function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
    >
      <i className="ph ph-caret-left" />
    </button>
  );
});

const FlashSalesOne = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true, // Autoplay is enabled
    autoplaySpeed: 3000, // 3 seconds per slide
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        console.log('Fetching products from API...');
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log('API Products:', data);

        const sales = data
          .filter((product) => product.isActive)
          .map((product) => {
            const discount =
              product.discountPrice && product.price > product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;
            return { ...product, discount };
          })
          .filter((product) => product.discount > 0)
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 3);

        console.log('Flash Sales:', sales);
        setFlashSales(sales);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchFlashSales();
  }, []);

  const renderFlashSaleItem = (product) => (
    <div key={product._id}>
      <div
        className="flash-sales-item rounded-16 overflow-hidden z-1 position-relative flex-align flex-0 justify-content-between gap-8"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 146, 81, 0.5) 0%, rgba(35, 104, 52, 0.7) 100%)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          minHeight: '300px',
        }}
      >
        <div className="flash-sales-item__thumb d-sm-block d-none flex-shrink-0">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '8px',
            }}
          />
        </div>
        <div className="flash-sales-item__content ms-sm-auto p-16 flex-grow-1">
          <h6
            className="text-2xl mb-20 text-white"
            style={{
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 3, // Limit to 3 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Add ... for overflow
            }}
          >
            {product.name || 'Flash Sale Item'}
          </h6>
          <Link
            to={`/product-details/${product._id}`}
            className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-24 px-6 py-3"
          >
            Shop Now
            <span className="icon text-xl d-flex">
              <i className="ph ph-arrow-right" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="flash-sales pt-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">Flash Sales Today</h5>
            <div className="flex-align gap-16 mr-point">
              <Link
                to="/shop"
                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
              >
                View All Deals
              </Link>
            </div>
          </div>
        </div>
        <div className="flash-sales__slider arrow-style-two">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : flashSales.length === 0 ? (
            <div>No flash sales available.</div>
          ) : (
            <Slider {...settings}>
              {flashSales.map((product) => renderFlashSaleItem(product))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashSalesOne;