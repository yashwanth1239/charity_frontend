import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import TogglePanel from './TogglePanel';

const AuthContainer = () => {
  const { mode } = useParams(); // Get 'signin' or 'signup' from URL
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  // Set initial state based on URL
  useEffect(() => {
    if (mode === 'signup') {
      setIsActive(true);
    } else if (mode === 'signin') {
      setIsActive(false);
    } else {
      // Default to signin if no valid mode
      navigate('/auth/signin', { replace: true });
    }
  }, [mode, navigate]);

  // Custom toggle function that updates URL
  const handleToggle = (activeState) => {
    setIsActive(activeState);
    const newMode = activeState ? 'signup' : 'signin';
    navigate(`/auth/${newMode}`, { replace: true });
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <SignUpForm />
      <SignInForm />
      <TogglePanel setIsActive={handleToggle} />
    </div>
  );
};

export default AuthContainer;