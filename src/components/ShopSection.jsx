import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch products and categories
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
        
        // Check URL params for category filter
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
        
        const searchParam = searchParams.get('search');
        if (searchParam) {
          setSearchQuery(searchParam);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = (product.discountPrice || product.price) >= priceRange[0] && 
                          (product.discountPrice || product.price) <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-high':
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

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
      <section className="shop-section py-60">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
        <style jsx="true">{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f0f0f0;
            border-top-color: #FF6B00;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="shop-section py-60">
      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <aside className={`shop-sidebar ${sidebarOpen ? 'active' : ''}`}>
              <button className="sidebar-close d-lg-none" onClick={() => setSidebarOpen(false)}>
                <i className="ph ph-x"></i>
              </button>

              {/* Search */}
              <div className="sidebar-widget">
                <h4 className="widget-title">Search</h4>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <i className="ph ph-magnifying-glass"></i>
                </div>
              </div>

              {/* Categories */}
              <div className="sidebar-widget">
                <h4 className="widget-title">Categories</h4>
                <ul className="category-list">
                  <li>
                    <button
                      className={selectedCategory === 'all' ? 'active' : ''}
                      onClick={() => setSelectedCategory('all')}
                    >
                      <i className="ph ph-squares-four"></i>
                      All Products
                      <span>{products.length}</span>
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <button
                        className={selectedCategory === cat._id ? 'active' : ''}
                        onClick={() => setSelectedCategory(cat._id)}
                      >
                        <i className="ph ph-tag"></i>
                        {cat.name}
                        <span>{products.filter(p => p.category === cat._id).length}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="sidebar-widget">
                <h4 className="widget-title">Price Range</h4>
                <div className="price-inputs">
                  <div className="price-field">
                    <label>Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                  </div>
                  <span className="separator">-</span>
                  <div className="price-field">
                    <label>Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="price-slider"
                />
              </div>

              {/* Clear Filters */}
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 10000]);
                  setSearchQuery('');
                  setSortBy('newest');
                }}
              >
                <i className="ph ph-x-circle"></i>
                Clear All Filters
              </button>
            </aside>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <div className="toolbar-left">
                <button className="filter-toggle d-lg-none" onClick={() => setSidebarOpen(true)}>
                  <i className="ph ph-funnel"></i>
                  Filters
                </button>
                <p className="results-count">
                  Showing <strong>{filteredProducts.length}</strong> products
                </p>
              </div>
              <div className="toolbar-right">
                <div className="sort-select">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                </div>
                <div className="view-toggle">
                  <button
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="ph ph-squares-four"></i>
                  </button>
                  <button
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="ph ph-list"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <i className="ph ph-package"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 10000]);
                  setSearchQuery('');
                }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`products-grid ${viewMode}`}>
                {filteredProducts.map(product => (
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
                      <div className="product-category">{product.brand || 'Brand'}</div>
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
                      
                      <div className="product-stock">
                        <div className="stock-bar">
                          <div
                            className="stock-fill"
                            style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                      </div>
                      
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                      >
                        <i className="ph ph-shopping-cart"></i>
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .shop-section {
          background: #f8f9fa;
          min-height: 100vh;
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Sidebar */
        .shop-sidebar {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          position: sticky;
          top: 100px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        @media (max-width: 991px) {
          .shop-sidebar {
            position: fixed;
            top: 0;
            left: -320px;
            width: 300px;
            height: 100vh;
            z-index: 1000;
            border-radius: 0;
            overflow-y: auto;
            transition: left 0.3s ease;
          }

          .shop-sidebar.active {
            left: 0;
          }
        }

        .sidebar-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border: none;
          background: #f0f0f0;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-widget {
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid #eee;
        }

        .sidebar-widget:last-of-type {
          border-bottom: none;
        }

        .widget-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 16px;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s;
        }

        .search-box input:focus {
          border-color: #FF6B00;
        }

        .search-box i {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-list li {
          margin-bottom: 8px;
        }

        .category-list button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-list button:hover,
        .category-list button.active {
          background: #FF6B00;
          color: #fff;
        }

        .category-list button span {
          margin-left: auto;
          font-size: 12px;
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .category-list button.active span,
        .category-list button:hover span {
          background: rgba(255,255,255,0.2);
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .price-field {
          flex: 1;
        }

        .price-field label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .price-field input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
        }

        .separator {
          color: #999;
          margin-top: 16px;
        }

        .price-slider {
          width: 100%;
          accent-color: #FF6B00;
        }

        .clear-filters-btn {
          width: 100%;
          padding: 12px;
          border: 1px dashed #ddd;
          background: transparent;
          border-radius: 8px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .clear-filters-btn:hover {
          border-color: #FF6B00;
          color: #FF6B00;
        }

        /* Toolbar */
        .shop-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: #fff;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          flex-wrap: wrap;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid #e0e0e0;
          background: #fff;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-toggle:hover {
          border-color: #FF6B00;
          color: #FF6B00;
        }

        .results-count {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sort-select select {
          padding: 10px 40px 10px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 14px center;
          appearance: none;
        }

        .view-toggle {
          display: flex;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }

        .view-toggle button {
          width: 40px;
          height: 40px;
          border: none;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .view-toggle button:first-child {
          border-right: 1px solid #e0e0e0;
        }

        .view-toggle button.active,
        .view-toggle button:hover {
          background: #FF6B00;
          color: #fff;
        }

        /* No Products */
        .no-products {
          text-align: center;
          padding: 80px 20px;
          background: #fff;
          border-radius: 16px;
        }

        .no-products i {
          font-size: 64px;
          color: #ddd;
          margin-bottom: 16px;
        }

        .no-products h3 {
          font-size: 20px;
          color: #333;
          margin-bottom: 8px;
        }

        .no-products p {
          color: #666;
          margin-bottom: 20px;
        }

        .no-products button {
          padding: 12px 24px;
          background: #FF6B00;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .products-grid.list {
          grid-template-columns: 1fr;
        }

        .products-grid.list .product-card {
          display: flex;
          flex-direction: row;
        }

        .products-grid.list .product-image {
          width: 200px;
          flex-shrink: 0;
        }

        .products-grid.list .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1199px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 575px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Product Card */
        .product-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
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
          height: 220px;
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

        .product-category {
          font-size: 12px;
          color: #FF6B00;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
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
          gap: 4px;
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
          margin-left: 4px;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
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

        .product-stock {
          margin-bottom: 16px;
        }

        .stock-bar {
          height: 4px;
          background: #eee;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .stock-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF6B00, #ff9a5a);
          border-radius: 2px;
        }

        .product-stock span {
          font-size: 12px;
          color: #666;
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

        .add-to-cart-btn:hover:not(:disabled) {
          background: #FF6B00;
        }

        .add-to-cart-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default ShopSection;
