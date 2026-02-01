import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const BestSellsOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const productData = response.data.products || response.data || [];
        
        // Get best selling products (highest rated or most sold)
        const bestSellers = productData
          .filter(p => p.isActive)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);

        setProducts(bestSellers);
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

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="best-sells-section py-60">
      <div className="container container-lg">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <span className="section-badge">
              <i className="ph ph-trophy"></i> Top Rated
            </span>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-desc">Most loved products by our customers</p>
          </div>
          <Link to="/shop" className="view-all-link">
            View All <i className="ph ph-arrow-right"></i>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="products-row">
          {products.map((product, index) => (
            <div key={product._id} className="product-card">
              <span className="rank-badge">#{index + 1}</span>
              
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="discount-badge">
                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              )}
              
              <div className="card-image">
                <Link to={`/product-details/${product._id}`}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                </Link>
                <div className="card-overlay">
                  <button 
                    className="cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <i className="ph ph-shopping-cart"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
              
              <div className="card-content">
                <div className="rating-row">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`ph-fill ph-star ${i < Math.floor(product.rating || 4.5) ? 'filled' : ''}`}
                      ></i>
                    ))}
                  </div>
                  <span className="rating-value">{product.rating || '4.8'}</span>
                  <span className="reviews">({product.numReviews || '2.3k'} reviews)</span>
                </div>
                
                <h3 className="product-name">
                  <Link to={`/product-details/${product._id}`}>{product.name}</Link>
                </h3>
                
                <div className="price-row">
                  {product.discountPrice && product.discountPrice < product.price ? (
                    <>
                      <span className="sale-price">${product.discountPrice.toFixed(2)}</span>
                      <span className="original-price">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="sale-price">${product.price?.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .best-sells-section {
          background: #fff;
        }

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff7ed;
          color: #FF6B00;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .section-badge i {
          font-size: 16px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0 0 8px;
        }

        .section-desc {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #FF6B00;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .view-all-link:hover {
          gap: 12px;
        }

        .products-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }

        @media (max-width: 1399px) {
          .products-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 991px) {
          .products-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 575px) {
          .products-row {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .product-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 1px solid #eee;
          transition: all 0.3s;
        }

        .product-card:hover {
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border-color: #FF6B00;
        }

        .rank-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #1a1a2e;
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          z-index: 10;
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ef4444;
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          z-index: 10;
        }

        .card-image {
          position: relative;
          background: #f8f9fa;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 160px;
          overflow: hidden;
        }

        .card-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.4s;
        }

        .product-card:hover .card-image img {
          transform: scale(1.08);
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.6));
          transform: translateY(100%);
          transition: transform 0.3s;
        }

        .product-card:hover .card-overlay {
          transform: translateY(0);
        }

        .cart-btn {
          width: 100%;
          padding: 10px;
          background: #FF6B00;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.3s;
        }

        .cart-btn:hover {
          background: #e55d00;
        }

        .card-content {
          padding: 16px;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars i {
          font-size: 12px;
          color: #ddd;
        }

        .stars i.filled {
          color: #ffc107;
        }

        .rating-value {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .reviews {
          font-size: 12px;
          color: #999;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 10px;
          line-height: 1.4;
        }

        .product-name a {
          color: #1a1a2e;
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-name a:hover {
          color: #FF6B00;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sale-price {
          font-size: 18px;
          font-weight: 700;
          color: #FF6B00;
        }

        .original-price {
          font-size: 13px;
          color: #999;
          text-decoration: line-through;
        }
      `}</style>
    </section>
  );
};

export default BestSellsOne;
