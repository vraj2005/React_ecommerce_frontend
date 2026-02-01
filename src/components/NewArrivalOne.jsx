import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const NewArrivalOne = () => {
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
        
        // Get newest products sorted by createdAt
        const newArrivals = productData
          .filter(p => p.isActive)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 8);

        setProducts(newArrivals);
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

  if (loading) {
    return (
      <section className="new-arrival-section py-60">
        <div className="container container-lg">
          <div className="loading-spinner">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="new-arrival-section py-60">
      <div className="container container-lg">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-left">
            <span className="section-badge">Just In</span>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Check out the latest products added to our store</p>
          </div>
          <Link to="/shop" className="view-all-btn">
            Shop All New <i className="ph ph-arrow-right"></i>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product._id} className={`product-card ${index === 0 ? 'featured' : ''}`}>
              {index === 0 && <span className="new-badge">NEW</span>}
              
              <div className="card-image">
                <Link to={`/product-details/${product._id}`}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                </Link>
                <div className="card-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleAddToCart(product._id)}
                    title="Add to Cart"
                  >
                    <i className="ph ph-shopping-cart"></i>
                  </button>
                  <Link 
                    to={`/product-details/${product._id}`} 
                    className="action-btn"
                    title="Quick View"
                  >
                    <i className="ph ph-eye"></i>
                  </Link>
                </div>
              </div>
              
              <div className="card-content">
                <span className="product-category">{product.category?.name || 'Uncategorized'}</span>
                <h3 className="product-name">
                  <Link to={`/product-details/${product._id}`}>{product.name}</Link>
                </h3>
                <div className="product-footer">
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
                  <div className="product-rating">
                    <i className="ph-fill ph-star"></i>
                    <span>{product.rating || '4.5'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .new-arrival-section {
          background: #f8f9fa;
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
          display: inline-block;
          background: linear-gradient(135deg, #FF6B00, #ff9a5a);
          color: #fff;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0 0 8px;
        }

        .section-subtitle {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1a1a2e;
          color: #fff;
          padding: 14px 28px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .view-all-btn:hover {
          background: #FF6B00;
          transform: translateY(-2px);
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
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .product-card.featured {
          grid-column: span 2;
          grid-row: span 2;
        }

        @media (max-width: 575px) {
          .product-card.featured {
            grid-column: span 1;
            grid-row: span 1;
          }
        }

        .new-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #10b981;
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          z-index: 10;
        }

        .card-image {
          position: relative;
          background: #f8f9fa;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .product-card.featured .card-image {
          height: 350px;
        }

        .product-card:not(.featured) .card-image {
          height: 200px;
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

        .card-actions {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          transition: all 0.3s;
        }

        .product-card:hover .card-actions {
          bottom: 20px;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          background: #fff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1a1a2e;
          font-size: 18px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          transition: all 0.3s;
          text-decoration: none;
        }

        .action-btn:hover {
          background: #FF6B00;
          color: #fff;
        }

        .card-content {
          padding: 20px;
        }

        .product-category {
          display: block;
          color: #FF6B00;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px;
          line-height: 1.4;
        }

        .product-card.featured .product-name {
          font-size: 20px;
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

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .current-price {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .product-card.featured .current-price {
          font-size: 22px;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ffc107;
          font-size: 14px;
        }

        .product-rating span {
          color: #666;
          font-weight: 600;
        }

        .loading-spinner {
          text-align: center;
          padding: 60px;
          color: #666;
          font-size: 18px;
        }
      `}</style>
    </section>
  );
};

export default NewArrivalOne;
