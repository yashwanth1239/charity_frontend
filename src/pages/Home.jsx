// src/pages/Home.jsx
import './Home.css';
import React from "react";
import "./Home.css";
import NavBar from "../components/NavBar";


const Home = () => {
  return (
    <div className="home-container">
      <NavBar />

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">BE THE REASON SOMEONE SMILES TODAY</h1>
          <p className="hero-subtitle">Together, we can make a difference</p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-box fade-in-left">
          <img src="dog.jpg" alt="Help Animals" className="content-image" />
          <div className="content-text">
            <h2>Help Save Animals</h2>
            <p>Every life matters. Your donations give hope and healing to abused and abandoned animals.</p>
          </div>
        </div>

        <div className="content-box fade-in-right">
          <img src="child.jpg" alt="Help Children" className="content-image" />
          <div className="content-text">
            <h2>Support Children's Education</h2>
            <p>Your support brings books, learning tools, and opportunities to children in need.</p>
          </div>
        </div>

        <div className="quote-section zoom-in">
          <blockquote>
            "The best way to find yourself is to lose yourself in the service of others."
          </blockquote>
          <cite>- Mahatma Gandhi</cite>
        </div>
      </section>
    </div>
  );
};

export default Home;