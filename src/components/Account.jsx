import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout } from '../redux/slices/authSlice';
import './Profile.css';

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    phone: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginPassVisible, setLoginPassVisible] = useState(false);
  const [regPassVisible, setRegPassVisible] = useState(false);

  // Clear local error when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleRegisterChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith('address.')) {
      const addressField = id.split('.')[1];
      setRegisterData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setRegisterData((prev) => ({ ...prev, [id]: value }));
    }
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(login({
        email: loginData.email,
        password: loginData.password,
      }));
      
      if (login.fulfilled.match(result)) {
        // Login successful, component will re-render with user data
        setLoginData({ email: '', password: '' });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(register(registerData));
      
      if (register.fulfilled.match(result)) {
        // Registration successful, component will re-render with user data
        setRegisterData({
          name: '',
          email: '',
          password: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
          },
          phone: '',
        });
      }
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  const toggleLoginPassVisibility = () => setLoginPassVisible((prev) => !prev);
  const toggleRegPassVisibility = () => setRegPassVisible((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // If user is logged in, show profile instead of login/register forms
  if (user) {
    return (
      <section className="profile-section py-80">
        <div className="container container-lg">
          {/* Profile Header */}
          <div className="row mb-40">
            <div className="col-12">
              <div className="profile-header bg-gradient-main rounded-24 px-40 py-48 position-relative overflow-hidden">
                <div className="profile-header-content position-relative z-1">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-24">
                    <div className="d-flex align-items-center gap-24">
                      <div className="profile-avatar">
                        <div className="avatar-circle bg-white d-flex align-items-center justify-content-center rounded-circle" 
                             style={{ width: '80px', height: '80px' }}>
                          <i className="ph ph-user text-4xl text-main-600"></i>
                        </div>
                      </div>
                      <div className="profile-info text-white">
                        <h2 className="text-2xl fw-bold mb-8 text-white">
                          Welcome back, {user.name || 'User'}!
                        </h2>
                        <p className="mb-0 opacity-90">
                          <i className="ph ph-envelope me-8"></i>
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="mb-0 opacity-90 mt-4">
                            <i className="ph ph-phone me-8"></i>
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="btn btn-white text-main-600 fw-semibold py-12 px-24 hover-bg-danger hover-text-white transition-3"
                    >
                      <i className="ph ph-sign-out me-8"></i>
                      Logout
                    </button>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="position-absolute top-0 end-0 opacity-10">
                  <i className="ph ph-user-circle" style={{ fontSize: '120px' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="row gy-24">
            {/* Personal Information Card */}
            <div className="col-lg-8">
              <div className="profile-card bg-white border-0 rounded-24 p-32 shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-32">
                  <div>
                    <h4 className="mb-8 fw-bold text-neutral-900">Personal Information</h4>
                    <p className="text-gray-500 mb-0">Manage your personal details and contact information</p>
                  </div>
                  <button className="btn btn-outline-main btn-sm py-8 px-16">
                    <i className="ph ph-pencil me-8"></i>
                    Edit
                  </button>
                </div>

                <div className="row gy-24">
                  <div className="col-md-6">
                    <div className="info-item p-20 bg-gray-50 rounded-12">
                      <div className="d-flex align-items-center gap-12 mb-12">
                        <i className="ph ph-user text-main-600 text-xl"></i>
                        <label className="text-sm fw-semibold text-gray-600 text-uppercase letter-spacing-1">Full Name</label>
                      </div>
                      <p className="text-lg fw-medium text-neutral-900 mb-0">{user.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="info-item p-20 bg-gray-50 rounded-12">
                      <div className="d-flex align-items-center gap-12 mb-12">
                        <i className="ph ph-envelope text-main-600 text-xl"></i>
                        <label className="text-sm fw-semibold text-gray-600 text-uppercase letter-spacing-1">Email Address</label>
                      </div>
                      <p className="text-lg fw-medium text-neutral-900 mb-0">{user.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="col-md-6">
                      <div className="info-item p-20 bg-gray-50 rounded-12">
                        <div className="d-flex align-items-center gap-12 mb-12">
                          <i className="ph ph-phone text-main-600 text-xl"></i>
                          <label className="text-sm fw-semibold text-gray-600 text-uppercase letter-spacing-1">Phone Number</label>
                        </div>
                        <p className="text-lg fw-medium text-neutral-900 mb-0">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="col-md-6">
                    <div className="info-item p-20 bg-gray-50 rounded-12">
                      <div className="d-flex align-items-center gap-12 mb-12">
                        <i className="ph ph-calendar text-main-600 text-xl"></i>
                        <label className="text-sm fw-semibold text-gray-600 text-uppercase letter-spacing-1">Member Since</label>
                      </div>
                      <p className="text-lg fw-medium text-neutral-900 mb-0">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {user.address && (Object.values(user.address).some(value => value)) && (
                  <div className="mt-40">
                    <div className="d-flex align-items-center justify-content-between mb-24">
                      <h5 className="fw-bold text-neutral-900 mb-0">
                        <i className="ph ph-map-pin text-main-600 me-12"></i>
                        Address Information
                      </h5>
                      <button className="btn btn-outline-main btn-sm py-8 px-16">
                        <i className="ph ph-pencil me-8"></i>
                        Edit Address
                      </button>
                    </div>

                    <div className="address-card p-24 bg-gradient-light rounded-16 border border-gray-100">
                      <div className="row gy-16">
                        {user.address.street && (
                          <div className="col-12">
                            <div className="d-flex align-items-start gap-12">
                              <i className="ph ph-road-horizon text-main-600 mt-4"></i>
                              <div>
                                <label className="text-sm fw-semibold text-gray-600 d-block">Street Address</label>
                                <p className="text-neutral-900 mb-0">{user.address.street}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="col-md-6">
                          {user.address.city && (
                            <div className="d-flex align-items-start gap-12">
                              <i className="ph ph-buildings text-main-600 mt-4"></i>
                              <div>
                                <label className="text-sm fw-semibold text-gray-600 d-block">City</label>
                                <p className="text-neutral-900 mb-0">{user.address.city}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          {user.address.state && (
                            <div className="d-flex align-items-start gap-12">
                              <i className="ph ph-map-trifold text-main-600 mt-4"></i>
                              <div>
                                <label className="text-sm fw-semibold text-gray-600 d-block">State</label>
                                <p className="text-neutral-900 mb-0">{user.address.state}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          {user.address.zip && (
                            <div className="d-flex align-items-start gap-12">
                              <i className="ph ph-hash text-main-600 mt-4"></i>
                              <div>
                                <label className="text-sm fw-semibold text-gray-600 d-block">ZIP Code</label>
                                <p className="text-neutral-900 mb-0">{user.address.zip}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          {user.address.country && (
                            <div className="d-flex align-items-start gap-12">
                              <i className="ph ph-globe text-main-600 mt-4"></i>
                              <div>
                                <label className="text-sm fw-semibold text-gray-600 d-block">Country</label>
                                <p className="text-neutral-900 mb-0">{user.address.country}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="col-lg-4">
              <div className="profile-sidebar">
                {/* Quick Actions Card */}
                <div className="profile-card bg-white border-0 rounded-24 p-32 shadow-sm mb-24">
                  <h5 className="fw-bold text-neutral-900 mb-24">
                    <i className="ph ph-lightning text-main-600 me-12"></i>
                    Quick Actions
                  </h5>

                  <div className="d-grid gap-16">
                    <Link 
                      to="/orders" 
                      className="btn btn-outline-main d-flex align-items-center justify-content-between py-16 px-20 text-start hover-bg-main hover-text-white transition-3"
                    >
                      <div className="d-flex align-items-center gap-12">
                        <i className="ph ph-package text-xl"></i>
                        <div>
                          <div className="fw-semibold">My Orders</div>
                          <small className="opacity-75">Track your purchases</small>
                        </div>
                      </div>
                      <i className="ph ph-arrow-right"></i>
                    </Link>

                    <Link 
                      to="/cart" 
                      className="btn btn-outline-main d-flex align-items-center justify-content-between py-16 px-20 text-start hover-bg-main hover-text-white transition-3"
                    >
                      <div className="d-flex align-items-center gap-12">
                        <i className="ph ph-shopping-cart text-xl"></i>
                        <div>
                          <div className="fw-semibold">Shopping Cart</div>
                          <small className="opacity-75">Review your items</small>
                        </div>
                      </div>
                      <i className="ph ph-arrow-right"></i>
                    </Link>

                    <Link 
                      to="/shop" 
                      className="btn btn-outline-main d-flex align-items-center justify-content-between py-16 px-20 text-start hover-bg-main hover-text-white transition-3"
                    >
                      <div className="d-flex align-items-center gap-12">
                        <i className="ph ph-storefront text-xl"></i>
                        <div>
                          <div className="fw-semibold">Continue Shopping</div>
                          <small className="opacity-75">Explore products</small>
                        </div>
                      </div>
                      <i className="ph ph-arrow-right"></i>
                    </Link>
                  </div>
                </div>

                {/* Account Security Card */}
                <div className="profile-card bg-white border-0 rounded-24 p-32 shadow-sm">
                  <h5 className="fw-bold text-neutral-900 mb-24">
                    <i className="ph ph-shield-check text-main-600 me-12"></i>
                    Account Security
                  </h5>

                  <div className="d-grid gap-16">
                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-between py-16 px-20 text-start">
                      <div className="d-flex align-items-center gap-12">
                        <i className="ph ph-key text-xl"></i>
                        <div>
                          <div className="fw-semibold">Change Password</div>
                          <small className="text-gray-500">Update your password</small>
                        </div>
                      </div>
                      <i className="ph ph-arrow-right"></i>
                    </button>

                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-between py-16 px-20 text-start">
                      <div className="d-flex align-items-center gap-12">
                        <i className="ph ph-bell text-xl"></i>
                        <div>
                          <div className="fw-semibold">Notifications</div>
                          <small className="text-gray-500">Manage preferences</small>
                        </div>
                      </div>
                      <i className="ph ph-arrow-right"></i>
                    </button>

                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-between py-16 px-20 text-start">
                      <div className="d-flex align-items-center gap-12">
                        <i className="ph ph-gear text-xl"></i>
                        <div>
                          <div className="fw-semibold">Account Settings</div>
                          <small className="text-gray-500">Privacy & preferences</small>
                        </div>
                      </div>
                      <i className="ph ph-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If user is not logged in, show login/register forms
  return (
    <section className="account py-80" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)', minHeight: '80vh' }}>
      <div className="container container-lg">
        {/* Header */}
        <div className="text-center mb-48">
          <h2 className="text-3xl fw-bold text-neutral-900 mb-16">
            Welcome to Your Account
          </h2>
          <p className="text-lg text-gray-600 mb-0">
            Sign in to your account or create a new one to get started
          </p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-16 mb-32 border-0 shadow-sm">
            <i className="ph ph-warning-circle me-12"></i>
            {error}
          </div>
        )}

        <div className="row gy-32 justify-content-center">
          {/* Login Card Start */}
          <div className="col-xl-6 col-lg-7">
            <form onSubmit={handleLoginSubmit}>
              <div className="auth-card bg-white rounded-24 p-40 shadow-sm border-0 h-100 hover-lift">
                <div className="text-center mb-32">
                  <div className="auth-icon bg-gradient-main rounded-circle d-inline-flex align-items-center justify-content-center mb-24" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="ph ph-sign-in text-3xl text-white"></i>
                  </div>
                  <h3 className="fw-bold text-neutral-900 mb-12">Welcome Back</h3>
                  <p className="text-gray-600 mb-0">Sign in to your account to continue</p>
                </div>

                <div className="mb-24">
                  <label htmlFor="email" className="form-label text-neutral-900 fw-semibold mb-12">
                    <i className="ph ph-envelope me-8 text-main-600"></i>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16 focus-ring-main"
                    id="email"
                    placeholder="Enter your email address"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div className="mb-32">
                  <label htmlFor="password" className="form-label text-neutral-900 fw-semibold mb-12">
                    <i className="ph ph-lock me-8 text-main-600"></i>
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={loginPassVisible ? 'text' : 'password'}
                      className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16 pe-56"
                      id="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-20 text-gray-500 hover-text-main"
                      onClick={toggleLoginPassVisibility}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <i className={`ph ph-${loginPassVisible ? 'eye-slash' : 'eye'} text-xl`}></i>
                    </button>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mb-32">
                  <div className="form-check">
                    <input
                      className="form-check-input rounded"
                      type="checkbox"
                      id="remember"
                      style={{ borderColor: '#FA6400' }}
                    />
                    <label className="form-check-label text-gray-600 ms-8" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="#"
                    className="text-main-600 fw-semibold text-decoration-none hover-text-decoration-underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-main btn-lg w-100 py-16 fw-bold rounded-12 shadow-sm"
                  disabled={authLoading}
                  style={{ background: 'linear-gradient(135deg, #FA6400 0%, #FF8A3D 100%)' }}
                >
                  {authLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-12"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="ph ph-sign-in me-12"></i>
                      Sign In
                    </>
                  )}
                </button>

                <div className="text-center mt-24">
                  <p className="text-gray-600 mb-0">
                    Don't have an account? 
                    <a href="#register" className="text-main-600 fw-semibold text-decoration-none ms-4">
                      Create one now
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
          {/* Login Card End */}

          {/* Register Card Start */}
          <div className="col-xl-6 col-lg-7">
            <form onSubmit={handleRegisterSubmit} id="register">
              <div className="auth-card bg-white rounded-24 p-40 shadow-sm border-0 hover-lift">
                <div className="text-center mb-32">
                  <div className="auth-icon bg-gradient-main rounded-circle d-inline-flex align-items-center justify-content-center mb-24" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="ph ph-user-plus text-3xl text-white"></i>
                  </div>
                  <h3 className="fw-bold text-neutral-900 mb-12">Create Account</h3>
                  <p className="text-gray-600 mb-0">Join us today and start shopping</p>
                </div>

                <div className="row gy-24">
                  <div className="col-12">
                    <label htmlFor="name" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-user me-8 text-main-600"></i>
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                      id="name"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                      style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-envelope me-8 text-main-600"></i>
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                      id="email"
                      placeholder="Enter your email address"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="password" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-lock me-8 text-main-600"></i>
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={regPassVisible ? 'text' : 'password'}
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16 pe-56"
                        id="password"
                        placeholder="Create a strong password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                        style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-20 text-gray-500"
                        onClick={toggleRegPassVisibility}
                        style={{ border: 'none', background: 'none' }}
                      >
                        <i className={`ph ph-${regPassVisible ? 'eye-slash' : 'eye'} text-xl`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-phone me-8 text-main-600"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                      id="phone"
                      placeholder="Your phone number"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="address.country" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-globe me-8 text-main-600"></i>
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                      id="address.country"
                      placeholder="Your country"
                      value={registerData.address.country}
                      onChange={handleRegisterChange}
                      style={{ border: '2px solid #e5e7eb', transition: 'all 0.3s ease' }}
                    />
                  </div>

                  {/* Collapsible Address Section */}
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-main-600 fw-semibold text-decoration-none d-flex align-items-center"
                      data-bs-toggle="collapse"
                      data-bs-target="#addressFields"
                    >
                      <i className="ph ph-plus me-8"></i>
                      Add detailed address (optional)
                    </button>
                    
                    <div className="collapse mt-16" id="addressFields">
                      <div className="row gy-16">
                        <div className="col-12">
                          <label htmlFor="address.street" className="form-label text-neutral-900 fw-semibold mb-8">
                            Street Address
                          </label>
                          <input
                            type="text"
                            className="form-control border-gray-200 rounded-12 px-16 py-12"
                            id="address.street"
                            placeholder="Street address"
                            value={registerData.address.street}
                            onChange={handleRegisterChange}
                            style={{ border: '2px solid #e5e7eb' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="address.city" className="form-label text-neutral-900 fw-semibold mb-8">
                            City
                          </label>
                          <input
                            type="text"
                            className="form-control border-gray-200 rounded-12 px-16 py-12"
                            id="address.city"
                            placeholder="City"
                            value={registerData.address.city}
                            onChange={handleRegisterChange}
                            style={{ border: '2px solid #e5e7eb' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="address.state" className="form-label text-neutral-900 fw-semibold mb-8">
                            State/Province
                          </label>
                          <input
                            type="text"
                            className="form-control border-gray-200 rounded-12 px-16 py-12"
                            id="address.state"
                            placeholder="State or province"
                            value={registerData.address.state}
                            onChange={handleRegisterChange}
                            style={{ border: '2px solid #e5e7eb' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="address.zip" className="form-label text-neutral-900 fw-semibold mb-8">
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            className="form-control border-gray-200 rounded-12 px-16 py-12"
                            id="address.zip"
                            placeholder="ZIP or postal code"
                            value={registerData.address.zip}
                            onChange={handleRegisterChange}
                            style={{ border: '2px solid #e5e7eb' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-32 mb-24">
                  <div className="form-check">
                    <input
                      className="form-check-input rounded"
                      type="checkbox"
                      id="terms"
                      required
                      style={{ borderColor: '#FA6400' }}
                    />
                    <label className="form-check-label text-sm text-gray-600 ms-8" htmlFor="terms">
                      I agree to the{' '}
                      <Link to="#" className="text-main-600 text-decoration-none">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="#" className="text-main-600 text-decoration-none">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-main btn-lg w-100 py-16 fw-bold rounded-12 shadow-sm"
                  disabled={authLoading}
                  style={{ background: 'linear-gradient(135deg, #FA6400 0%, #FF8A3D 100%)' }}
                >
                  {authLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-12"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="ph ph-user-plus me-12"></i>
                      Create Account
                    </>
                  )}
                </button>

                <div className="text-center mt-24">
                  <p className="text-gray-600 mb-0">
                    Already have an account? 
                    <a href="#top" className="text-main-600 fw-semibold text-decoration-none ms-4">
                      Sign in instead
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
          {/* Register Card End */}
        </div>
      </div>
    </section>
  );
};

export default Account;