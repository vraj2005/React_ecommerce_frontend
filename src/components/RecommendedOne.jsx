import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecommendedOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();

        // Filter active products, then shuffle and pick 12
        const activeProducts = data.filter((product) => product.isActive === true);
        const shuffled = activeProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 12);

        setProducts(randomProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderProductCard = (product) => (
    <div key={product._id} className="col-xxl-2 col-lg-3 col-sm-4 col-6">
      <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
        {product.discount && (
          <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
            Sale {product.discount}%
          </span>
        )}
        <Link
          to={`/product-details/${product._id}`}
          className="product-card__thumb flex-center"
        >
          <img src={product.images?.[0] || 'assets/images/thumbs/product-img1.png'} alt={product.name} />
        </Link>
        <div className="product-card__content p-sm-2">
          <h6 className="title text-lg fw-semibold mt-12 mb-8">
            <Link to={`/product-details/${product._id}`} className="link text-line-2">
              {product.name}
            </Link>
          </h6>
          <div className="flex-align gap-4">
            <span className="text-main-600 text-md d-flex">
              <i className="ph-fill ph-storefront" />
            </span>
            <span className="text-gray-500 text-xs">By RigitX</span>
          </div>
          <div className="product-card__content mt-12">
            <div className="product-card__price mb-8">
              <span className="text-heading text-md fw-semibold">
                ${product.price.toFixed(2)}{' '}
                <span className="text-gray-500 fw-normal">/Unit</span>
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex-align gap-6">
              <span className="text-xs fw-bold text-gray-600">{product.rating || 4.8}</span>
              <span className="text-15 fw-bold text-warning-600 d-flex">
                <i className="ph-fill ph-star" />
              </span>
              <span className="text-xs fw-bold text-gray-600">({product.reviews || '17k'})</span>
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
    </div>
  );

  return (
    <section className="recommended">
      <div className="container container-lg">
        <div className="section-heading">
          <h5 className="mb-0">Recommended for You</h5>
        </div>
        <div className="row g-12">
          {products.length === 0 ? (
            <div>No active products found</div>
          ) : (
            products.map((product) => renderProductCard(product))
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendedOne;