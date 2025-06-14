import React, { useState, useEffect } from 'react';
import './History.css';
import NavBar from '../components/NavBar';

const History = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Token management functions (same as Profile component)
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
    window.location.href = '/login';
  };

  const fetchDonationHistory = async () => {
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      handleTokenExpiry();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/donations/history', {
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
      setDonationHistory(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch donation history. Please try again.');
      console.error('Error fetching donation history:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (pdfUrl, donationId, charity) => {
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      handleTokenExpiry();
      return;
    }

    try {
      setDownloadingId(donationId);
      
      const response = await fetch(`http://localhost:8081${pdfUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleTokenExpiry();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to download receipt: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${charity}_receipt_${donationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (type) => {
    return type === 'Animal' ? '🐾' : '👶';
  };

  const getTypeClass = (type) => {
    return type === 'Animal' ? 'animal-type' : 'child-type';
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="history-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading donation history...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="history-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={fetchDonationHistory} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="history-container">
        <div className="history-header">
          <h1>Donation History</h1>
          <p className="history-subtitle">
            {donationHistory.length > 0 
              ? `You have made ${donationHistory.length} donation${donationHistory.length > 1 ? 's' : ''}`
              : 'No donations found'
            }
          </p>
        </div>

        {donationHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Donation History</h3>
            <p>You haven't made any donations yet. Start making a difference today!</p>
          </div>
        ) : (
          <div className="history-content">
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Charity</th>
                    <th>Amount</th>
                    <th>Donor Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((donation) => (
                    <tr key={donation.id} className={`donation-row ${getTypeClass(donation.type)}`}>
                      <td className="donation-id">#{donation.id}</td>
                      <td className="donation-type">
                        <span className="type-badge">
                          <span className="type-icon">{getTypeIcon(donation.type)}</span>
                          {donation.type}
                        </span>
                      </td>
                      <td className="charity-name">
                        <div className="charity-info">
                          <span className="charity-title">{donation.charity}</span>
                        </div>
                      </td>
                      <td className="donation-amount">
                        <span className="amount-value">{formatCurrency(donation.amount)}</span>
                      </td>
                      <td className="donor-name">
                        <div className="donor-info">
                          <span className="donor-title">{donation.name}</span>
                          <span className="donor-email">{donation.email}</span>
                        </div>
                      </td>
                      <td className="donation-actions">
                        <button
                          className={`download-btn ${downloadingId === donation.id ? 'downloading' : ''}`}
                          onClick={() => downloadReceipt(donation.pdfUrl, donation.id, donation.charity)}
                          disabled={downloadingId === donation.id}
                        >
                          {downloadingId === donation.id ? (
                            <>
                              <div className="btn-spinner"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <span className="download-icon">📄</span>
                              Download Receipt
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="history-summary">
              <div className="summary-cards">
                <div className="summary-card total-card">
                  <h4>Total Donations</h4>
                  <p className="summary-number">{donationHistory.length}</p>
                </div>
                <div className="summary-card amount-card">
                  <h4>Total Amount</h4>
                  <p className="summary-amount">
                    {formatCurrency(
                      donationHistory.reduce((total, donation) => total + donation.amount, 0)
                    )}
                  </p>
                </div>
                <div className="summary-card animal-card">
                  <h4>Animal Donations</h4>
                  <p className="summary-number">
                    {donationHistory.filter(d => d.type === 'Animal').length}
                  </p>
                </div>
                <div className="summary-card child-card">
                  <h4>Child Donations</h4>
                  <p className="summary-number">
                    {donationHistory.filter(d => d.type === 'Child').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default History;