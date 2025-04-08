import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="title">Welcome to Our Service</h1>
      <button className="btn" onClick={() => navigate('/signup')}>Signup</button>
      <button className="btn" onClick={() => navigate('/login')}>Login</button>
    </div>
  );
};

export default StartPage;
