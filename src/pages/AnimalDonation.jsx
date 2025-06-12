import React, { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import './AnimalDonation.css';
import NavBar from "../components/NavBar";

const AnimalDonation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    charity: '',
    amount: ''
  });

  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Token management functions (consistent with ChildDonation)
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const handleTokenExpiry = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    // Redirect to login page or show login modal
    window.location.href = '/login';
  };

  const charityOptions = [
    'Paws & Hearts Animal Rescue',
    'Hope for Animals Foundation',
    'Wildlife Conservation Society',
    'Safe Haven Animal Sanctuary',
    'Furry Friends Rescue Center',
    'Ocean Life Protection Fund',
    'Mountain Wildlife Preserve',
    'City Animal Welfare League',
    'Forest Creature Sanctuary',
    'Desert Animal Rescue Network'
  ];

  const quotes = [
    {
      text: "Until one has loved an animal, a part of one's soul remains unawakened.",
      author: "Anatole France",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=400&fit=crop"
    },
    {
      text: "The greatness of a nation can be judged by the way its animals are treated.",
      author: "Mahatma Gandhi",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=400&fit=crop"
    },
    {
      text: "Animals are such agreeable friends—they ask no questions; they pass no criticisms.",
      author: "George Eliot",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop"
    },
    {
      text: "Saving one animal won't change the world, but it will change the world for that one animal.",
      author: "Abdul Kalam",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&h=400&fit=crop"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error and success messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.charity || !formData.amount) {
      setError('Please fill in all required fields.');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    // Check authentication
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      handleTokenExpiry();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        charity: formData.charity,
        amount: parseFloat(formData.amount)
      };

      const response = await fetch('http://localhost:8081/api/donate/animal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 401) {
        handleTokenExpiry();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      
      // Success handling
      setSuccess(`Thank you ${formData.name}! Your donation of $${formData.amount} to ${formData.charity} has been processed successfully.`);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        charity: '',
        amount: ''
      });

      // Hide success message after 8 seconds
      setTimeout(() => setSuccess(null), 8000);

    } catch (err) {
      console.error('Animal donation error:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="donation-container">
      <NavBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className={`hero-title ${isVisible ? 'fade-in' : ''}`}>
            <br/>
            Be the Voice for the Voiceless
          </h1>
          <p className={`hero-subtitle ${isVisible ? 'slide-up' : ''}`}>
            Your donation helps save lives and create better futures for animals in need
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Quote Section - Left */}
        <div className="quote-section">
          <div className="quote-card">
            <div className="quote-image-container">
              <img 
                src={quotes[currentQuote].image} 
                alt="Animal" 
                className="quote-image"
                key={currentQuote}
              />
            </div>
            <div className="quote-content">
              <blockquote className="quote-text">
                "{quotes[currentQuote].text}"
              </blockquote>
              <cite className="quote-author">
                - {quotes[currentQuote].author}
              </cite>
            </div>
          </div>
        </div>

        {/* Donation Form - Right */}
        <div className="form-container">
          <div className="form-card">
            <h2 className="form-title">Make Your Donation</h2>
            
            {/* Success Message */}
            {success && (
              <div className="success-message">
                <Check />
                <span>{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  disabled={loading}
                  maxLength="100"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email address"
                  disabled={loading}
                  maxLength="100"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Choose Charity *</label>
                <select
                  name="charity"
                  value={formData.charity}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={loading}
                  required
                >
                  <option value="">Select an organization</option>
                  {charityOptions.map((charity, index) => (
                    <option key={index} value={charity}>
                      {charity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Donation Amount ($) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter donation amount"
                  min="1"
                  step="0.01"
                  disabled={loading}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`donate-button ${loading ? 'loading' : ''}`}
                disabled={loading || !formData.name || !formData.email || !formData.charity || !formData.amount}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    <span className="button-text">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="button-text">Donate Now</span>
                    <span className="button-icon">❤</span>
                  </>
                )}
              </button>
              
              <p className="required-note">* Required fields</p>
              <p className="security-note">🔒 Secure payment processing</p>
            </form>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">🐕</div>
            <h3 className="impact-title">10,000+</h3>
            <p className="impact-description">Animals Rescued</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">🏠</div>
            <h3 className="impact-title">5,000+</h3>
            <p className="impact-description">Forever Homes Found</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">💕</div>
            <h3 className="impact-title">24/7</h3>
            <p className="impact-description">Medical Care Provided</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">🌍</div>
            <h3 className="impact-title">Global</h3>
            <p className="impact-description">Wildlife Conservation</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2 className="gallery-title">Success Stories</h2>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop" 
              alt="Rescued dog" 
              className="gallery-image"
            />
            <div className="gallery-overlay">
              <p>Max found his forever home after 6 months of care</p>
            </div>
          </div>
          <div className="gallery-item">
            <img 
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop" 
              alt="Rescued cat" 
              className="gallery-image"
            />
            <div className="gallery-overlay">
              <p>Luna recovered from injury and found love</p>
            </div>
          </div>
          <div className="gallery-item">
            <img 
              src="https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop" 
              alt="Rescued rabbit" 
              className="gallery-image"
            />
            <div className="gallery-overlay">
              <p>Bunny was nursed back to health</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimalDonation;