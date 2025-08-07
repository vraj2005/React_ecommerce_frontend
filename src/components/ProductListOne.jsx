import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice"; // Ensure this slice exists
import api from "../services/api";

const ProductListOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check for authentication

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from /api/products...");
        const response = await api.get("/products");
        console.log("API Response:", response.data);

        const productData = response.data.products || response.data || [];
        if (!Array.isArray(productData)) {
          throw new Error("Response data is not an array");
        }

        const activeProducts = productData.filter((product) => product.isActive === true);
        setProducts(activeProducts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
        setLoading(false);
        console.error("Fetch Error:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) {
      navigate('/account'); // Redirect to login if not authenticated
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap(); // Default quantity is 1
      // alert('Added to cart! Navigate to cart to see updated items.');
    } catch (err) {
      setError(err || 'Failed to add to cart');
      console.error('Add to Cart Error:', err);
    }
  };

  if (loading) {
    return <div className="mt-24 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="mt-24 text-center text-danger">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="mt-24 text-center">No active products found</div>;
  }

  return (
    <div className="product mt-24">
      <div className="container container-lg">
        <div className="row gy-4 g-12">
          {products.map((product) => (
            <div key={product._id} className="col-xxl-2 col-lg-3 col-sm-4 col-6">
              <div className="product-card px-8 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16"
                >
                  Add <i className="ph ph-shopping-cart" />
                </button>
                <Link
                  to={`/product-details/${product._id}`}
                  className="product-card__thumb flex-center"
                >
                  <img
                    src={product.images?.[0] || "assets/images/thumbs/product-img1.png"}
                    alt={product.name || "Product"}
                  />
                </Link>
                <div className="product-card__content mt-12">
                  <div className="product-card__price mb-16">
                    {product.discountPrice && (
                      <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                        ${product.price?.toFixed(2)}
                      </span>
                    )}
                    <span className="text-heading text-md fw-semibold">
                      ${(product.discountPrice || product.price)?.toFixed(2)}{" "}
                      <span className="text-gray-500 fw-normal">/Qty</span>
                    </span>
                  </div>
                  <div className="flex-align gap-6">
                    <span className="text-xs fw-bold text-gray-600">
                      {product.ratings?.average || "N/A"}
                    </span>
                    <span className="text-15 fw-bold text-warning-600 d-flex">
                      <i className="ph-fill ph-star" />
                    </span>
                    <span className="text-xs fw-bold text-gray-600">
                      ({product.ratings?.totalReviews || 0}k)
                    </span>
                  </div>
                  <h6 className="title text-lg fw-semibold mt-12 mb-8">
                    <Link
                      to={`/product-details/${product._id}`}
                      className="link text-line-2"
                    >
                      {product.name || "Unnamed Product"}
                    </Link>
                  </h6>
                  <div className="flex-align gap-4">
                    <span className="text-main-600 text-md d-flex">
                      <i className="ph-fill ph-storefront" />
                    </span>
                    <span className="text-gray-500 text-xs">
                      By {product.brand || "Unknown Brand"}
                    </span>
                  </div>
                  <div className="mt-12">
                    <div
                      className="progress w-100 bg-color-three rounded-pill h-4"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow={
                        product.stock ? Math.min(Math.round((product.stock / 100) * 100), 100) : 0
                      }
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-bar bg-main-600 rounded-pill"
                        style={{
                          width: `${product.stock ? Math.min(Math.round((product.stock / 100) * 100), 100) : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-900 text-xs fw-medium mt-8">
                      Stock: {product.stock || 0}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListOne;