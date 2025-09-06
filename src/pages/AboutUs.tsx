import React from "react";
import "../styles/pages.css";

const AboutUsPage: React.FC = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">ABOUT BISCENIC</h1>
      <div className="about-section">
        <p className="about-section">
        Founded by visionary designer <strong>Lomon Christopher</strong>, Biscenic was born from a relentless pursuit of artistry, form, and human connection.
        </p>
        <div className="about-divider">
          <p>
            More than a design house, Biscenic stands as a sanctuary where craftsmanship meets sensory innovation.
            Rooted in the belief that furniture transcends function, Biscenic redefines living spaces as immersive artforms—crafted with precision, emotion, and a devotion to timeless beauty.
          </p>
          <p>
            Revered for harmonizing architectural grace with modern technology, Biscenic transforms the ordinary into profound expressions of comfort and style.
          </p>
          <p>
            With each creation, Biscenic carries forward a legacy of bold imagination—an evolving testament to design that speaks, stirs, and remains.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
