import React from 'react';
import { Link } from 'react-router-dom';

const FooterOne = () => {
    return (
        <footer className="footer py-80" style={{ backgroundColor: '#7cbc96' }}>
            <div className="container">
                <div className="footer-item-wrapper d-flex flex-wrap gap-32">
                    <div className="footer-item">
                        <Link to="/" className="footer-item__logo">
                            <img src="assets/images/logo/rigitx-logo.png" alt="RigitX" />
                        </Link>
                        <p className="mt-24 mb-24">
                            RigitX - Premium PC components and laptops for enthusiasts and professionals.
                        </p>
                        <div className="flex-align gap-12 mb-16">
                            <span className="text-md"><i className="ph-fill ph-map-pin mr-8" /></span>
                            <span className="text-md">123 Tech Drive, Silicon Valley, CA 94043</span>
                        </div>
                        <div className="flex-align gap-12 mb-16">
                            <span className="text-md"><i className="ph-fill ph-phone-call mr-8" /></span>
                            <Link to="tel:+18005551234" className="text-md hover-text-main-600">
                                +1 (800) 555-1234
                            </Link>
                        </div>
                        <div className="flex-align gap-12">
                            <span className="text-md"><i className="ph-fill ph-envelope mr-8" /></span>
                            <Link to="mailto:support@rigitx.com" className="text-md hover-text-main-600">
                                support@rigitx.com
                            </Link>
                        </div>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item__title mb-24">Shop Categories</h6>
                        <ul className="footer-menu">
                            <li className="mb-16"><Link to="/shop/processors" className="text-md hover-text-main-600">Processors</Link></li>
                            <li className="mb-16"><Link to="/shop/graphics" className="text-md hover-text-main-600">Graphics Cards</Link></li>
                            <li className="mb-16"><Link to="/shop/laptops" className="text-md hover-text-main-600">Gaming Laptops</Link></li>
                            <li className="mb-16"><Link to="/shop/storage" className="text-md hover-text-main-600">Storage</Link></li>
                            <li><Link to="/shop/accessories" className="text-md hover-text-main-600">Accessories</Link></li>
                        </ul>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item__title mb-24">Customer Service</h6>
                        <ul className="footer-menu">
                            <li className="mb-16"><Link to="/support" className="text-md hover-text-main-600">Help Center</Link></li>
                            <li className="mb-16"><Link to="/contact" className="text-md hover-text-main-600">Contact Us</Link></li>
                            <li className="mb-16"><Link to="/returns" className="text-md hover-text-main-600">Returns & Warranty</Link></li>
                            <li className="mb-16"><Link to="/shipping" className="text-md hover-text-main-600">Shipping Info</Link></li>
                            <li><Link to="/faq" className="text-md hover-text-main-600">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item__title mb-24">My Account</h6>
                        <ul className="footer-menu">
                            <li className="mb-16"><Link to="/account" className="text-md hover-text-main-600">Profile</Link></li>
                            <li className="mb-16"><Link to="/orders" className="text-md hover-text-main-600">Order History</Link></li>
                            <li className="mb-16"><Link to="/cart" className="text-md hover-text-main-600">Shopping Cart</Link></li>
                            <li className="mb-16"><Link to="/wishlist" className="text-md hover-text-main-600">Wishlist</Link></li>
                            <li><Link to="/support/tickets" className="text-md hover-text-main-600">Support Tickets</Link></li>
                        </ul>
                    </div>

                    <div className="footer-item">
                        <h6 className="footer-item__title mb-24">Follow Us</h6>
                        <p className="mb-16">Stay updated with RigitX</p>
                        <ul className="flex-align gap-16">
                            <li>
                                <Link to="/twitter" className="w-40 h-40 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                    <i className="ph-fill ph-twitter-logo" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/facebook" className="w-40 h-40 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                    <i className="ph-fill ph-facebook-logo" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/instagram" className="w-40 h-40 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                    <i className="ph-fill ph-instagram-logo" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/youtube" className="w-40 h-40 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                    <i className="ph-fill ph-youtube-logo" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterOne;