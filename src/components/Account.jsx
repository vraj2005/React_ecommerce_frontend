import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout } from '../redux/slices/authSlice';
import './Profile.css';

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loginPassVisible, setLoginPassVisible] = useState(false);
  const [regPassVisible, setRegPassVisible] = useState(false);

  // Clear local error when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
      setSuccess(null);
    }
  }, [authError]);

  // Clear errors when switching tabs
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [activeTab]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address_')) {
      const addressField = name.replace('address_', '');
      setRegisterData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
    if (error) setError(null);
  };

  const validateLogin = () => {
    if (!loginData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!loginData.password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (!registerData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!registerData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!registerData.password) {
      setError('Please enter a password');
      return false;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!registerData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!registerData.address.street.trim()) {
      setError('Please enter your street address');
      return false;
    }
    if (!registerData.address.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!registerData.address.state.trim()) {
      setError('Please enter your state/province');
      return false;
    }
    if (!registerData.address.zip.trim()) {
      setError('Please enter your ZIP/postal code');
      return false;
    }
    if (!registerData.address.country.trim()) {
      setError('Please enter your country');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateLogin()) return;

    try {
      const result = await dispatch(login({
        email: loginData.email.trim().toLowerCase(),
        password: loginData.password,
      }));
      
      if (login.fulfilled.match(result)) {
        setSuccess('Login successful! Redirecting...');
        setLoginData({ email: '', password: '' });
        setTimeout(() => navigate('/'), 1000);
      } else if (login.rejected.match(result)) {
        setError(result.payload || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateRegister()) return;

    // Prepare data for API
    const userData = {
      name: registerData.name.trim(),
      email: registerData.email.trim().toLowerCase(),
      password: registerData.password,
      phone: registerData.phone.trim(),
      address: {
        street: registerData.address.street.trim(),
        city: registerData.address.city.trim(),
        state: registerData.address.state.trim(),
        zip: registerData.address.zip.trim(),
        country: registerData.address.country.trim(),
      },
    };

    try {
      const result = await dispatch(register(userData));
      
      if (register.fulfilled.match(result)) {
        setSuccess('Registration successful! Welcome aboard!');
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          address: { street: '', city: '', state: '', zip: '', country: '' },
        });
        setTimeout(() => navigate('/'), 1000);
      } else if (register.rejected.match(result)) {
        setError(result.payload || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // If user is logged in, show profile
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
                <div className="position-absolute top-0 end-0 opacity-10">
                  <i className="ph ph-user-circle" style={{ fontSize: '120px' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="row gy-24">
            <div className="col-lg-8">
              <div className="profile-card bg-white border-0 rounded-24 p-32 shadow-sm h-100">
                <div className="d-flex align-items-center justify-content-between mb-32">
                  <div>
                    <h4 className="mb-8 fw-bold text-neutral-900">Personal Information</h4>
                    <p className="text-gray-500 mb-0">Manage your personal details</p>
                  </div>
                </div>

                <div className="row gy-24">
                  <div className="col-md-6">
                    <div className="info-item p-20 bg-gray-50 rounded-12">
                      <div className="d-flex align-items-center gap-12 mb-12">
                        <i className="ph ph-user text-main-600 text-xl"></i>
                        <label className="text-sm fw-semibold text-gray-600 text-uppercase">Full Name</label>
                      </div>
                      <p className="text-lg fw-medium text-neutral-900 mb-0">{user.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="info-item p-20 bg-gray-50 rounded-12">
                      <div className="d-flex align-items-center gap-12 mb-12">
                        <i className="ph ph-envelope text-main-600 text-xl"></i>
                        <label className="text-sm fw-semibold text-gray-600 text-uppercase">Email</label>
                      </div>
                      <p className="text-lg fw-medium text-neutral-900 mb-0">{user.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="col-md-6">
                      <div className="info-item p-20 bg-gray-50 rounded-12">
                        <div className="d-flex align-items-center gap-12 mb-12">
                          <i className="ph ph-phone text-main-600 text-xl"></i>
                          <label className="text-sm fw-semibold text-gray-600 text-uppercase">Phone</label>
                        </div>
                        <p className="text-lg fw-medium text-neutral-900 mb-0">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {user.address && Object.values(user.address).some(v => v) && (
                  <div className="mt-32">
                    <h5 className="fw-bold text-neutral-900 mb-20">
                      <i className="ph ph-map-pin text-main-600 me-12"></i>
                      Address
                    </h5>
                    <div className="address-card p-24 bg-gradient-light rounded-16 border border-gray-100">
                      <p className="mb-0 text-neutral-900">
                        {[user.address.street, user.address.city, user.address.state, user.address.zip, user.address.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="profile-card bg-white border-0 rounded-24 p-32 shadow-sm">
                <h5 className="fw-bold text-neutral-900 mb-24">
                  <i className="ph ph-lightning text-main-600 me-12"></i>
                  Quick Actions
                </h5>
                <div className="d-grid gap-16">
                  <Link to="/orders" className="btn btn-outline-main d-flex align-items-center justify-content-between py-16 px-20">
                    <span><i className="ph ph-package me-12"></i>My Orders</span>
                    <i className="ph ph-arrow-right"></i>
                  </Link>
                  <Link to="/cart" className="btn btn-outline-main d-flex align-items-center justify-content-between py-16 px-20">
                    <span><i className="ph ph-shopping-cart me-12"></i>Cart</span>
                    <i className="ph ph-arrow-right"></i>
                  </Link>
                  <Link to="/shop" className="btn btn-outline-main d-flex align-items-center justify-content-between py-16 px-20">
                    <span><i className="ph ph-storefront me-12"></i>Shop</span>
                    <i className="ph ph-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Login/Register Forms
  return (
    <section className="account-section py-80" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)', minHeight: '80vh' }}>
      <div className="container container-lg">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            {/* Header */}
            <div className="text-center mb-40">
              <div className="auth-icon bg-gradient-main rounded-circle d-inline-flex align-items-center justify-content-center mb-24" 
                   style={{ width: '80px', height: '80px' }}>
                <i className={`ph ph-${activeTab === 'login' ? 'sign-in' : 'user-plus'} text-3xl text-white`}></i>
              </div>
              <h2 className="text-3xl fw-bold text-neutral-900 mb-12">
                {activeTab === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mb-0">
                {activeTab === 'login' 
                  ? 'Sign in to access your account' 
                  : 'Join us today and start shopping'}
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="d-flex gap-12 mb-32">
              <button
                type="button"
                className={`btn flex-grow-1 py-14 px-24 fw-semibold rounded-12 transition-3 ${
                  activeTab === 'login' 
                    ? 'btn-main text-white' 
                    : 'btn-outline-main'
                }`}
                onClick={() => setActiveTab('login')}
              >
                <i className="ph ph-sign-in me-8"></i>
                Sign In
              </button>
              <button
                type="button"
                className={`btn flex-grow-1 py-14 px-24 fw-semibold rounded-12 transition-3 ${
                  activeTab === 'register' 
                    ? 'btn-main text-white' 
                    : 'btn-outline-main'
                }`}
                onClick={() => setActiveTab('register')}
              >
                <i className="ph ph-user-plus me-8"></i>
                Register
              </button>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="alert alert-danger rounded-12 mb-24 border-0 d-flex align-items-center gap-12">
                <i className="ph ph-warning-circle text-xl"></i>
                <span>{error}</span>
                <button type="button" className="btn-close ms-auto" onClick={() => setError(null)}></button>
              </div>
            )}

            {success && (
              <div className="alert alert-success rounded-12 mb-24 border-0 d-flex align-items-center gap-12">
                <i className="ph ph-check-circle text-xl"></i>
                <span>{success}</span>
              </div>
            )}

            {/* Auth Card */}
            <div className="auth-card bg-white rounded-24 p-40 shadow-sm border-0">
              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-24">
                    <label htmlFor="login_email" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-envelope me-8 text-main-600"></i>
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                      id="login_email"
                      name="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-24">
                    <label htmlFor="login_password" className="form-label text-neutral-900 fw-semibold mb-12">
                      <i className="ph ph-lock me-8 text-main-600"></i>
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={loginPassVisible ? 'text' : 'password'}
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16 pe-56"
                        id="login_password"
                        name="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-20 text-gray-500"
                        onClick={() => setLoginPassVisible(!loginPassVisible)}
                        style={{ border: 'none', background: 'none' }}
                      >
                        <i className={`ph ph-${loginPassVisible ? 'eye-slash' : 'eye'} text-xl`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-32">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember_me" />
                      <label className="form-check-label text-gray-600 ms-8" htmlFor="remember_me">
                        Remember me
                      </label>
                    </div>
                    <Link to="#" className="text-main-600 fw-semibold text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-main btn-lg w-100 py-16 fw-bold rounded-12"
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

                  <p className="text-center mt-24 text-gray-600 mb-0">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-main-600 fw-semibold"
                      onClick={() => setActiveTab('register')}
                    >
                      Create one now
                    </button>
                  </p>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="row">
                    <div className="col-12 mb-24">
                      <label htmlFor="reg_name" className="form-label text-neutral-900 fw-semibold mb-12">
                        <i className="ph ph-user me-8 text-main-600"></i>
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                        id="reg_name"
                        name="name"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="col-12 mb-24">
                      <label htmlFor="reg_email" className="form-label text-neutral-900 fw-semibold mb-12">
                        <i className="ph ph-envelope me-8 text-main-600"></i>
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                        id="reg_email"
                        name="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-24">
                      <label htmlFor="reg_password" className="form-label text-neutral-900 fw-semibold mb-12">
                        <i className="ph ph-lock me-8 text-main-600"></i>
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <input
                          type={regPassVisible ? 'text' : 'password'}
                          className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16 pe-56"
                          id="reg_password"
                          name="password"
                          placeholder="Min. 6 characters"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-20 text-gray-500"
                          onClick={() => setRegPassVisible(!regPassVisible)}
                          style={{ border: 'none', background: 'none' }}
                        >
                          <i className={`ph ph-${regPassVisible ? 'eye-slash' : 'eye'} text-xl`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6 mb-24">
                      <label htmlFor="reg_confirm_password" className="form-label text-neutral-900 fw-semibold mb-12">
                        <i className="ph ph-lock-key me-8 text-main-600"></i>
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                        id="reg_confirm_password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <div className="col-12 mb-24">
                      <label htmlFor="reg_phone" className="form-label text-neutral-900 fw-semibold mb-12">
                        <i className="ph ph-phone me-8 text-main-600"></i>
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                        id="reg_phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        autoComplete="tel"
                        required
                      />
                    </div>

                    {/* Address Section */}
                    <div className="col-12 mb-16">
                      <label className="form-label text-neutral-900 fw-semibold mb-12">
                        <i className="ph ph-map-pin me-8 text-main-600"></i>
                        Address <span className="text-danger">*</span>
                      </label>
                    </div>

                    <div className="col-12 mb-20">
                      <input
                        type="text"
                        className="form-control form-control-lg border-gray-200 rounded-12 px-20 py-16"
                        name="address_street"
                        placeholder="Street Address *"
                        value={registerData.address.street}
                        onChange={handleRegisterChange}
                        autoComplete="street-address"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <input
                        type="text"
                        className="form-control border-gray-200 rounded-12 px-16 py-14"
                        name="address_city"
                        placeholder="City *"
                        value={registerData.address.city}
                        onChange={handleRegisterChange}
                        autoComplete="address-level2"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <input
                        type="text"
                        className="form-control border-gray-200 rounded-12 px-16 py-14"
                        name="address_state"
                        placeholder="State/Province *"
                        value={registerData.address.state}
                        onChange={handleRegisterChange}
                        autoComplete="address-level1"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-20">
                      <input
                        type="text"
                        className="form-control border-gray-200 rounded-12 px-16 py-14"
                        name="address_zip"
                        placeholder="ZIP/Postal Code *"
                        value={registerData.address.zip}
                        onChange={handleRegisterChange}
                        autoComplete="postal-code"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-24">
                      <input
                        type="text"
                        className="form-control border-gray-200 rounded-12 px-16 py-14"
                        name="address_country"
                        placeholder="Country *"
                        value={registerData.address.country}
                        onChange={handleRegisterChange}
                        autoComplete="country-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-check mb-24">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agree_terms"
                      required
                    />
                    <label className="form-check-label text-gray-600 ms-8" htmlFor="agree_terms">
                      I agree to the{' '}
                      <Link to="#" className="text-main-600">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="#" className="text-main-600">Privacy Policy</Link>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-main btn-lg w-100 py-16 fw-bold rounded-12"
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

                  <p className="text-center mt-24 text-gray-600 mb-0">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-main-600 fw-semibold"
                      onClick={() => setActiveTab('login')}
                    >
                      Sign in instead
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
