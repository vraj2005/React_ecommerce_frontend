import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';

const HeaderOne = ({ searchQuery = '', setSearchQuery = () => {}, products = [] }) => {
  const [scroll, setScroll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userCountry, setUserCountry] = useState('Select Location');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { items, status } = useSelector((state) => state.cart);
  const cartCount = items.length;

  // Fetch categories and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await axios.get('http://localhost:5000/api/categories');
        setCategories(catResponse.data.categories || catResponse.data);

        if (token) {
          const userResponse = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserCountry(userResponse.data.address?.country || 'Unknown');
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
    const handleScroll = () => setScroll(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search filtering
  useEffect(() => {
    // Safely check if searchQuery exists and is a string
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredResults = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, products]);

  // Event handlers
  const handleMenuToggle = () => setMenuActive(prev => !prev);

  const handleCartClick = () => {
    navigate(isLoggedIn ? '/cart' : '/account');
  };

  const handleOrdersClick = () => {
    navigate(isLoggedIn ? '/orders' : '/account');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      setIsSearchActive(false);
      // Optionally navigate to a search results page
      // navigate(`/shop?search=${searchQuery}`);
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
      <div 
        className={`overlay ${menuActive ? 'show' : ''}`} 
        onClick={() => setMenuActive(false)} 
      />
      <div className={`side-overlay ${menuActive ? 'show' : ''}`} />

      {/* Mobile Menu */}
      <div className={`mobile-menu scroll-sm d-lg-none ${menuActive ? 'active' : ''}`}>
        <button
          onClick={handleMenuToggle}
          className="close-button text-2xl text-gray-800 p-10"
        >
          <i className="ph ph-x" />
        </button>
        <div className="mobile-menu__inner">
          <ul className="nav-menu flex-align flex-column gap-16">
            <li className="nav-menu__item">
              <form onSubmit={handleSearchSubmit} className="w-100">
                <div className="search-form__wrapper position-relative w-100">
                  <input
                    type="text"
                    className="search-form__input common-input py-13 ps-16 pe-44 rounded-pill w-100"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-32 h-32 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y end-0 me-8"
                  >
                    <i className="ph ph-magnifying-glass" />
                  </button>
                </div>
              </form>
            </li>
            <li className="nav-menu__item">
              <Link to="/" className="nav-menu__link" onClick={() => setMenuActive(false)}>
                Home
              </Link>
            </li>
            <li className="nav-menu__item">
              <div className="nav-menu__link d-flex align-items-center gap-8">
                <i className="ph ph-map-pin text-2xl text-gray-700" />
                <span>{loading ? 'Loading...' : userCountry}</span>
              </div>
            </li>
            <li className="nav-menu__item">
              <button
                onClick={handleCartClick}
                className="nav-menu__link d-flex align-items-center gap-8"
              >
                <span className="text-2xl text-gray-700 position-relative">
                  <i className="ph ph-shopping-cart-simple" />
                  <span className="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">
                    {isLoggedIn ? cartCount : 0}
                  </span>
                </span>
                <span>Cart ({isLoggedIn ? cartCount : 0})</span>
              </button>
            </li>
            <li className="nav-menu__item">
              <button
                onClick={handleOrdersClick}
                className="nav-menu__link d-flex align-items-center gap-8"
              >
                <i className="ph ph-receipt text-2xl text-gray-700" />
                <span>Orders</span>
              </button>
            </li>
            <li className="nav-menu__item">
              <Link
                to="/account"
                className="nav-menu__link d-flex align-items-center gap-8"
                onClick={() => setMenuActive(false)}
              >
                <i className="ph ph-user-circle text-2xl text-gray-700" />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header bg-white border-bottom border-gray-100 ${scroll ? 'fixed-header' : ''}`}>
        <div className="container container-lg">
          <nav className="header-inner d-flex align-items-center justify-content-between gap-8">
            <div className="menu-category-wrapper d-flex align-items-center flex-grow-1">
              <ul className="nav-menu flex-align gap-16">
                <li className="nav-menu__item">
                  <NavLink
                    to="/"
                    className={({ isActive }) => 
                      `nav-menu__link ${isActive ? 'activePage' : ''}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
              </ul>
              
              {/* Search Bar */}
              <div className="nav-menu__item flex-grow-1 ml-4 position-relative" style={{ maxWidth: '400px' }}>
                <form onSubmit={handleSearchSubmit} className="w-100">
                  <div className="search-form__wrapper position-relative w-100">
                    <input
                      type="text"
                      className="search-form__input common-input py-13 ps-16 pe-44 rounded-pill w-100"
                      placeholder="Search for a product or brand"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchActive(true)}
                      onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                    />
                    <button
                      type="submit"
                      className="w-32 h-32 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y end-0 me-8"
                    >
                      <i className="ph ph-magnifying-glass" />
                    </button>
                  </div>
                </form>
                
                {/* Search Results Dropdown */}
                {isSearchActive && searchResults.length > 0 && (
                  <div
                    className="search-results position-absolute bg-white border border-gray-100 rounded-8 shadow-sm w-100 mt-2 p-2"
                    style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}
                  >
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="d-flex align-items-center gap-12 py-2 px-4 hover-bg-gray-100 cursor-pointer"
                        onClick={() => handleSearchResultClick(product._id)}
                      >
                        <img
                          src={product.images?.[0] || '/default-product.jpg'}
                          alt={product.name}
                          className="w-40 h-40 object-cover rounded-4"
                        />
                        <div>
                          <div className="text-gray-700">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            ${product.discountPrice || product.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Navigation */}
            <div className="d-flex align-items-center gap-16 flex-shrink-0">
              <div className="nav-menu__link d-flex align-items-center gap-8 hover-text-main-600">
                <i className="ph ph-map-pin text-2xl text-gray-700" />
                <span>{loading ? 'Loading...' : userCountry}</span>
              </div>
              
              <button
                onClick={handleCartClick}
                className="nav-menu__link d-flex align-items-center gap-8 hover-text-main-600"
                disabled={status === 'loading'}
              >
                <span className="text-2xl text-gray-700 position-relative">
                  <i className="ph ph-shopping-cart-simple" />
                  <span className="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">
                    {isLoggedIn ? cartCount : 0}
                  </span>
                </span>
                <span>Cart</span>
              </button>
              
              <button
                onClick={handleOrdersClick}
                className="nav-menu__link d-flex align-items-center gap-8 hover-text-main-600"
              >
                <i className="ph ph-receipt text-2xl text-gray-700" />
                <span>Orders</span>
              </button>
              
              <Link
                to="/account"
                className="nav-menu__link d-flex align-items-center gap-8 hover-text-main-600"
              >
                <i className="ph ph-user-circle text-2xl text-gray-700" />
                <span>Profile</span>
              </Link>
              
              <button
                onClick={handleMenuToggle}
                className="toggle-mobileMenu d-lg-none text-gray-800 text-4xl"
              >
                <i className="ph ph-list" />
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;