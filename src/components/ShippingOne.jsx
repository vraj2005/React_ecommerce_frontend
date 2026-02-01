import React from 'react';

const ShippingOne = () => {
  const features = [
    {
      icon: 'ph-truck',
      title: 'Free Shipping',
      description: 'Free delivery on orders over $99',
      color: '#FF6B00'
    },
    {
      icon: 'ph-shield-check',
      title: '2 Year Warranty',
      description: 'Extended warranty on all products',
      color: '#10b981'
    },
    {
      icon: 'ph-credit-card',
      title: 'Secure Payment',
      description: '100% secure payment methods',
      color: '#6366f1'
    },
    {
      icon: 'ph-headset',
      title: '24/7 Support',
      description: 'Expert support anytime you need',
      color: '#f59e0b'
    }
  ];

  return (
    <section className="shipping-section py-60">
      <div className="container container-lg">
        <div className="features-wrapper">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper" style={{ background: `${feature.color}15` }}>
                <i className={`ph ${feature.icon}`} style={{ color: feature.color }}></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .shipping-section {
          background: #1a1a2e;
        }

        .features-wrapper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 1199px) {
          .features-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 575px) {
          .features-wrapper {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-4px);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-wrapper i {
          font-size: 28px;
        }

        .feature-content {
          flex: 1;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
};

export default ShippingOne;
