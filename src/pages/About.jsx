import React, { useState, useEffect } from 'react';
import { Shield, Users, Baby, Heart } from 'lucide-react'; 
import './About.css'; 
import NavBar from "../components/NavBar";

const About = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
            entry.target.classList.add('visible');
          } else {
            // entry.target.classList.remove('visible');
            // setIsVisible(prev => ({ ...prev, [entry.target.id]: false }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const quotes = [
    {
      text: "The greatness of a nation can be judged by the way its animals are treated.",
      author: "Mahatma Gandhi",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=500&fit=crop"
    },
    {
      text: "No act of kindness, no matter how small, is ever wasted.",
      author: "Aesop",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop"
    },
    {
      text: "We make a living by what we get, but we make a life by what we give.",
      author: "Winston Churchill",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop"
    }
  ];

  const missionCards = [
    {
      icon: <Heart className="mission-card-icon" />,
      title: "Animal Welfare",
      description: "Rescuing, rehabilitating, and providing care for abandoned and injured animals. Every creature deserves love and protection.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop"
    },
    {
      icon: <Baby className="mission-card-icon" />,
      title: "Child Support",
      description: "Providing education, healthcare, and basic necessities to underprivileged children. Building a brighter future for the next generation.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop"
    },
  ];

  return (
    <div className="page-container">
      <NavBar /> 

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-wrapper animate-on-scroll fade-only" id="hero-content">
          <h1 className="hero-title">
            About Our Mission
          </h1>
          <p className="hero-description">
            Dedicated to creating a world where every life matters - from the smallest animal to every child in need
          </p>
          <div>
            <Shield className="hero-stats-icon" />
            <span className="hero-stats-text">Trusted • Transparent • Impactful</span>
            <Shield className="hero-stats-icon purple" />
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="float-element blue"></div>
        <div className="float-element purple"></div>
        <div className="float-element pink"></div>
      </section>

      {/* Inspirational Quotes Section */}
      <section className="quotes-section">
        <div className="quotes-container">
          <h2 className="quotes-title animate-on-scroll" id="quotes-title">
            Words That Inspire Us
          </h2>
          <div className="quotes-grid">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className={`quote-card animate-on-scroll ${index === 0 ? 'delay-200ms' : index === 1 ? 'delay-400ms' : 'delay-600ms'}`}
                id={`quote-${index}`}
              >
                <div className="quote-card-image-wrapper">
                  <img 
                    src={quote.image} 
                    alt="Inspirational" 
                    className="image-cover"
                  />
                  <div className="absolute-full quote-card-image-overlay"></div>
                </div>
                <blockquote className="quote-card-text">
                  "{quote.text}"
                </blockquote>
                <cite className="quote-card-author">— {quote.author}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Mission Cards Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-header animate-on-scroll" id="mission-title">
            <h2 className="mission-title">
              OUR TWO PILLARS OF IMPACT
            </h2>
            <p className="mission-description">
              Every donation, every volunteer hour, every act of kindness contributes to these core areas of our mission
            </p>
          </div>

          <div className="mission-cards-grid">
            {missionCards.map((card, index) => (
              <div
                key={index}
                className={`mission-card animate-on-scroll ${index === 0 ? 'delay-200ms' : 'delay-400ms'}`}
                id={`mission-${index}`}
              >
                <div className="mission-card-image-wrapper">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="image-cover"
                  />
                  <div className="absolute-full mission-card-image-overlay"></div>
                  <div className="mission-card-icon-wrapper">
                    {card.icon}
                  </div>
                </div>
                
                <div className="mission-card-body">
                  <h3>
                    {card.title}
                  </h3>
                  <p>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;