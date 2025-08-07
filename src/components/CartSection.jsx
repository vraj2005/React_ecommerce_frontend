// CartSection.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import QuantityControl from '../helper/QuantityControl';

const CartSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      navigate('/account');
    }
  }, [dispatch, user, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await dispatch(removeFromCart(productId)).unwrap();
      } else {
        await dispatch(updateCartItem({ productId, quantity: newQuantity })).unwrap();
      }
      // Re-fetch the cart to reflect the updated quantities from the DB
      await dispatch(fetchCart()).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const renderCartItem = (item) => {
    const product = item.productId || {};
    const price = product.discountPrice || product.price || 0;
    const itemSubtotal = item.quantity * price;

    return (
      <tr key={item.productId?._id || item._id}>
        <td>
          <button
            type="button"
            className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
            onClick={() => handleRemoveItem(product._id)}
            disabled={loading}
          >
            <i className="ph ph-x-circle text-2xl d-flex" />
            Remove
          </button>
        </td>
        <td>
          <div className="table-product d-flex align-items-center gap-24">
            <Link
              to={`/product-details/${product._id}`}
              className="table-product__thumb border border-gray-100 rounded-8 flex-center"
            >
              <img
                src={product.images?.[0] || 'assets/images/thumbs/product-two-img1.png'}
                alt={product.name || 'Product'}
              />
            </Link>
            <div className="table-product__content text-start">
              <h6 className="title text-lg fw-semibold mb-8">
                <Link to={`/product-details/${product._id}`} className="link text-line-2">
                  {product.name || 'Unnamed Product'}
                </Link>
              </h6>
              <div className="flex-align gap-16 mb-16">
                <div className="flex-align gap-6">
                  <span className="text-md fw-medium text-warning-600 d-flex">
                    <i className="ph-fill ph-star" />
                  </span>
                  <span className="text-md fw-semibold text-gray-900">
                    {product.ratings?.average || 0}
                  </span>
                </div>
                <span className="text-sm fw-medium text-gray-200">|</span>
                <span className="text-neutral-600 text-sm">
                  {product.ratings?.count || 0} Reviews
                </span>
              </div>
              <div className="flex-align gap-16">
                {product.type && (
                  <Link
                    to={`/products?type=${product.type}`}
                    className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                  >
                    {product.type}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span className="text-lg h6 mb-0 fw-semibold">${price.toFixed(2)}</span>
        </td>
        <td>
          <QuantityControl
            value={item.quantity}
            onQuantityChange={(newQty) => handleQuantityChange(product._id, newQty)}
          />
        </td>
        <td>
          <span className="text-lg h6 mb-0 fw-semibold">${itemSubtotal.toFixed(2)}</span>
        </td>
      </tr>
    );
  };

  const subtotal = items.reduce((sum, item) => {
    const product = item.productId || {};
    const price = product.discountPrice || product.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const estimatedTax = 0.0;
  const estimatedDelivery = 0.5;
  const grandTotal = subtotal + estimatedTax + estimatedDelivery;

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-xl-9 col-lg-8">
            <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
              <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                <table className="table style-three">
                  <thead>
                    <tr>
                      <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                      <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                      <th className="h6 mb-0 text-lg fw-bold">Price</th>
                      <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                      <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5">Loading cart...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="5">Error: {error}</td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan="5">Your cart is empty</td>
                      </tr>
                    ) : (
                      items.map(renderCartItem)
                    )}
                  </tbody>
                </table>
              </div>
              {/* <div className="flex-between flex-wrap gap-16 mt-16">
                <div className="flex-align gap-16">
                  <input type="text" className="common-input" placeholder="Coupon Code" />
                  <button type="submit" className="btn btn-main py-18 w-100 rounded-8">
                    Apply Coupon
                  </button>
                </div>
                <button type="submit" className="text-lg text-gray-500 hover-text-main-600">
                  Update Cart
                </button>
              </div> */}
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
              <h6 className="text-xl mb-32">Cart Totals</h6>
              <div className="bg-color-three rounded-8 p-24">
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Subtotal</span>
                  <span className="text-gray-900 fw-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Estimated Delivery</span>
                  <span className="text-gray-900 fw-semibold">${estimatedDelivery.toFixed(2)}</span>
                </div>
                <div className="mb-0 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Estimated Taxes</span>
                  <span className="text-gray-900 fw-semibold">${estimatedTax.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-color-three rounded-8 p-24 mt-24">
                <div className="flex-between gap-8">
                  <span className="text-gray-900 text-xl fw-semibold">Total</span>
                  <span className="text-gray-900 text-xl fw-semibold">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn btn-main mt-40 py-18 w-100 rounded-8">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;
