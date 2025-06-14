import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import ChildDonation from './pages/ChildDonation';
import Profile from './pages/Profile';
import About from './pages/About';
import AnimalDonation from './pages/AnimalDonation';
import History from './pages/History';
import Logout from './pages/Logout';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthContainer />} />
        <Route path="/auth/:mode" element={<AuthContainer />} />
        
        {/* Main application routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/donate/children" element={<ChildDonation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate/animals" element={<AnimalDonation />} />
        <Route path="/history" element={<History />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Default route - redirect to auth */}
        <Route path="/" element={<Navigate to="/auth/signin" replace />} />
        
        {/* Catch all other routes and redirect to auth */}
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;