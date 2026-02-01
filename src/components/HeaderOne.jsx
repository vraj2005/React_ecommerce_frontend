import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';

const HeaderOne = ({ searchQuery = '', setSearchQuery = () => {}, products = [] }) => {
  const [scroll, setScroll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { items } = useSelector((state) => state.cart);
  const cartCount = items.length;

  // Fetch categories and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await axios.get('http://localhost:5000/api/categories');
        setCategories(catResponse.data.categories || catResponse.data);

        if (token) {
          dispatch(fetchCart());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setIsLoggedIn(!!token);
  }, [token, dispatch]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search filtering
  useEffect(() => {
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredResults = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults.slice(0, 8));
  }, [searchQuery, products]);

  const handleMenuToggle = () => setMenuActive(prev => !prev);

  const handleCartClick = () => {
    navigate(isLoggedIn ? '/cart' : '/account');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      setIsSearchActive(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchResultClick = (productId) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchActive(false);
    navigate(`/product-details/${productId}`);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div className={`side-overlay ${menuActive ? 'show' : ''}`} onClick={() => setMenuActive(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-menu scroll-sm d-lg-none ${menuActive ? 'active' : ''}`}>
        <button onClick={handleMenuToggle} className="close-button">
          <i className="ph ph-x" />
        </button>
        <div className="mobile-menu__inner">
          {/* Mobile Logo */}
          <Link to="/" className="mobile-logo mb-24" onClick={() => setMenuActive(false)}>
            <span className="logo-text">
              <span style={{ color: '#FF6B00', fontWeight: '800' }}>RIGI</span>
              <span style={{ color: '#1a1a2e', fontWeight: '800' }}>TX</span>
            </span>
          </Link>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mobile-search mb-24">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="ph ph-magnifying-glass" />
              </button>
            </div>
          </form>

          {/* Mobile Nav */}
          <ul className="mobile-nav">
            <li>
              <Link to="/" onClick={() => setMenuActive(false)}>
                <i className="ph ph-house me-12"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/shop" onClick={() => setMenuActive(false)}>
                <i className="ph ph-squares-four me-12"></i> Shop
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setMenuActive(false)}>
                <i className="ph ph-shopping-cart me-12"></i> Cart ({cartCount})
              </Link>
            </li>
            <li>
              <Link to="/orders" onClick={() => setMenuActive(false)}>
                <i className="ph ph-package me-12"></i> Orders
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuActive(false)}>
                <i className="ph ph-envelope me-12"></i> Contact
              </Link>
            </li>
            <li>
              <Link to="/account" onClick={() => setMenuActive(false)}>
                <i className="ph ph-user me-12"></i> Account
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header-main ${scroll ? 'header-fixed' : ''}`}>
        <div className="container container-lg">
          <nav className="header-nav">
            {/* Logo */}
            <Link to="/" className="header-logo">
              <span className="logo-text">
                <span style={{ color: '#FF6B00', fontWeight: '800', fontSize: '28px' }}>RIGI</span>
                <span style={{ color: '#1a1a2e', fontWeight: '800', fontSize: '28px' }}>TX</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="header-search d-none d-lg-block">
              <form onSubmit={handleSearchSubmit}>
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                  />
                  <button type="submit">
                    <i className="ph ph-magnifying-glass" />
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {isSearchActive && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="search-item"
                      onClick={() => handleSearchResultClick(product._id)}
                    >
                      <img
                        src={product.images?.[0] || '/default-product.jpg'}
                        alt={product.name}
                      />
                      <div className="search-item-info">
                        <span className="search-item-name">{product.name}</span>
                        <span className="search-item-price">
                          ${product.discountPrice || product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <ul className="header-menu d-none d-lg-flex">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                  Home
                </NavLink>
              </li>
              <li className="has-dropdown">
                <button 
                  className="dropdown-toggle"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  Categories <i className="ph ph-caret-down ms-4" />
                </button>
                <ul 
                  className={`dropdown-menu ${categoriesOpen ? 'show' : ''}`}
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat._id}>
                        <Link to={`/shop?category=${cat._id}`}>{cat.name}</Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><Link to="/shop?category=processors">Processors</Link></li>
                      <li><Link to="/shop?category=graphics-cards">Graphics Cards</Link></li>
                      <li><Link to="/shop?category=motherboards">Motherboards</Link></li>
                      <li><Link to="/shop?category=memory">Memory</Link></li>
                      <li><Link to="/shop?category=storage">Storage</Link></li>
                    </>
                  )}
                </ul>
              </li>
              <li className="has-dropdown">
                <button 
                  className="dropdown-toggle"
                  onClick={() => setPagesOpen(!pagesOpen)}
                  onMouseEnter={() => setPagesOpen(true)}
                  onMouseLeave={() => setPagesOpen(false)}
                >
                  Pages <i className="ph ph-caret-down ms-4" />
                </button>
                <ul 
                  className={`dropdown-menu ${pagesOpen ? 'show' : ''}`}
                  onMouseEnter={() => setPagesOpen(true)}
                  onMouseLeave={() => setPagesOpen(false)}
                >
                  <li><Link to="/shop">Shop</Link></li>
                  <li><Link to="/cart">Cart</Link></li>
                  <li><Link to="/orders">My Orders</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                </ul>
              </li>
            </ul>

            {/* Header Actions */}
            <div className="header-actions">
              <Link to="/account" className="action-btn wishlist-btn d-none d-md-flex">
                <i className="ph ph-heart" />
              </Link>

              <button onClick={handleCartClick} className="action-btn cart-btn">
                <i className="ph ph-shopping-cart" />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </button>

              <Link to="/account" className="action-btn account-btn">
                <i className="ph ph-user" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button onClick={handleMenuToggle} className="menu-toggle d-lg-none">
                <i className="ph ph-list" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Header Styles */}
      <style jsx="true">{`
        .header-main {
          background: #fff;
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .header-main.header-fixed {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .header-logo {
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'Poppins', sans-serif;
          letter-spacing: -1px;
        }

        /* Search Styles */
        .header-search {
          flex: 1;
          max-width: 450px;
          position: relative;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          transition: all 0.3s ease;
        }

        .search-wrapper:focus-within {
          border-color: #FF6B00;
          box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
        }

        .search-wrapper input {
          flex: 1;
          border: none;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          background: transparent;
        }

        .search-wrapper input::placeholder {
          color: #999;
        }

        .search-wrapper button {
          background: none;
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          color: #666;
          transition: color 0.3s;
        }

        .search-wrapper button:hover {
          color: #FF6B00;
        }

        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-top: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          max-height: 400px;
          overflow-y: auto;
          z-index: 100;
        }

        .search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f0f0f0;
        }

        .search-item:last-child {
          border-bottom: none;
        }

        .search-item:hover {
          background: #f8f8f8;
        }

        .search-item img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
        }

        .search-item-info {
          display: flex;
          flex-direction: column;
        }

        .search-item-name {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .search-item-price {
          font-size: 13px;
          color: #FF6B00;
          font-weight: 600;
        }

        /* Navigation Menu */
        .header-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header-menu > li > a,
        .header-menu > li > button {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          color: #333;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.3s;
          background: none;
          border: none;
          cursor: pointer;
        }

        .header-menu > li > a:hover,
        .header-menu > li > a.active,
        .header-menu > li > button:hover {
          color: #FF6B00;
        }

        .has-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          padding: 8px 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
          list-style: none;
          z-index: 100;
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-menu li a {
          display: block;
          padding: 10px 20px;
          color: #333;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
        }

        .dropdown-menu li a:hover {
          background: #f8f8f8;
          color: #FF6B00;
          padding-left: 24px;
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: none;
          background: #f5f5f5;
          color: #333;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          position: relative;
        }

        .action-btn:hover {
          background: #FF6B00;
          color: #fff;
        }

        .action-btn i {
          font-size: 20px;
        }

        .cart-count {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          background: #FF6B00;
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-toggle {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #f5f5f5;
          border-radius: 8px;
          cursor: pointer;
        }

        .menu-toggle i {
          font-size: 24px;
        }

        /* Mobile Menu Styles */
        .side-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 1100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
        }

        .side-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: -300px;
          width: 300px;
          height: 100%;
          background: #fff;
          z-index: 1200;
          transition: left 0.3s ease;
          overflow-y: auto;
          padding: 24px;
        }

        .mobile-menu.active {
          left: 0;
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button i {
          font-size: 20px;
        }

        .mobile-logo {
          display: inline-block;
          text-decoration: none;
        }

        .mobile-search .position-relative {
          display: flex;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }

        .mobile-search input {
          flex: 1;
          border: none;
          padding: 12px 16px;
          outline: none;
        }

        .mobile-search .search-btn {
          background: #FF6B00;
          border: none;
          color: #fff;
          padding: 12px 16px;
          cursor: pointer;
        }

        .mobile-nav {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-nav li {
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-nav li a {
          display: flex;
          align-items: center;
          padding: 16px 0;
          color: #333;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.3s;
        }

        .mobile-nav li a:hover {
          color: #FF6B00;
        }

        @media (max-width: 991px) {
          .header-nav {
            gap: 16px;
          }

          .logo-text span {
            font-size: 24px !important;
          }
        }

        @media (max-width: 575px) {
          .header-main {
            padding: 12px 0;
          }

          .action-btn {
            width: 40px;
            height: 40px;
          }

          .action-btn i {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderOne;
