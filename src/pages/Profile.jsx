import React, { useState, useEffect } from 'react';
import './Profile.css';
import "../components/NavBar";
import NavBar from '../components/NavBar';
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token management functions
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

  const fetchProfileData = async () => {
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      handleTokenExpiry();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        handleTokenExpiry();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profile data. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchProfileData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h3>No Profile Data</h3>
          <p>Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
   <>
      <NavBar />
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-avatar">
          <span>{profileData.email.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Information Section */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-table">
            <div className="info-row">
              <div className="info-label">Email Address</div>
              <div className="info-value">{profileData.email}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone Number</div>
              <div className="info-value">{profileData.phoneNumber}</div>
            </div>
          </div>
        </div>

        {/* Donation Statistics Section */}
        <div className="profile-section">
          <h2>Donation Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card animal-card">
              <div className="stat-icon">🐾</div>
              <div className="stat-content">
                <h3>Animal Donations</h3>
                <div className="stat-number">{formatNumber(profileData.animalDonationCount)}</div>
                <div className="stat-label">Total Donations</div>
              </div>
            </div>
            
            <div className="stat-card child-card">
              <div className="stat-icon">👶</div>
              <div className="stat-content">
                <h3>Child Support Donations</h3>
                <div className="stat-number">{formatNumber(profileData.childDonationCount)}</div>
                <div className="stat-label">Total Donations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Amounts Section */}
        <div className="profile-section">
          <h2>Donation Summary</h2>
          <div className="donation-summary">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Donations</th>
                  <th>Total Amount</th>
                  <th>Average per Donation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="animal-row">
                  <td>
                    <span className="category-icon">🐾</span>
                    Animal Welfare
                  </td>
                  <td>{formatNumber(profileData.animalDonationCount)}</td>
                  <td className="amount">{formatCurrency(profileData.totalAnimalDonationAmount)}</td>
                  <td className="amount">
                    {profileData.animalDonationCount > 0 
                      ? formatCurrency(profileData.totalAnimalDonationAmount / profileData.animalDonationCount)
                      : formatCurrency(0)
                    }
                  </td>
                </tr>
                <tr className="child-row">
                  <td>
                    <span className="category-icon">👶</span>
                    Child Support
                  </td>
                  <td>{formatNumber(profileData.childDonationCount)}</td>
                  <td className="amount">{formatCurrency(profileData.totalChildDonationAmount)}</td>
                  <td className="amount">
                    {profileData.childDonationCount > 0 
                      ? formatCurrency(profileData.totalChildDonationAmount / profileData.childDonationCount)
                      : formatCurrency(0)
                    }
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{formatNumber(profileData.animalDonationCount + profileData.childDonationCount)}</strong></td>
                  <td className="amount"><strong>{formatCurrency(profileData.totalAnimalDonationAmount + profileData.totalChildDonationAmount)}</strong></td>
                  <td className="amount">
                    <strong>
                      {(profileData.animalDonationCount + profileData.childDonationCount) > 0 
                        ? formatCurrency((profileData.totalAnimalDonationAmount + profileData.totalChildDonationAmount) / (profileData.animalDonationCount + profileData.childDonationCount))
                        : formatCurrency(0)
                      }
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="profile-section">
          <h2>Your Impact</h2>
          <div className="impact-summary">
            <div className="impact-card">
              <h4>Total Contribution</h4>
              <p className="impact-amount">
                {formatCurrency(profileData.totalAnimalDonationAmount + profileData.totalChildDonationAmount)}
              </p>
            </div>
            <div className="impact-card">
              <h4>Lives Touched</h4>
              <p className="impact-count">
                {formatNumber(profileData.animalDonationCount + profileData.childDonationCount)} donations made
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;