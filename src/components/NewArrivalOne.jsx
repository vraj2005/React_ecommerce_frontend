import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

// Custom arrow components
function SampleNextArrow(props) {
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
}

function SamplePrevArrow(props) {
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
}

const NewArrivalOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slider settings
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1599, settings: { slidesToShow: 6 } },
      { breakpoint: 1399, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 575, settings: { slidesToShow: 2 } },
      { breakpoint: 424, settings: { slidesToShow: 1 } },
    ],
  };

  // Fetch new arrivals
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        console.log('Fetching products from API...');
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log('API Products:', data);

        // Filter active products
        const activeProducts = data.filter((product) => product.isActive === true);

        // Sort by createdAt (if available) or assume last added, take top 10
        const newArrivals = activeProducts
          .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)) // Fallback to _id if no createdAt
          .slice(0, 10); // Limit to 10 for slider

        console.log('New Arrivals:', newArrivals);
        setProducts(newArrivals);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  // Render product card
  const renderProductCard = (product) => (
    <div key={product._id}>
      <div className="product-card px-8 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
        <Link to={`/product-details/${product._id}`} className="product-card__thumb flex-center">
          <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name || 'Product'} />
        </Link>
        <div className="product-card__content mt-12">
          <div className="flex-align gap-6">
            <span className="text-xs fw-bold text-gray-500">{product.rating || 4.8}</span>
            <span className="text-15 fw-bold text-warning-600 d-flex">
              <i className="ph-fill ph-star" />
            </span>
            <span className="text-xs fw-bold text-gray-500">({product.reviews || '17k'})</span>
          </div>
          <h6 className="title text-lg fw-semibold mt-12 mb-8">
            <Link to={`/product-details/${product._id}`} className="link text-line-2">
              {product.name || 'Unnamed Product'}
            </Link>
          </h6>
          <div className="flex-align gap-4">
            <span className="text-main-600 text-md d-flex">
              <i className="ph-fill ph-storefront" />
            </span>
            <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
          </div>
          <div className="flex-between gap-8 mt-24 flex-wrap">
            <div className="product-card__price">
              {product.discountPrice && (
                <span className="text-gray-400 text-md fw-semibold text-decoration-line-through d-block">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className="text-heading text-md fw-semibold">
                ${(product.discountPrice || product.price).toFixed(2)}{' '}
                <span className="text-gray-500 fw-normal">/Qty</span>
              </span>
            </div>
            <Link
              to="/cart"
              className="product-card__cart btn btn-main py-11 px-24 rounded-pill flex-align gap-8"
            >
              Add <i className="ph ph-shopping-cart" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="new-arrival pb-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">New Arrivals</h5>
            <div className="flex-align mr-point gap-16">
              <Link
                to="/shop"
                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
              >
                View All Deals
              </Link>
            </div>
          </div>
        </div>
        <div className="new-arrival__slider arrow-style-two">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : products.length === 0 ? (
            <div>No new arrivals found.</div>
          ) : (
            <Slider {...settings}>{products.map((product) => renderProductCard(product))}</Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalOne;
