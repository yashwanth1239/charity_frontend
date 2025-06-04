import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:8081/api/register', {
      email,
      password,
      phoneNumber,
    });

    const responseMessage = res.data;

    if (
      typeof responseMessage === 'string' &&
      responseMessage.toLowerCase().includes('already')
    ) {
      setMessage(responseMessage); // "Email already registered."
    } else {
      setMessage('Registration successful!');
      setTimeout(() => navigate('/home'), 1000);
    }
  } catch (error) {
    console.error('Registration error:', error);
    setMessage('Registration failed. Please try again.');
  }
};


  return (
    <div className="form-container sign-up">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="social-icons">
          <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
          <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
        </div>
        <span>or use your email for registration</span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {message && (
          <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '10px' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
