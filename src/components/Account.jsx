import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout } from '../redux/slices/authSlice';

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
      <section className="account py-80">
        <div className="container container-lg">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="border border-gray-100 rounded-16 px-24 py-40">
                <div className="d-flex justify-content-between align-items-center mb-32">
                  <h6 className="text-xl mb-0">My Profile</h6>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger py-12 px-24"
                  >
                    Logout
                  </button>
                </div>
                
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label className="text-neutral-900 text-lg mb-8 fw-medium">Name</label>
                      <p className="text-gray-700 mb-0">{user.name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label className="text-neutral-900 text-lg mb-8 fw-medium">Email</label>
                      <p className="text-gray-700 mb-0">{user.email || 'N/A'}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="col-sm-6">
                      <div className="mb-24">
                        <label className="text-neutral-900 text-lg mb-8 fw-medium">Phone</label>
                        <p className="text-gray-700 mb-0">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <>
                      <div className="col-12">
                        <h6 className="text-lg mb-16 mt-24">Address Information</h6>
                      </div>
                      
                      {user.address.street && (
                        <div className="col-sm-6">
                          <div className="mb-24">
                            <label className="text-neutral-900 text-lg mb-8 fw-medium">Street</label>
                            <p className="text-gray-700 mb-0">{user.address.street}</p>
                          </div>
                        </div>
                      )}

                      {user.address.city && (
                        <div className="col-sm-6">
                          <div className="mb-24">
                            <label className="text-neutral-900 text-lg mb-8 fw-medium">City</label>
                            <p className="text-gray-700 mb-0">{user.address.city}</p>
                          </div>
                        </div>
                      )}

                      {user.address.state && (
                        <div className="col-sm-6">
                          <div className="mb-24">
                            <label className="text-neutral-900 text-lg mb-8 fw-medium">State</label>
                            <p className="text-gray-700 mb-0">{user.address.state}</p>
                          </div>
                        </div>
                      )}

                      {user.address.zip && (
                        <div className="col-sm-6">
                          <div className="mb-24">
                            <label className="text-neutral-900 text-lg mb-8 fw-medium">ZIP Code</label>
                            <p className="text-gray-700 mb-0">{user.address.zip}</p>
                          </div>
                        </div>
                      )}

                      {user.address.country && (
                        <div className="col-sm-6">
                          <div className="mb-24">
                            <label className="text-neutral-900 text-lg mb-8 fw-medium">Country</label>
                            <p className="text-gray-700 mb-0">{user.address.country}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-32 pt-24 border-top border-gray-100">
                  <div className="d-flex flex-wrap gap-16">
                    <Link to="/orders" className="btn btn-main py-18 px-40">
                      View Orders
                    </Link>
                    <Link to="/cart" className="btn btn-outline-main py-18 px-40">
                      View Cart
                    </Link>
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
    <section className="account py-80">
      <div className="container container-lg">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row gy-4">
          {/* Login Card Start */}
          <div className="col-xl-6 pe-xl-5">
            <form onSubmit={handleLoginSubmit}>
              <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                <h6 className="text-xl mb-32">Login</h6>
                <div className="mb-24">
                  <label htmlFor="email" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="common-input"
                    id="email"
                    placeholder="Enter Email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="password" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={loginPassVisible ? 'text' : 'password'}
                      className="common-input"
                      id="password"
                      placeholder="Enter Password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                    <span
                      className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ph-${
                        loginPassVisible ? 'eye' : 'eye-slash'
                      }`}
                      onClick={toggleLoginPassVisibility}
                    />
                  </div>
                </div>
                <div className="mb-24 mt-48">
                  <div className="flex-align gap-48 flex-wrap">
                    <button type="submit" className="btn btn-main py-18 px-40" disabled={authLoading}>
                      {authLoading ? 'Logging in...' : 'Log in'}
                    </button>
                    <div className="form-check common-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />
                      <label className="form-check-label flex-grow-1" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-48">
                  <Link
                    to="#"
                    className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </form>
          </div>
          {/* Login Card End */}
          {/* Register Card Start */}
          <div className="col-xl-6">
            <form onSubmit={handleRegisterSubmit}>
              <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                <h6 className="text-xl mb-32">Register</h6>
                <div className="mb-24">
                  <label htmlFor="name" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="name"
                    placeholder="Your Name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="email" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="common-input"
                    id="email"
                    placeholder="Enter Email Address"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="password" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={regPassVisible ? 'text' : 'password'}
                      className="common-input"
                      id="password"
                      placeholder="Enter Password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                    <span
                      className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ph-${
                        regPassVisible ? 'eye' : 'eye-slash'
                      }`}
                      onClick={toggleRegPassVisibility}
                    />
                  </div>
                </div>
                <div className="mb-24">
                  <label htmlFor="address.street" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="address.street"
                    placeholder="Street Address"
                    value={registerData.address.street}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="address.city" className="text-neutral-900 text-lg mb-8 fw-medium">
                    City
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="address.city"
                    placeholder="City"
                    value={registerData.address.city}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="address.state" className="text-neutral-900 text-lg mb-8 fw-medium">
                    State
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="address.state"
                    placeholder="State"
                    value={registerData.address.state}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="address.zip" className="text-neutral-900 text-lg mb-8 fw-medium">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="address.zip"
                    placeholder="ZIP Code"
                    value={registerData.address.zip}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="address.country" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="address.country"
                    placeholder="Country"
                    value={registerData.address.country}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="mb-24">
                  <label htmlFor="phone" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="common-input"
                    id="phone"
                    placeholder="Phone Number"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="my-48">
                  <p className="text-gray-500">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                    <Link to="#" className="text-main-600 text-decoration-underline">
                      privacy policy
                    </Link>.
                  </p>
                </div>
                <div className="mt-48">
                  <button type="submit" className="btn btn-main py-18 px-40" disabled={authLoading}>
                    {authLoading ? 'Registering...' : 'Register'}
                  </button>
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