import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/themeContext/themeContext";
import "./Hero.css";

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className={`hero ${theme}`} data-theme={theme}>
      {/* Conditional Video Rendering */}
      <div className="hero-video-container">
        {isMobile ? (
          // Mobile: Cloudinary Embed Player
          <div className="hero-video-embed">
            <iframe
              src="https://player.cloudinary.com/embed/?cloud_name=deghyfrhs&public_id=herovid_ot3xtt&profile=cld-default"
              width="100%"
              height="100%"
              style={{
                aspectRatio: '16/9',
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Hero Video Mobile"
            />
          </div>
        ) : (
          // Desktop: Original Video
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source
              src="https://res.cloudinary.com/deghyfrhs/video/upload/q_auto,f_auto,w_1920,h_1080,c_fill/v1756320584/furniture3_ptvjif.mov"
              type="video/mp4"
            />
            {/* Fallback for browsers that don't support video */}
            <img
              src="https://res.cloudinary.com/deghyfrhs/image/upload/q_auto,f_auto,w_1920,h_1080,c_fill/v1756320584/furniture3_ptvjif.jpg"
              alt="Hero Background"
              className="hero-video-fallback"
            />
          </video>
        )}

        {/* Video overlay for better text readability */}
        <div className="hero-video-overlay"></div>
      </div>

      {/* Hero text content as overlay */}
      <div className="hero-content">
        <div className="hero-text">
          <h1>Inventing Distinctive Art Forms</h1>
          <p>
            Where pioneering design converges with advanced sensory technology
            to create bespoke sanctuaries of profound tranquility and
            contemporary opulence
          </p>
          <Link to="/products" className="hero-cta">
            <span>Explore Collections</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;