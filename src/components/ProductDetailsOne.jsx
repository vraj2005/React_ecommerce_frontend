import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetailsOne = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const token = localStorage.getItem('token');

  const getRandomCountdown = () => {
    const randomSeconds = Math.floor(Math.random() * (7 * 24 * 60 * 60 - 3600) + 3600);
    const days = Math.floor(randomSeconds / (24 * 60 * 60));
    const hours = Math.floor((randomSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((randomSeconds % (60 * 60)) / 60);
    const seconds = randomSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const getRandomRatings = () => {
    const average = (Math.random() * 4 + 1).toFixed(1);
    const count = Math.floor(Math.random() * 491) + 10;
    return { average: parseFloat(average), count };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const productData = response.data;

        productData.ratings = productData.ratings || getRandomRatings();
        setProduct(productData);
        setLoading(false);
        if (productData.images?.length > 0) setMainImage(productData.images[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
        setLoading(false);
      }
    };
    fetchProduct();

    setTimeLeft(getRandomCountdown());

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/account');
      return;
    }
    try {
      await dispatch(addToCart({ productId: id, quantity })).unwrap();
      alert('Added to cart! Navigate to cart to see updated items.');
    } catch (err) {
      setError(err || 'Failed to add to cart');
      console.error('Add to Cart Error:', err);
    }
  };

  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, product?.images?.length || 4),
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  if (loading) return <div className="py-80 text-center">Loading product details...</div>;
  if (error) return <div className="py-80 text-center text-danger">{error}</div>;
  if (!product) return <div className="py-80 text-center">Product not found</div>;

  return (
    <section className="product-details py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-9">
            <div className="row gy-4">
              <div className="col-xl-6">
                <div className="product-details__left">
                  <div className="product-details__thumb-slider border border-gray-100 rounded-16">
                    <div className="product-details__thumb flex-center h-100">
                      <img src={mainImage} alt={product.name || 'Product'} />
                    </div>
                  </div>
                  <div className="mt-24">
                    <div className="product-details__images-slider">
                      <Slider {...settingsThumbs}>
                        {product.images.map((image, index) => (
                          <div
                            className="center max-w-120 max-h-120 h-100 flex-center border border-gray-100 rounded-16 p-8"
                            key={index}
                            onClick={() => setMainImage(image)}
                          >
                            <img className="thum" src={image} alt={`Thumbnail ${index}`} />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="product-details__content">
                  <h5 className="mb-12">{product.name}</h5>
                  <div className="flex-align flex-wrap gap-12">
                    <div className="flex-align gap-12 flex-wrap">
                      <div className="flex-align gap-8">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-15 fw-medium text-warning-600 d-flex ${
                              i < Math.round(product.ratings.average) ? 'ph-fill' : 'ph'
                            } ph-star`}
                          />
                        ))}
                      </div>
                      <span className="text-sm fw-medium text-neutral-600">
                        {product.ratings.average} Star Rating
                      </span>
                      <span className="text-sm fw-medium text-gray-500">
                        ({product.ratings.count})
                      </span>
                    </div>
                    <span className="text-sm fw-medium text-gray-500">|</span>
                    <span className="text-gray-900">
                      <span className="text-gray-400">SKU:</span> {product._id.slice(-6)}
                    </span>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <p className="text-gray-700">{product.description}</p>
                  <div className="mt-32 flex-align flex-wrap gap-32">
                    <div className="flex-align gap-8">
                      <h4 className="mb-0">${(product.discountPrice || product.price).toFixed(2)}</h4>
                      {product.discountPrice && (
                        <span className="text-md text-gray-500 text-decoration-line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <div className="flex-align flex-wrap gap-16 bg-color-one rounded-8 py-16 px-24">
                    <div className="countdown" id="countdown11">
                      <ul className="countdown-list flex-align flex-wrap">
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.days} <span className="days" />
                        </li>
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.hours} <span className="hours" />
                        </li>
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.minutes} <span className="minutes" />
                        </li>
                        <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                          {timeLeft.seconds} <span className="seconds" />
                        </li>
                      </ul>
                    </div>
                    <span className="text-gray-900 text-xs">Remains until the end of the offer</span>
                  </div>
                  <div className="mb-24">
                    <div className="mt-32 flex-align gap-12 mb-16">
                      <span className="w-32 h-32 bg-white flex-center rounded-circle text-main-600 box-shadow-xl">
                        <i className="ph-fill ph-lightning" />
                      </span>
                      <h6 className="text-md mb-0 fw-bold text-gray-900">
                        Products are almost sold out
                      </h6>
                    </div>
                    <div
                      className="progress w-100 bg-gray-100 rounded-pill h-8"
                      role="progressbar"
                      aria-label="Stock"
                      aria-valuenow={product.stock}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-bar bg-main-two-600 rounded-pill"
                        style={{ width: `${(product.stock / 100) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 mt-8">
                      Available only: {product.stock}
                    </span>
                  </div>
                  <span className="text-gray-900 d-block mb-8">Quantity:</span>
                  <div className="flex-between gap-16 flex-wrap">
                    <div className="flex-align flex-wrap gap-16">
                      <div className="border border-gray-100 rounded-pill py-9 px-16 flex-align">
                        <button
                          onClick={decrementQuantity}
                          type="button"
                          className="quantity__minus p-4 text-gray-700 hover-text-main-600 flex-center"
                        >
                          <i className="ph ph-minus" />
                        </button>
                        <input
                          type="number"
                          className="quantity__input border-0 text-center w-32"
                          value={quantity}
                          readOnly
                        />
                        <button
                          onClick={incrementQuantity}
                          type="button"
                          className="quantity__plus p-4 text-gray-700 hover-text-main-600 flex-center"
                        >
                          <i className="ph ph-plus" />
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="btn btn-main rounded-pill flex-align d-inline-flex gap-8 px-48"
                      >
                        <i className="ph ph-shopping-cart" /> Add To Cart
                      </button>
                    </div>
                    <div className="flex-align gap-12">
                      <Link
                        to="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                        title="Compare"
                      >
                        <i className="ph ph-shuffle" />
                      </Link>
                      <Link
                        to="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                        title="Share"
                      >
                        <i className="ph ph-share-network" />
                      </Link>
                    </div>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden">
              <div className="p-24">
                <div className="flex-between bg-main-600 rounded-pill p-8">
                  <div className="flex-align gap-8">
                    <span className="w-44 h-44 bg-white rounded-circle flex-center text-2xl">
                      <i className="ph ph-storefront" />
                    </span>
                    <span className="text-white">by {product.brand || 'Unknown'}</span>
                  </div>
                  <Link to="/shop" className="btn btn-white rounded-pill text-uppercase">
                    View Store
                  </Link>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-truck" />
                </span>
                <div>
                  <h6 className="text-sm mb-8">Fast Delivery</h6>
                  <p className="text-gray-700">Lightning-fast shipping, guaranteed.</p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-arrow-u-up-left" />
                </span>
                <div>
                  <h6 className="text-sm mb-8">Free 90-day returns</h6>
                  <p className="text-gray-700">Shop risk-free with easy returns.</p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-credit-card" />
                </span>
                <div>
                  <h6 className="text-sm mb-8">Payment</h6>
                  <p className="text-gray-700">
                    Payment upon receipt of goods, Payment by card in the department, Google Pay,
                    Online card.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-check-circle" />
                </span>
                <div>
                  <h6 className="text-sm mb-8">Warranty</h6>
                  <p className="text-gray-700">{product.warranty || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-80">
          <div className="product-dContent border rounded-24">
            <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
              <ul className="nav common-tab nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-description-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-description"
                    type="button"
                    role="tab"
                    aria-controls="pills-description"
                    aria-selected="true"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-reviews-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-reviews"
                    type="button"
                    role="tab"
                    aria-controls="pills-reviews"
                    aria-selected="false"
                  >
                    Reviews
                  </button>
                </li>
              </ul>
              <Link
                to="#"
                className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
              >
                <img src="assets/images/icon/satisfaction-icon.png" alt="" />
                100% Satisfaction Guaranteed
              </Link>
            </div>
            <div className="product-dContent__box">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-description"
                  role="tabpanel"
                  aria-labelledby="pills-description-tab"
                  tabIndex={0}
                >
                  <div className="mb-40">
                    <h6 className="mb-24">Product Description</h6>
                    <p>{product.description}</p>
                  </div>
                  <div className="mb-40">
                    <h6 className="mb-24">Product Specifications</h6>
                    <ul className="mt-32">
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Product Type: <span className="text-gray-500">{product.type || 'N/A'}</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Brand: <span className="text-gray-500">{product.brand || 'N/A'}</span>
                        </span>
                      </li>
                      {Object.entries(product.specifications || {}).map(([key, value]) =>
                        value && value !== 'N/A' ? (
                          <li key={key} className="text-gray-400 mb-14 flex-align gap-14">
                            <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                              <i className="ph ph-check" />
                            </span>
                            <span className="text-heading fw-medium">
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                              <span className="text-gray-500">
                                {Array.isArray(value) ? value.join(', ') : value.toString()}
                              </span>
                            </span>
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-reviews"
                  role="tabpanel"
                  aria-labelledby="pills-reviews-tab"
                  tabIndex={0}
                >
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <h6 className="mb-24">Product Reviews</h6>
                      <div className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                        <img
                          src="assets/images/thumbs/comment-img1.png"
                          alt=""
                          className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                        />
                        <div className="flex-grow-1">
                          <div className="flex-between align-items-start gap-8">
                            <div>
                              <h6 className="mb-12 text-md">Nicolas Cage</h6>
                              <div className="flex-align gap-8">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className="text-15 fw-medium text-warning-600 d-flex ph-fill ph-star"
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-gray-800 text-xs">3 Days ago</span>
                          </div>
                          <h6 className="mb-14 text-md mt-24">Great Product</h6>
                          <p className="text-gray-700">
                            There are many variations of passages of Lorem Ipsum available...
                          </p>
                          <div className="flex-align gap-20 mt-44">
                            <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                              <i className="ph-bold ph-thumbs-up" /> Like
                            </button>
                            <Link
                              to="#comment-form"
                              className="flex-align gap-12 text-gray-700 hover-text-main-600"
                            >
                              <i className="ph-bold ph-arrow-bend-up-left" /> Reply
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="ms-xxl-5">
                        <h6 className="mb-24">Customers Feedback</h6>
                        <div className="d-flex flex-wrap gap-44">
                          <div className="border border-gray-100 rounded-8 px-40 py-52 flex-center flex-column flex-shrink-0 text-center">
                            <h2 className="mb-6 text-main-600">{product.ratings.average}</h2>
                            <div className="flex-center gap-8">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-15 fw-medium text-warning-600 d-flex ${
                                    i < Math.round(product.ratings.average) ? 'ph-fill' : 'ph'
                                  } ph-star`}
                                />
                              ))}
                            </div>
                            <span className="mt-16 text-gray-500">Average Product Rating</span>
                          </div>
                          <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                            <div className="flex-align gap-8 mb-20">
                              <span className="text-gray-900 flex-shrink-0">5</span>
                              <div
                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                role="progressbar"
                                aria-valuenow={70}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: `${(product.ratings.count * 0.7) / 5}%` }}
                                />
                              </div>
                              <span className="text-gray-900 flex-shrink-0">
                                {Math.round(product.ratings.count * 0.7)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsOne;