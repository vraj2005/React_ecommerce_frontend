import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const RecommendedOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const productData = response.data.products || response.data || [];
        
        // Get random selection of products for recommendations
        const activeProducts = productData.filter(p => p.isActive);
        const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
        
        setProducts(shuffled.slice(0, 16));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) {
      navigate('/account');
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    } catch (err) {
      console.error('Add to Cart Error:', err);
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, products.length));
  };

  if (loading || products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="recommended-section py-60">
      <div className="container container-lg">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <h2 className="section-title">
              <i className="ph ph-sparkle"></i>
              Recommended For You
            </h2>
            <p className="section-desc">Handpicked products based on trending items</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {visibleProducts.map(product => (
            <div key={product._id} className="product-card">
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="sale-tag">
                  SALE
                </span>
              )}
              
              <div className="card-image">
                <Link to={`/product-details/${product._id}`}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                </Link>
                <div className="quick-actions">
                  <button 
                    className="action-btn cart-action"
                    onClick={() => handleAddToCart(product._id)}
                    title="Add to Cart"
                  >
                    <i className="ph ph-shopping-cart"></i>
                  </button>
                  <Link 
                    to={`/product-details/${product._id}`} 
                    className="action-btn view-action"
                    title="View Details"
                  >
                    <i className="ph ph-eye"></i>
                  </Link>
                </div>
              </div>
              
              <div className="card-content">
                <div className="card-meta">
                  <span className="product-category">{product.category?.name || 'Gaming'}</span>
                  <div className="product-rating">
                    <i className="ph-fill ph-star"></i>
                    <span>{product.rating || '4.5'}</span>
                  </div>
                </div>
                
                <h3 className="product-name">
                  <Link to={`/product-details/${product._id}`}>{product.name}</Link>
                </h3>
                
                <div className="card-footer">
                  <div className="product-price">
                    {product.discountPrice && product.discountPrice < product.price ? (
                      <>
                        <span className="current-price">${product.discountPrice.toFixed(2)}</span>
                        <span className="original-price">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="current-price">${product.price?.toFixed(2)}</span>
                    )}
                  </div>
                  <button 
                    className="add-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <i className="ph ph-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < products.length && (
          <div className="load-more-wrapper">
            <button className="load-more-btn" onClick={loadMore}>
              Load More Products
              <i className="ph ph-arrow-down"></i>
            </button>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .recommended-section {
          background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .section-title i {
          color: #FF6B00;
        }

        .section-desc {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1199px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 991px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 575px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: all 0.3s;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }

        .sale-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: linear-gradient(135deg, #ef4444, #f87171);
          color: #fff;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          z-index: 10;
        }

        .card-image {
          position: relative;
          background: #f8f9fa;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          overflow: hidden;
        }

        .card-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.4s;
        }

        .product-card:hover .card-image img {
          transform: scale(1.1);
        }

        .quick-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.3s;
        }

        .product-card:hover .quick-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .action-btn {
          width: 40px;
          height: 40px;
          background: #fff;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1a1a2e;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s;
          text-decoration: none;
        }

        .action-btn:hover {
          background: #FF6B00;
          color: #fff;
          transform: scale(1.1);
        }

        .card-content {
          padding: 20px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .product-category {
          color: #FF6B00;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .product-rating i {
          color: #ffc107;
          font-size: 14px;
        }

        .product-rating span {
          color: #666;
          font-size: 13px;
          font-weight: 600;
        }

        .product-name {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 14px;
          line-height: 1.4;
        }

        .product-name a {
          color: #1a1a2e;
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s;
        }

        .product-name a:hover {
          color: #FF6B00;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-price {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .add-btn {
          width: 40px;
          height: 40px;
          background: #f0f0f0;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1a1a2e;
          font-size: 20px;
          transition: all 0.3s;
        }

        .add-btn:hover {
          background: #FF6B00;
          color: #fff;
        }

        .load-more-wrapper {
          text-align: center;
          margin-top: 48px;
        }

        .load-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: #fff;
          color: #1a1a2e;
          border: 2px solid #1a1a2e;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .load-more-btn:hover {
          background: #1a1a2e;
          color: #fff;
        }

        .load-more-btn i {
          font-size: 18px;
          transition: transform 0.3s;
        }

        .load-more-btn:hover i {
          transform: translateY(4px);
        }
      `}</style>
    </section>
  );
};

export default RecommendedOne;
