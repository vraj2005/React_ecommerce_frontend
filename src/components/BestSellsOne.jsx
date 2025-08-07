import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCountdown } from '../helper/Countdown';

const BestSellsOne = () => {
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        
        const discountedProducts = data
          .filter((product) => product.isActive === true)
          .map((product) => {
            const discount = product.discountPrice && product.price > product.discountPrice
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;
            return { ...product, discount };
          })
          .filter((product) => product.discount > 0);

        const shuffled = discountedProducts.sort(() => 0.5 - Math.random());
        const randomDeals = shuffled.slice(0, 4);

        setProducts(randomDeals);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchBestDeals();
  }, []);

  const renderProductCard = (product) => (
    <div className="col-12 col-md-6" key={product._id}>
      <div className="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
        <div>
          {product.discount && (
            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
              Sale {product.discount}%
            </span>
          )}
          <Link to={`/product-details/${product._id}`} className="product-card__thumb flex-center">
            <img src={product.images?.[0] || 'assets/images/thumbs/best-sell1.png'} alt={product.name || 'Product'} />
          </Link>
          <div className="countdown">
            {/* <ul className="countdown-list style-three flex-align flex-wrap">
              <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                <span className="hours" />
                {timeLeft.hours} Hours
              </li>
              <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                <span className="minutes" />
                {timeLeft.minutes} Min
              </li>
              <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                <span className="seconds" />
                {timeLeft.seconds} Sec
              </li>
            </ul> */}
          </div>
        </div>
        <div className="product-card__content">
          <div className="product-card__price mb-16">
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-heading text-md fw-semibold">
              ${product.discountPrice?.toFixed(2) || product.price.toFixed(2)}{' '}
              <span className="text-gray-500 fw-normal">/Qty</span>
            </span>
          </div>
          <div className="flex-align gap-6">
            <span className="text-xs fw-bold text-gray-600">{product.ratings?.average || 4.8}</span>
            <span className="text-15 fw-bold text-warning-600 d-flex">
              <i className="ph-fill ph-star" />
            </span>
            <span className="text-xs fw-bold text-gray-600">({product.ratings?.count || '17k'})</span>
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
          <div className="mt-12">
            <div
              className="progress w-100 bg-color-three rounded-pill h-4"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={35}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar bg-main-600 rounded-pill"
                style={{ width: `${product.sold && product.stock ? (product.sold / product.stock) * 100 : 35}%` }}
              />
            </div>
            <span className="text-gray-900 text-xs fw-medium mt-8">
              Sold: {product.sold || 18}/{product.stock || 35}
            </span>
          </div>
          <Link
            to="/cart"
            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
          >
            Add To Cart <i className="ph ph-shopping-cart" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="best-sells pb-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">Daily Best Deals</h5>
          </div>
        </div>
        <div className="row g-12">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : products.length === 0 ? (
            <div>No discounted products found.</div>
          ) : (
            products.map((product) => renderProductCard(product))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellsOne;