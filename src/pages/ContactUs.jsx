import React, { useState } from 'react';
import { Phone, Mail, Send } from 'lucide-react';
import './ContactUs.css';
import NavBar from '../components/NavBar'; // Adjust if needed

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    charity: '',
    message: ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { name, email, charity, message } = formData;

    if (name && email && charity && message) {
      try {
        const response = await fetch('http://localhost:8081/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setStatusType('success');
          setStatusMessage('Message sent successfully!');
          setFormData({ name: '', email: '', charity: '', message: '' });
        } else {
          const errorData = await response.json();
          setStatusType('error');
          setStatusMessage('Failed to send message: ' + (errorData.message || response.statusText));
        }
      } catch (error) {
        setStatusType('error');
        setStatusMessage('Error connecting to server: ' + error.message);
      }
    } else {
      setStatusType('error');
      setStatusMessage('Please fill in all fields.');
    }
  };

  return (
    <>
      <NavBar />

      <div className="contact-container">
        <div className="contact-card">
          <div className="contact-grid">
            <div className="form-section">
              <br/><br/><br/><br/><br/><br/>
              <h1 className="form-title">Send us a Message</h1>
              <p className="form-subtitle">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Charity Name</label>
                  <input
                    type="text"
                    name="charity"
                    value={formData.charity}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter your charity name"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="field-textarea"
                    placeholder="Enter your message here..."
                  />
                </div>

                <button onClick={handleSubmit} className="submit-button">
                  <Send size={20} />
                  Send Message
                </button>

                {statusMessage && (
                  <p
                    className={`status-message ${statusType === 'success' ? 'success' : 'error'}`}
                    style={{ marginTop: '12px' }}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info Side */}
            <div className="contact-info-section">
              <br/><br/><br/>
              <h2 className="contact-info-title">Get in Touch</h2>
              <p className="contact-info-subtitle">
                Have questions or need assistance? We're here to help!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon"><Phone size={24} /></div>
                  <div className="contact-details">
                    <h3 className="contact-method-title">Phone</h3>
                    <p className="contact-method-info">+91 9392598636</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon"><Mail size={24} /></div>
                  <div className="contact-details">
                    <h3 className="contact-method-title">Email</h3>
                    <p className="contact-method-info">contact@company.com</p>
                  </div>
                </div>
              </div>

              <div className="decorative-elements">
                <div className="decoration decoration-1"></div>
                <div className="decoration decoration-2"></div>
                <div className="decoration decoration-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;