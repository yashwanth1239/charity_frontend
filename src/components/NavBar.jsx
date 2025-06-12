// src/components/NavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [donateOpen, setDonateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">CHARITY</div>

      <ul className="navbar-menu">
        <li><Link to="/about">About</Link></li>

        <li className="dropdown"
            onMouseEnter={() => setDonateOpen(true)}
            onMouseLeave={() => setDonateOpen(false)}>
          <span>Donate ▾</span>
          {donateOpen && (
            <ul className="dropdown-content">
              <li><Link to="/donate/animals">Animal Donation</Link></li>
              <li><Link to="/donate/children">Children Donation</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/history">History</Link></li>

        <li className="profile"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}>
          <span className="profile-icon">👤</span>
          {profileOpen && (
            <ul className="profile-dropdown">
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;