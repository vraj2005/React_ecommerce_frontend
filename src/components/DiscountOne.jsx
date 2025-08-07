import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const DiscountOne = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top discounted products
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        console.log("Fetching discounts from backend...");
        const response = await api.get("/products");
        const data = response.data.products;

        // Calculate discount % and filter active discounted products
        const discountedProducts = data
          .map((product) => {
            const discount =
              product.discountPrice && product.price > product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;
            return { ...product, discount };
          })
          .filter((product) => product.discount > 0 && product.isActive);

        // Sort by discount (highest first) and take top 2
        const topDiscounts = discountedProducts
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 2);

        console.log("Top Discounts:", topDiscounts);
        setDiscounts(topDiscounts);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load discounts");
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  // Render discount card
  const renderDiscountCard = (product, index) => (
    <div className="col-xl-6" key={product._id}>
      <div className="discount-item rounded-16 overflow-hidden position-relative z-1 h-100 d-flex flex-column align-items-start justify-content-center">
        <img
          src={`assets/images/bg/discount-bg${index + 1}.jpg`}
          alt=""
          className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
        />
        <div className="w-100 flex-between gap-20">
          <div className="discount-item__content">
            <span className="fw-semibold text-tertiary-600 mb-20">
              UP TO {product.discount}% OFF
            </span>
            <h6 className="mb-20">{product.name}</h6>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-outline-black rounded-pill gap-8"
            >
              Shop Now
            </Link>
          </div>
          <img
            src={product.images?.[0] || `assets/images/thumbs/discount-img${index + 1}.png`}
            alt={product.name}
            className="d-sm-block d-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="discount py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          {loading ? (
            <div className="col-12">Loading discounts...</div>
          ) : error ? (
            <div className="col-12">Error: {error}</div>
          ) : discounts.length < 2 ? (
            <div className="col-12">Not enough discounted products available</div>
          ) : (
            discounts.map(renderDiscountCard)
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscountOne;