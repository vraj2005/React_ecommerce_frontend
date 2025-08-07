// src/App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import store from './redux/store';
import RouteScrollToTop from './helper/RouteScrollToTop';
import HomePageOne from './pages/HomePageOne';
import PhosphorIconInit from './helper/PhosphorIconInit';
import ShopPage from './pages/ShopPage';
import ProductDetailsPageOne from './pages/ProductDetailsPageOne';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import BlogPage from './pages/BlogPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import ContactPage from './pages/ContactPage';
import OrderConfirmation from './components/OrderConfirmation';
import OrdersPage from './pages/OrdersPage'; // Import the new page
import { fetchUserProfile } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  // Listen for storage events to handle login/logout from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          // Token was added/updated
          dispatch(fetchUserProfile());
          dispatch(fetchCart());
        } else {
          // Token was removed
          window.location.reload();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <PhosphorIconInit />
      <Routes>
        <Route exact path="/" element={<HomePageOne />} />
        <Route exact path="/shop" element={<ShopPage />} />
        <Route exact path="/product-details/:id" element={<ProductDetailsPageOne />} />
        <Route exact path="/cart" element={<CartPage />} />
        <Route exact path="/checkout" element={<CheckoutPage />} />
        <Route exact path="/account" element={<AccountPage />} />
        <Route exact path="/blog" element={<BlogPage />} />
        <Route exact path="/blog-details" element={<BlogDetailsPage />} />
        <Route exact path="/contact" element={<ContactPage />} />
        <Route exact path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route exact path="/orders" element={<OrdersPage />} /> {/* New route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;