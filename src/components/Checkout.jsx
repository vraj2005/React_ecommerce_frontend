import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import api from "../services/api";

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    country: "United States (US)",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    orderNotes: "",
  });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, total, loading: cartLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      navigate("/account");
    }
  }, [dispatch, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setError("Cart is empty");
      return;
    }

    const orderData = {
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      paymentMethod: selectedPayment,
    };

    try {
      const response = await api.post("/orders", orderData);
      navigate(`/order-confirmation/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    }
  };

  const subtotal = total;
  const estimatedTax = 10.00;
  const estimatedDelivery = 0.00;
  const grandTotal = subtotal + estimatedTax + estimatedDelivery;

  return (
    <section className="checkout py-80">
      <div className="container container-lg">
        {/* <div className="border border-gray-100 rounded-8 px-30 py-20 mb-40">
          <span>
            Have a coupon?{" "}
            <Link
              to="/cart"
              className="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
            >
              Click here to enter your code
            </Link>
          </span>
        </div> */}
        {error && <div className="alert alert-danger mb-24">{error}</div>}
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <form onSubmit={handlePlaceOrder} className="pe-xl-5">
              <div className="row gy-3">
                <div className="col-sm-6 col-xs-6">
                  <input
                    type="text"
                    name="firstName"
                    className="common-input border-gray-100"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-sm-6 col-xs-6">
                  <input
                    type="text"
                    name="lastName"
                    className="common-input border-gray-100"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="businessName"
                    className="common-input border-gray-100"
                    placeholder="Business Name (Optional)"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="country"
                    className="common-input border-gray-100"
                    placeholder="United States (US)"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="street"
                    className="common-input border-gray-100"
                    placeholder="Street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="apartment"
                    className="common-input border-gray-100"
                    placeholder="Apartment, suite, unit, etc. (Optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="city"
                    className="common-input border-gray-100"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="state"
                    className="common-input border-gray-100"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="zip"
                    className="common-input border-gray-100"
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="tel"
                    name="phone"
                    className="common-input border-gray-100"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="email"
                    name="email"
                    className="common-input border-gray-100"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  {/* <div className="my-40">
                    <h6 className="text-lg mb-24">Additional Information</h6>
                    <input
                      type="text"
                      name="orderNotes"
                      className="common-input border-gray-100"
                      placeholder="Notes about your order, e.g., special notes for delivery"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                    />
                  </div> */}
                </div>
              </div>
            </form>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="checkout-sidebar">
              <div className="bg-color-three rounded-8 p-24 text-center">
                <span className="text-gray-900 text-xl fw-semibold">Your Orders</span>
              </div>
              <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">Product</span>
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">Subtotal</span>
                </div>
                {cartLoading ? (
                  <div>Loading...</div>
                ) : items.length === 0 ? (
                  <div>No items in cart</div>
                ) : (
                  items.map((item) => (
                    <div className="flex-between gap-24 mb-32" key={item.productId._id}>
                      <div className="flex-align gap-12">
                        <span className="text-gray-900 fw-normal text-md font-heading-two w-144">
                          {item.productId.name}
                        </span>
                        <span className="text-gray-900 fw-normal text-md font-heading-two">
                          <i className="ph-bold ph-x" />
                        </span>
                        <span className="text-gray-900 fw-semibold text-md font-heading-two">
                          {item.quantity}
                        </span>
                      </div>
                      <span className="text-gray-900 fw-bold text-md font-heading-two">
                        ${(item.quantity * (item.productId.discountPrice || item.productId.price)).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
                <div className="border-top border-gray-100 pt-30 mt-30">
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">Subtotal</span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">Estimated Delivery</span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      {estimatedDelivery === 0 ? "Free" : `$${estimatedDelivery.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="mb-0 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">Estimated Taxes</span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="mt-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">Total</span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-32">
                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="cod"
                      value="COD"
                      checked={selectedPayment === "COD"}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label fw-semibold text-neutral-600" htmlFor="cod">
                      Cash on Delivery
                    </label>
                  </div>
                  {selectedPayment === "COD" && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Pay with cash upon delivery. Ensure someone is available to receive the order.
                      </p>
                    </div>
                  )}
                </div>
                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="creditCard"
                      value="Credit Card"
                      checked={selectedPayment === "Credit Card"}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label fw-semibold text-neutral-600" htmlFor="creditCard">
                      Credit Card
                    </label>
                  </div>
                  {selectedPayment === "Credit Card" && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Pay securely with your credit card. Processed immediately.
                      </p>
                    </div>
                  )}
                </div>
                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="paypal"
                      value="PayPal"
                      checked={selectedPayment === "PayPal"}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label fw-semibold text-neutral-600" htmlFor="paypal">
                      PayPal
                    </label>
                  </div>
                  {selectedPayment === "PayPal" && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Pay with PayPal. You’ll be redirected to complete the payment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-32 pt-32 border-top border-gray-100">
                <p className="text-gray-500">
                  Your personal data will be used to process your order, support your experience throughout this website,
                  and for other purposes described in our{" "}
                  <Link to="#" className="text-main-600 text-decoration-underline">
                    privacy policy
                  </Link>.
                </p>
              </div>
              <button
                type="submit"
                onClick={handlePlaceOrder}
                className="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
                disabled={cartLoading || !items.length}
              >
                {cartLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;