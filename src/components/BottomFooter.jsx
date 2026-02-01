import React from 'react';
import { Link } from 'react-router-dom';

const BottomFooter = () => {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container container-lg">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="logo-rigi">RIGI</span>
                <span className="logo-tx">TX</span>
              </Link>
              <p className="brand-desc">
                Your one-stop destination for premium gaming PCs, components, and accessories. 
                Experience the power of next-gen gaming.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <i className="ph ph-facebook-logo"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                  <i className="ph ph-twitter-logo"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <i className="ph ph-instagram-logo"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                  <i className="ph ph-youtube-logo"></i>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Discord">
                  <i className="ph ph-discord-logo"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="link-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/account">My Account</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-links">
              <h4 className="footer-heading">Categories</h4>
              <ul className="link-list">
                <li><Link to="/shop">Gaming PCs</Link></li>
                <li><Link to="/shop">Graphics Cards</Link></li>
                <li><Link to="/shop">Processors</Link></li>
                <li><Link to="/shop">Peripherals</Link></li>
                <li><Link to="/shop">Accessories</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h4 className="footer-heading">Newsletter</h4>
              <p className="newsletter-desc">
                Subscribe to get updates on new products and exclusive deals.
              </p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  <i className="ph ph-paper-plane-tilt"></i>
                </button>
              </form>
              <div className="payment-methods">
                <span className="payment-label">We Accept:</span>
                <div className="payment-icons">
                  <i className="ph ph-credit-card"></i>
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="container container-lg">
          <div className="bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} RIGITX. All Rights Reserved.
            </p>
            <div className="bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .site-footer {
          background: #0d0d1a;
        }

        .footer-main {
          padding: 60px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 48px;
        }

        @media (max-width: 1199px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .footer-logo {
          display: inline-flex;
          font-size: 28px;
          font-weight: 800;
          text-decoration: none;
          margin-bottom: 16px;
        }

        .logo-rigi {
          color: #FF6B00;
        }

        .logo-tx {
          color: #fff;
        }

        .brand-desc {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .social-link:hover {
          background: #FF6B00;
          transform: translateY(-3px);
        }

        .footer-heading {
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .link-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .link-list li {
          margin-bottom: 12px;
        }

        .link-list a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .link-list a:hover {
          color: #FF6B00;
          padding-left: 8px;
        }

        .newsletter-desc {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .newsletter-input {
          flex: 1;
          padding: 14px 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.3s;
        }

        .newsletter-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .newsletter-input:focus {
          border-color: #FF6B00;
          background: rgba(255,255,255,0.12);
        }

        .newsletter-btn {
          width: 52px;
          background: #FF6B00;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .newsletter-btn:hover {
          background: #e55d00;
        }

        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .payment-label {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }

        .payment-icons {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }

        .payment-icons i {
          font-size: 18px;
        }

        .footer-bottom {
          padding: 20px 0;
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .copyright {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin: 0;
        }

        .bottom-links {
          display: flex;
          gap: 24px;
        }

        .bottom-links a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.3s;
        }

        .bottom-links a:hover {
          color: #FF6B00;
        }

        @media (max-width: 575px) {
          .bottom-content {
            flex-direction: column;
            text-align: center;
          }
          
          .bottom-links {
            gap: 16px;
          }
        }
      `}</style>
    </footer>
  );
};

export default BottomFooter;
