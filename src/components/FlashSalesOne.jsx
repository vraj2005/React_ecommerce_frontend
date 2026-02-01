import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const FlashSalesOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Countdown Timer - Set end date 7 days from now
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch flash sale products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const productData = response.data.products || response.data || [];
        
        // Get products with discounts
        const flashSales = productData
          .filter(p => p.isActive && p.discountPrice && p.discountPrice < p.price)
          .map(p => ({
            ...p,
            discount: Math.round(((p.price - p.discountPrice) / p.price) * 100)
          }))
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 4);

        setProducts(flashSales);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flash sales:', err);
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
    <section className="flash-sales-section py-60">
      <div className="container container-lg">
        <div className="flash-sales-wrapper">
          {/* Header */}
          <div className="flash-header">
            <div className="header-left">
              <div className="flash-icon">
                <i className="ph ph-lightning"></i>
              </div>
              <div className="header-text">
                <span className="flash-label">Flash Sale</span>
                <h2 className="flash-title">Deals of the Day</h2>
              </div>
            </div>
            
            <div className="header-right">
              <div className="countdown">
                <span className="countdown-label">Ends in:</span>
                <div className="countdown-timer">
                  <div className="time-box">
                    <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="time-label">Days</span>
                  </div>
                  <span className="separator">:</span>
                  <div className="time-box">
                    <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="time-label">Hours</span>
                  </div>
                  <span className="separator">:</span>
                  <div className="time-box">
                    <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="time-label">Mins</span>
                  </div>
                  <span className="separator">:</span>
                  <div className="time-box">
                    <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="time-label">Secs</span>
                  </div>
                </div>
              </div>
              <Link to="/shop" className="view-all-link">
                View All <i className="ph ph-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="flash-products">
            {products.map(product => (
              <div key={product._id} className="flash-product-card">
                <div className="discount-tag">-{product.discount}%</div>
                
                <div className="product-image">
                  <Link to={`/product-details/${product._id}`}>
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                    />
                  </Link>
                </div>
                
                <div className="product-details">
                  <h3 className="product-name">
                    <Link to={`/product-details/${product._id}`}>{product.name}</Link>
                  </h3>
                  
                  <div className="product-price">
                    <span className="sale-price">${product.discountPrice?.toFixed(2)}</span>
                    <span className="original-price">${product.price?.toFixed(2)}</span>
                  </div>
                  
                  <div className="stock-info">
                    <div className="stock-bar">
                      <div 
                        className="stock-progress" 
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="stock-text">
                      {product.stock > 0 ? `Only ${product.stock} left!` : 'Sold out'}
                    </span>
                  </div>
                  
                  <button 
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    <i className="ph ph-shopping-cart"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .flash-sales-section {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .flash-sales-wrapper {
          padding: 40px;
          border-radius: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .flash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .flash-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #FF6B00, #ff9a5a);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flash-icon i {
          font-size: 28px;
          color: #fff;
        }

        .flash-label {
          display: block;
          color: #FF6B00;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .flash-title {
          color: #fff;
          font-size: 28px;
          font-weight: 800;
          margin: 4px 0 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .countdown {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .countdown-label {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
        }

        .countdown-timer {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .time-box {
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          min-width: 50px;
        }

        .time-value {
          display: block;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .time-label {
          display: block;
          color: rgba(255,255,255,0.5);
          font-size: 10px;
          text-transform: uppercase;
        }

        .separator {
          color: #FF6B00;
          font-size: 20px;
          font-weight: 700;
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
          color: #ff9a5a;
        }

        .flash-products {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1199px) {
          .flash-products {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .flash-products {
            grid-template-columns: 1fr;
          }
          
          .flash-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-right {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .flash-sales-wrapper {
            padding: 24px;
          }
        }

        .flash-product-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          transition: transform 0.3s;
        }

        .flash-product-card:hover {
          transform: translateY(-5px);
        }

        .discount-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #FF6B00;
          color: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          z-index: 10;
        }

        .product-image {
          background: #f8f9fa;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .product-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s;
        }

        .flash-product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-details {
          padding: 20px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
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

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .sale-price {
          font-size: 22px;
          font-weight: 700;
          color: #FF6B00;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .stock-info {
          margin-bottom: 16px;
        }

        .stock-bar {
          height: 6px;
          background: #eee;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .stock-progress {
          height: 100%;
          background: linear-gradient(90deg, #FF6B00, #ff9a5a);
          border-radius: 3px;
          transition: width 0.3s;
        }

        .stock-text {
          font-size: 12px;
          color: #e53935;
          font-weight: 600;
        }

        .add-cart-btn {
          width: 100%;
          padding: 12px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .add-cart-btn:hover:not(:disabled) {
          background: #FF6B00;
        }

        .add-cart-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default FlashSalesOne;
