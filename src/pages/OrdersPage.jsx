import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import HeaderOne from "../components/HeaderOne";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders?page=${page}&limit=${limit}&search=${searchQuery}`);
        setOrders(response.data.orders);
        setTotalPages(response.data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders, fam!");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setLoading(true);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 when searching
  };

  // Loading State
  if (loading) {
    return (
      <section style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #e2e8f0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ animation: "spin 1s linear infinite", borderRadius: "50%", height: "4rem", width: "4rem", border: "6px solid #dbeafe", borderTopColor: "#499f60", margin: "0 auto" }}></div>
          <p style={{ marginTop: "1.5rem", color: "#499f60", fontWeight: "600", fontSize: "1.25rem" }}>Loading...</p>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #e2e8f0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "2.5rem", borderRadius: "1rem", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", maxWidth: "32rem", borderLeft: "6px solid #dc2626", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", marginBottom: "1rem" }}>Yo, Something Messed Up!</h2>
          <p style={{ color: "#4b5563", fontSize: "1.125rem", marginBottom: "1.5rem" }}>{error}</p>
          <Link to="/" style={{ padding: "0.75rem 2rem", borderRadius: "0.5rem", backgroundColor: "#499f60", color: "#ffffff", textDecoration: "none", fontWeight: "600" }}>
            Back Home, Fam
          </Link>
        </div>
      </section>
    );
  }

  // Main Orders Page
  return (
    
    <section style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #e2e8f0)", padding: "3rem 0" }}>
      
      <div style={{ maxWidth: "85rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header with Search */}
        <div style={{ marginBottom: "3rem", borderBottom: "3px solid #499f60", paddingBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#111827" }}>Your Orders</h2>
          {/* <p style={{ color: "#4b5563", fontSize: "1rem", marginTop: "0.5rem" }}>Track and manage your stuff here</p>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", width: "100%", maxWidth: "30rem" }}
          /> */}
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", backgroundColor: "#ffffff", padding: "3rem", borderRadius: "1rem", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", maxWidth: "36rem", margin: "0 auto" }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "1rem" }}>No Orders Yet!</h3>
            <p style={{ color: "#4b5563", fontSize: "1.125rem", marginBottom: "2rem" }}>You haven’t copped anything yet!</p>
            <Link to="/shop" style={{ padding: "0.75rem 2rem", borderRadius: "0.5rem", backgroundColor: "#499f60", color: "#ffffff", textDecoration: "none", fontWeight: "600" }}>
              Shop Now
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {orders.map((order) => (
              <div key={order._id} style={{ backgroundColor: "#ffffff", borderRadius: "1rem", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                {/* Order Header */}
                <div style={{ backgroundColor: "#dbeafe", padding: "1.5rem", borderBottom: "1px solid #bfdbfe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827" }}>Order #{order._id.slice(-6)}</h3>
                    <p style={{ color: "#4b5563", fontSize: "0.875rem", marginTop: "0.25rem" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <span style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "2rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      backgroundColor: order.status === "pending" ? "#fef3c7" : order.status === "processing" ? "#bfdbfe" : order.status === "shipped" ? "#c7d2fe" : order.status === "delivered" ? "#d1fae5" : "#f3f4f6",
                      color: order.status === "pending" ? "#d97706" : order.status === "processing" ? "#499f60" : order.status === "shipped" ? "#4f46e5" : order.status === "delivered" ? "#047857" : "#4b5563"
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <Link to={`/order-confirmation/${order._id}`} style={{ color: "#499f60", fontSize: "1rem", fontWeight: "600", textDecoration: "none" }}>
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div style={{ padding: "2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
                    {/* Order Summary */}
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#4b5563", marginBottom: "0.75rem" }}>Order Summary</h4>
                      <div style={{ fontSize: "0.875rem" }}>
                        <p style={{ marginBottom: "0.5rem" }}>
                          <span style={{ color: "#6b7280" }}>Payment:</span>{" "}
                          <span style={{ fontWeight: "600", color: "#111827" }}>{order.paymentMethod}</span>
                        </p>
                        <p style={{ marginBottom: "0.5rem" }}>
                          <span style={{ color: "#6b7280" }}>Status:</span>{" "}
                          <span style={{
                            fontWeight: "600",
                            color: order.paymentStatus === "completed" ? "#16a34a" : order.paymentStatus === "failed" ? "#dc2626" : "#d97706"
                          }}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </p>
                        <p style={{ fontWeight: "700", color: "#111827", marginTop: "0.75rem", fontSize: "1.125rem" }}>
                          Total: ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#4b5563", marginBottom: "0.75rem" }}>Shipping Address</h4>
                      <address style={{ fontSize: "0.875rem", color: "#111827", fontStyle: "normal", lineHeight: "1.75" }}>
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                        {order.shippingAddress.country}
                      </address>
                    </div>

                    {/* Tracking */}
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#4b5563", marginBottom: "0.75rem" }}>Tracking</h4>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "18rem" }}>
                          <div style={{ position: "absolute", left: "0", right: "0", top: "50%", transform: "translateY(-50%)", height: "6px", backgroundColor: "#e5e7eb", borderRadius: "9999px" }}>
                            <div style={{
                              height: "100%",
                              backgroundColor: "#499f60",
                              borderRadius: "9999px",
                              width: order.status === "pending" ? "0%" : order.status === "processing" ? "33%" : order.status === "shipped" ? "66%" : order.status === "delivered" ? "100%" : "0%"
                            }}></div>
                          </div>
                          <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", zIndex: "10", backgroundColor: "#499f60", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}></div>
                          <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", zIndex: "10", backgroundColor: ["processing", "shipped", "delivered"].includes(order.status) ? "#499f60" : "#d1d5db", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}></div>
                          <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", zIndex: "10", backgroundColor: ["shipped", "delivered"].includes(order.status) ? "#499f60" : "#d1d5db", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}></div>
                          <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", zIndex: "10", backgroundColor: order.status === "delivered" ? "#499f60" : "#d1d5db", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}></div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#4b5563", marginTop: "0.5rem", fontWeight: "500" }}>
                        <span>Placed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ marginTop: "2rem", borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#4b5563", marginBottom: "1rem" }}>Items</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {order.items.map((item) => (
                        <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
                          <img
                            src={item.productId.images[0] || "https://via.placeholder.com/80"}
                            alt={item.productId.name}
                            style={{ width: "5rem", height: "5rem", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
                          />
                          <div style={{ flex: "1" }}>
                            <h5 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827" }}>{item.productId.name}</h5>
                            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div style={{ fontWeight: "600", color: "#111827", fontSize: "1rem" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  color: page === 1 ? "#d1d5db" : "#111827",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600"
                }}
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: page === i + 1 ? "#499f60" : "#ffffff",
                    color: page === i + 1 ? "#ffffff" : "#111827",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  color: page === totalPages ? "#d1d5db" : "#111827",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "600"
                }}
              >
                &gt;
              </button>
            </nav>
          </div>
        )}

        {/* Continue Shopping */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link to="/shop" style={{ padding: "0.75rem 2rem", borderRadius: "0.5rem", backgroundColor: "#499f60", color: "#ffffff", textDecoration: "none", fontWeight: "600" }}>
            Keep Shopping
          </Link>
        </div>
      </div>
      
      <BottomFooter />
      
    </section>
  
  );
};

export default OrdersPage;