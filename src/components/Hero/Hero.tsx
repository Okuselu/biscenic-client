import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/themeContext/themeContext";
import "./Hero.css";

const Hero: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className={`hero ${theme}`} data-theme={theme}>
      {/* Full-background video */}
      <div className="hero-video-container">
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
            <i data-feather="arrow-right" className="feather-16"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
