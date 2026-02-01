import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BannerOne = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Gaming PCs',
      subtitle: 'Ultimate Performance',
      description: 'HIGH-END GAMING RIGS & ACCESSORIES',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1920&q=80',
      brand: 'GIGABYTE',
    },
    {
      title: 'Build Your',
      subtitle: 'Dream Setup',
      description: 'PREMIUM PC COMPONENTS & PERIPHERALS',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1920&q=80',
      brand: 'CORSAIR',
    },
    {
      title: 'Next-Gen',
      subtitle: 'Graphics Cards',
      description: 'RTX 40 SERIES NOW AVAILABLE',
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1920&q=80',
      brand: 'NVIDIA',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero-banner">
      <div className="banner-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="container container-lg h-100">
              <div className="slide-content">
                <h1 className="slide-title">
                  {slide.title}
                  <br />
                  <span>{slide.subtitle}</span>
                </h1>
                <p className="slide-description">{slide.description}</p>
                <Link to="/shop" className="shop-btn">
                  SHOP NOW
                </Link>
                <div className="brand-badge">
                  <span>{slide.brand}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="nav-arrow prev-arrow" onClick={prevSlide}>
        <i className="ph ph-caret-left"></i>
      </button>
      <button className="nav-arrow next-arrow" onClick={nextSlide}>
        <i className="ph ph-caret-right"></i>
      </button>

      {/* Dots Navigation */}
      <div className="dots-nav">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <style jsx="true">{`
        .hero-banner {
          position: relative;
          width: 100%;
          height: 600px;
          overflow: hidden;
          background: #0a0a0a;
        }

        .banner-slider {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .banner-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }

        .banner-slide.active {
          opacity: 1;
          visibility: visible;
        }

        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }

        .slide-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding: 60px 0;
          max-width: 600px;
        }

        .slide-title {
          font-size: 64px;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 16px;
          text-shadow: 2px 4px 20px rgba(0, 0, 0, 0.5);
        }

        .slide-title span {
          display: block;
        }

        .slide-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 3px;
          margin-bottom: 32px;
          font-weight: 500;
        }

        .shop-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 40px;
          background: #0095ff;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
          width: fit-content;
          box-shadow: 0 8px 25px rgba(0, 149, 255, 0.35);
        }

        .shop-btn:hover {
          background: #007acc;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 149, 255, 0.45);
          color: #fff;
        }

        .brand-badge {
          position: absolute;
          bottom: 80px;
          left: 0;
        }

        .brand-badge span {
          font-size: 32px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.15);
          letter-spacing: 8px;
          text-transform: uppercase;
        }

        /* Navigation Arrows */
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .nav-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-arrow i {
          font-size: 20px;
          color: #333;
        }

        .prev-arrow {
          left: 24px;
        }

        .next-arrow {
          right: 24px;
        }

        /* Dots Navigation */
        .dots-nav {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .dot.active {
          background: #0095ff;
          width: 30px;
          border-radius: 5px;
        }

        /* Responsive Styles */
        @media (max-width: 1200px) {
          .slide-title {
            font-size: 52px;
          }
        }

        @media (max-width: 991px) {
          .hero-banner {
            height: 500px;
          }

          .slide-title {
            font-size: 44px;
          }

          .slide-description {
            font-size: 14px;
            letter-spacing: 2px;
          }

          .nav-arrow {
            width: 44px;
            height: 44px;
          }

          .prev-arrow {
            left: 16px;
          }

          .next-arrow {
            right: 16px;
          }
        }

        @media (max-width: 767px) {
          .hero-banner {
            height: 450px;
          }

          .slide-content {
            padding: 40px 0;
          }

          .slide-title {
            font-size: 36px;
          }

          .slide-description {
            font-size: 12px;
            letter-spacing: 1.5px;
            margin-bottom: 24px;
          }

          .shop-btn {
            padding: 14px 32px;
            font-size: 13px;
          }

          .brand-badge span {
            font-size: 24px;
            letter-spacing: 4px;
          }

          .nav-arrow {
            width: 40px;
            height: 40px;
          }

          .nav-arrow i {
            font-size: 16px;
          }
        }

        @media (max-width: 575px) {
          .hero-banner {
            height: 400px;
          }

          .slide-title {
            font-size: 28px;
          }

          .slide-description {
            font-size: 11px;
            letter-spacing: 1px;
          }

          .shop-btn {
            padding: 12px 28px;
            font-size: 12px;
          }

          .nav-arrow {
            width: 36px;
            height: 36px;
          }

          .prev-arrow {
            left: 10px;
          }

          .next-arrow {
            right: 10px;
          }

          .brand-badge {
            bottom: 60px;
          }

          .brand-badge span {
            font-size: 18px;
            letter-spacing: 3px;
          }
        }
      `}</style>
    </section>
  );
};

export default BannerOne;
