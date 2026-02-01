import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const ProductListOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        const productData = productsRes.data.products || productsRes.data || [];
        const activeProducts = productData.filter(p => p.isActive);
        setProducts(activeProducts);
        
        const categoryData = categoriesRes.data.categories || categoriesRes.data || [];
        setCategories(categoryData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    fetchData();
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

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <section className="products-section py-60">
        <div className="container">
          <div className="text-center py-60">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section py-60" id="products-section">
      <div className="container container-lg">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-left">
            <span className="subtitle">Our Products</span>
            <h2 className="title">Featured Products</h2>
          </div>
          <div className="header-right">
            <div className="category-tabs">
              <button
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat._id}
                  className={activeCategory === cat._id ? 'active' : ''}
                  onClick={() => setActiveCategory(cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.slice(0, 8).map(product => (
            <div key={product._id} className="product-card">
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="discount-badge">
                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              )}
              
              <div className="product-image">
                <Link to={`/product-details/${product._id}`}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                  />
                </Link>
                <div className="product-actions">
                  <button onClick={() => handleAddToCart(product._id)} title="Add to Cart">
                    <i className="ph ph-shopping-cart"></i>
                  </button>
                  <Link to={`/product-details/${product._id}`} title="View Details">
                    <i className="ph ph-eye"></i>
                  </Link>
                </div>
              </div>
              
              <div className="product-info">
                <span className="product-brand">{product.brand || 'Brand'}</span>
                <h3 className="product-name">
                  <Link to={`/product-details/${product._id}`}>{product.name}</Link>
                </h3>
                
                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`ph-fill ph-star ${i < Math.floor(product.ratings?.average || 4) ? 'filled' : ''}`}
                    ></i>
                  ))}
                  <span>({product.ratings?.totalReviews || 0})</span>
                </div>
                
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
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  <i className="ph ph-shopping-cart"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="view-all-wrapper">
          <Link to="/shop" className="view-all-btn">
            View All Products
            <i className="ph ph-arrow-right"></i>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .products-section {
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

        .subtitle {
          display: inline-block;
          color: #FF6B00;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0;
        }

        .category-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .category-tabs button {
          padding: 10px 20px;
          border: 1px solid #e0e0e0;
          background: #fff;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-tabs button:hover,
        .category-tabs button.active {
          background: #FF6B00;
          border-color: #FF6B00;
          color: #fff;
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
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 575px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          
          .title {
            font-size: 24px;
          }
        }

        .product-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
          border-color: transparent;
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #FF6B00;
          color: #fff;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 10;
        }

        .product-image {
          position: relative;
          padding: 20px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          overflow: hidden;
        }

        .product-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-actions {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: all 0.3s;
        }

        .product-card:hover .product-actions {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .product-actions button,
        .product-actions a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #fff;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }

        .product-actions button:hover,
        .product-actions a:hover {
          background: #FF6B00;
          color: #fff;
        }

        .product-info {
          padding: 20px;
        }

        .product-brand {
          font-size: 12px;
          color: #FF6B00;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          margin: 8px 0 10px;
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

        .product-rating {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-bottom: 12px;
        }

        .product-rating i {
          font-size: 14px;
          color: #ddd;
        }

        .product-rating i.filled {
          color: #ffc107;
        }

        .product-rating span {
          font-size: 12px;
          color: #999;
          margin-left: 6px;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .current-price {
          font-size: 20px;
          font-weight: 700;
          color: #FF6B00;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .add-to-cart-btn {
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

        .add-to-cart-btn:hover {
          background: #FF6B00;
        }

        .view-all-wrapper {
          text-align: center;
          margin-top: 48px;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: transparent;
          color: #1a1a2e;
          border: 2px solid #1a1a2e;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .view-all-btn:hover {
          background: #FF6B00;
          border-color: #FF6B00;
          color: #fff;
        }
      `}</style>
    </section>
  );
};

export default ProductListOne;
