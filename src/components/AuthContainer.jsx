import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import TogglePanel from './TogglePanel';
//import './AuthContainer.css'; // Move your CSS here or import globally

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <SignUpForm />
      <SignInForm />
      <TogglePanel setIsActive={setIsActive} />
    </div>
  );
};

export default AuthContainer;
