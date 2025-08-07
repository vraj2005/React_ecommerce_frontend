import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { addToCart } from "../redux/slices/cartSlice";
import api from "../services/api";
import { getCountdown } from "../helper/Countdown";

const SampleNextArrow = memo(function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
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
      className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
    >
      <i className="ph ph-caret-left" />
    </button>
  );
});

const DealsOne = () => {
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [dealOfWeek, setDealOfWeek] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartLoading } = useSelector((state) => state.cart);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch deals from backend
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        console.log("Fetching deals from backend...");
        const response = await api.get("/products");
        const data = response.data.products;

        // Filter discounted products and calculate discount %
        const discountedProducts = data
          .map((product) => {
            const discount =
              product.discountPrice && product.price > product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;
            return { ...product, discount };
          })
          .filter((product) => product.discount > 0 && product.isActive);

        // Set "Deal of the Week" (highest discount or featured)
        const topDeal = discountedProducts.reduce((max, product) =>
          product.discount > max.discount ? product : max, discountedProducts[0]
        );
        setDealOfWeek(topDeal);

        // Shuffle and limit slider deals to 7
        const shuffled = discountedProducts.sort(() => 0.5 - Math.random());
        setDeals(shuffled.slice(0, 7));
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load deals");
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Handle Add to Cart
  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate("/account");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      navigate("/cart");
    } catch (err) {
      setError("Failed to add to cart");
    }
  };

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
      { breakpoint: 1599, settings: { slidesToShow: 5 } },
      { breakpoint: 1399, settings: { slidesToShow: 3 } },
      { breakpoint: 1199, settings: { slidesToShow: 2 } },
      { breakpoint: 575, settings: { slidesToShow: 1 } },
    ],
  };

  // Render deal card
  const renderDealCard = (product) => (
    <div key={product._id}>
      <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
        <Link
          to={`/product/${product._id}`}
          className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
        >
          {product.discount > 0 && (
            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
              Sale {product.discount}%
            </span>
          )}
          <img
            src={product.images?.[0] || "assets/images/thumbs/product-two-img1.png"}
            alt={product.name}
            className="w-auto max-w-unset"
          />
        </Link>
        <div className="product-card__content mt-16">
          <div className="flex-align gap-6">
            <span className="text-xs fw-medium text-gray-500">{product.ratings.average || 4.8}</span>
            <span className="text-15 fw-medium text-warning-600 d-flex">
              <i className="ph-fill ph-star" />
            </span>
            <span className="text-xs fw-medium text-gray-500">({product.ratings.count || "17k"})</span>
          </div>
          <h6 className="title text-lg fw-semibold mt-12 mb-8">
            <Link to={`/product/${product._id}`} className="link text-line-2">
              {product.name}
            </Link>
          </h6>
          <div className="flex-align gap-4">
            <span className="text-tertiary-600 text-md d-flex">
              <i className="ph-fill ph-storefront" />
            </span>
            <span className="text-gray-500 text-xs">By {product.brand || "Lucky Supermarket"}</span>
          </div>
          <div className="mt-8">
            <div
              className="progress w-100 bg-color-three rounded-pill h-4"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={product.stock > 0 ? (product.stock / (product.stock + 10)) * 100 : 35}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar bg-tertiary-600 rounded-pill"
                style={{ width: `${product.stock > 0 ? (product.stock / (product.stock + 10)) * 100 : 35}%` }}
              />
            </div>
            <span className="text-gray-900 text-xs fw-medium mt-8">
              Stock: {product.stock || 35}
            </span>
          </div>
          <div className="product-card__price my-20">
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-heading text-md fw-semibold">
              ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}{" "}
              <span className="text-gray-500 fw-normal">/Qty</span>
            </span>
          </div>
          <button
            onClick={() => handleAddToCart(product._id)}
            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
            disabled={cartLoading}
          >
            {cartLoading ? "Adding..." : "Add To Cart"} <i className="ph ph-shopping-cart" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="deals-weeek pt-80">
      <div className="container container-lg">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h5 className="mb-0">Deal of The Week</h5>
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
          <div className="deal-week-box rounded-16 overflow-hidden flex-between position-relative z-1 mb-24">
            <img
              src="assets/images/bg/week-deal-bg.png"
              alt=""
              className="position-absolute inset-block-start-0 inset-block-start-0 w-100 h-100 z-n1 object-fit-cover"
            />
            <div className="d-lg-block d-none ps-32 flex-shrink-0">
              <img
                src={dealOfWeek?.images?.[0] || "assets/images/thumbs/week-deal-img1.png"}
                alt={dealOfWeek?.name || "Deal of the Week"}
              />
            </div>
            <div className="deal-week-box__content px-sm-4 d-block w-100 text-center">
              {loading ? (
                <h6 className="mb-20">Loading...</h6>
              ) : error ? (
                <h6 className="mb-20">Error: {error}</h6>
              ) : (
                <h6 className="mb-20">{dealOfWeek?.name || "No Deal Available"}</h6>
              )}
              <div className="countdown mt-20" id="countdown4">
                <ul className="countdown-list style-four flex-center flex-wrap">
                  <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                    <span className="days" />
                    {timeLeft.days} <br /> Days
                  </li>
                  <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                    <span className="hours" />
                    {timeLeft.hours} <br /> Hour
                  </li>
                  <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                    <span className="minutes" />
                    {timeLeft.minutes} <br /> Min
                  </li>
                  <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                    <span className="seconds" />
                    {timeLeft.seconds} <br /> Sec
                  </li>
                </ul>
              </div>
            </div>
            <div className="d-lg-block d-none flex-shrink-0 pe-xl-5">
              <div className="me-xxl-5">
                <img
                  src={dealOfWeek?.images?.[1] || dealOfWeek?.images?.[0] || "assets/images/thumbs/week-deal-img2.png"}
                  alt={dealOfWeek?.name || "Deal of the Week"}
                />
              </div>
            </div>
          </div>
          <div className="deals-week-slider arrow-style-two">
            {loading ? (
              <div>Loading deals...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : deals.length === 0 ? (
              <div>No deals available</div>
            ) : (
              <Slider {...settings}>{deals.map(renderDealCard)}</Slider>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsOne;