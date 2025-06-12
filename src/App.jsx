import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Home from './pages/Home';import './App.css'; 
import ContactUs from './pages/ContactUs';
import ChildDonation from './pages/ChildDonation';
import Profile from './pages/Profile';
import About from './pages/About';
import AnimalDonation from './pages/AnimalDonation';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/donate/children" element={<ChildDonation />} />
        <Route path = "/profile" element = {<Profile />}/>
        <Route path="/About" element = {<About />}/>
        <Route path="/donate/animals" element = {<AnimalDonation />}/>
      </Routes>
    </Router>
  );
};

export default App;
