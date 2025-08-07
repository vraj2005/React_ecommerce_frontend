// src/components/OrderConfirmation.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api"; // Assuming this is your API client

const OrderConfirmation = () => {
  const { id } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <section className="order-confirmation py-80">
        <div className="container container-lg">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="order-confirmation py-80">
        <div className="container container-lg">
          <div className="alert alert-danger text-center">{error}</div>
          <div className="text-center">
            <Link to="/" className="btn btn-main mt-20">
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-confirmation py-80">
      <div className="container container-lg">
        <div className="text-center mb-40">
          <h2 className="text-2xl fw-bold text-gray-900">Thank You for Your Order!</h2>
          <p className="text-gray-600 mt-8">
            Your order has been successfully placed. Below are the details of your purchase.
          </p>
        </div>

        <div className="border border-gray-100 rounded-8 p-24 bg-white">
          <h3 className="text-lg fw-semibold text-gray-900 mb-16">Order #{order._id}</h3>
          <div className="row">
            <div className="col-md-6">
              <h4 className="text-md fw-medium text-gray-900 mb-12">Shipping Address</h4>
              <p className="text-gray-700">
                {order.shippingAddress.street},<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip},<br />
                {order.shippingAddress.country}
              </p>
            </div>
            <div className="col-md-6">
              <h4 className="text-md fw-medium text-gray-900 mb-12">Order Summary</h4>
              <p className="text-gray-700">
                <strong>Payment Method:</strong> {order.paymentMethod}<br />
                <strong>Status:</strong> {order.status}<br />
                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-24">
            <h4 className="text-md fw-medium text-gray-900 mb-12">Items Ordered</h4>
            <div className="border-top border-gray-100 pt-16">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex-between gap-16 py-12 border-bottom border-gray-100"
                >
                  <div className="flex-align gap-12">
                    <span className="text-gray-900 fw-normal text-md">
                      {item.productId.name}
                    </span>
                    <span className="text-gray-900 fw-normal text-md">x</span>
                    <span className="text-gray-900 fw-semibold text-md">{item.quantity}</span>
                  </div>
                  <span className="text-gray-900 fw-bold text-md">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex-between gap-16 pt-16">
                <span className="text-gray-900 fw-semibold text-md">Total</span>
                <span className="text-gray-900 fw-bold text-md">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-40">
          <Link to="/orders" className="btn btn-main mr-16">
            View All Orders
          </Link>
          <Link to="/" className="btn btn-outline-main">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;