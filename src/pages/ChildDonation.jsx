import React, { useState } from 'react';
import { Heart, Users, BookOpen, Home, Check, AlertCircle } from 'lucide-react';
import './ChildDonation.css';
import NavBar from "../components/NavBar";

const ChildDonation = () => {
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    charity: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Token management functions (copied from Profile.jsx)
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.amount || !formData.name || !formData.email || !formData.charity) {
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

    try {
      // Map charity values to match backend expectations
      const charityMapping = {
        'education': 'children_education',
        'healthcare': 'children_healthcare', 
        'shelter': 'children_shelter',
        'family': 'children_family',
        'general': 'children_hunger' // Default to hunger for "Most Needed"
      };

      const requestBody = {
        charity: charityMapping[formData.charity] || 'children_hunger',
        name: formData.name.trim(),
        email: formData.email.trim(),
        amount: parseFloat(formData.amount)
      };

      const response = await fetch('http://localhost:8081/api/donate/child', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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

      const result = await response.json();
      
      // Success handling
      setSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        amount: '',
        name: '',
        charity: '',
        email: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);

    } catch (err) {
      console.error('Donation submission error:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (amount) => {
    setFormData({ ...formData, amount });
    // Clear error when user selects amount
    if (error) setError(null);
  };

  const impactQuotes = [
    {
      text: "Every child deserves a chance to dream, to learn, and to grow into who they're meant to be.",
      author: "Malala Yousafzai",
      image: "/images/malala.jpg"
    },
    {
      text: "Children are not things to be molded, but people to be unfolded.",
      author: "Jess Lair",
      image: "/images/jess.jpg"
    },
    {
      text: "A single act of kindness throws out roots in all directions...",
      author: "Amelia Earhart",
      image: "/images/amelia.jpg"
    }
  ];

  const impactStats = [
    { icon: <BookOpen />, stat: "$25", description: "School supplies for a month" },
    { icon: <Home />, stat: "$50", description: "Shelter for a week" },
    { icon: <Heart />, stat: "$100", description: "Healthcare for a month" },
    { icon: <Users />, stat: "$250", description: "Support a family for a month" }
  ];

  return (
    <>
      <NavBar />
      <div className="donation-page">
        <div className="hero-section">
          <div className="overlay" />
          <div className="hero-text">
            <h1>Transform Lives, One Child at a Time</h1>
            <p>Help children dream, learn, and grow with your support.</p>
            <div className="hero-stats">
              <div><strong>2.5M+</strong><span>Children Helped</span></div>
              <div><strong>150+</strong><span>Countries Reached</span></div>
              <div><strong>98%</strong><span>Direct Impact</span></div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="left-column">
            <h2>Every Face Tells a Story</h2>
            <div className="image-cards">
              <div className="card card-1">
                <Users /><p>Maria, 8 — Now in school</p>
              </div>
              <div className="card card-2">
                <BookOpen /><p>Ahmad, 10 — Dreams of being a doctor</p>
              </div>
              <div className="card large">
                <Heart /><p>A Community Transformed</p>
              </div>
            </div>

            <h3>Words That Inspire</h3>
            {impactQuotes.map((q, i) => (
              <blockquote key={i}>
                "{q.text}"<br />
                <cite>— {q.author}</cite>
              </blockquote>
            ))}

            <h3>Your Impact in Action</h3>
            <div className="impact-grid">
              {impactStats.map((item, i) => (
                <div key={i} className="impact-card">
                  <div className="icon">{item.icon}</div>
                  <div>{item.stat}</div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="right-column">
            <div className="form-card">
              <h2>Make Your Donation</h2>
              
              {/* Success Message */}
              {submitted && (
                <div className="success">
                  <Check />
                  <span>Thank you! Your donation has been processed successfully. Your kindness changes lives.</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="error">
                  <AlertCircle />
                  <span>{error}</span>
                </div>
              )}

              <label>Amount *</label>
              <div className="amount-options">
                {['25', '50', '100'].map((amt) => (
                  <button 
                    key={amt} 
                    onClick={() => handleAmountSelect(amt)}
                    className={formData.amount === amt ? 'selected' : ''}
                    disabled={loading}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                name="amount" 
                placeholder="Custom amount"
                value={formData.amount} 
                onChange={handleInputChange}
                disabled={loading}
                min="1"
                step="0.01"
              />

              <label>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Enter your full name"
                disabled={loading}
                maxLength="100"
              />

              <label>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Enter your email address"
                disabled={loading}
                maxLength="100"
              />

              <label>Charity Focus *</label>
              <select 
                name="charity" 
                value={formData.charity} 
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Choose a focus area</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="shelter">Shelter</option>
                <option value="family">Family Support</option>
                <option value="general">Most Needed</option>
              </select>

              <button 
                onClick={handleSubmit}
                disabled={loading || !formData.amount || !formData.name || !formData.email || !formData.charity}
                className={loading ? 'loading' : ''}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  <>Donate ❤️</>
                )}
              </button>
              
              <p className="note">🔒 Secure & tax-deductible</p>
              <p className="required-note">* Required fields</p>
            </div>
          </div>
        </div>

        <div className="bottom-impact">
          <h2>The Ripple Effect of Your Kindness</h2>
          <div className="bottom-cards">
            <div><span>🌱</span><h4>Plant Seeds</h4><p>Hope that nurtures generations.</p></div>
            <div><span>🌊</span><h4>Create Waves</h4><p>Change entire communities.</p></div>
            <div><span>🌟</span><h4>Ignite Stars</h4><p>Light up the future.</p></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChildDonation;