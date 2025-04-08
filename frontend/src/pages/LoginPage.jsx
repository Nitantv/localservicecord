import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const LoginPage = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!role) {
      alert('Please select a role!');
      return;
    }
    if (!username || !password) {
      alert('Please fill in all fields!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Send cookies with the request
        body: JSON.stringify({ username, password, role }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        navigate('/dashboard'); // ✅ Redirect after successful login
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred while logging in.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="title">Select Your Role</h1>

      {/* Role Selection */}
      {!role ? (
        <div className="role-selection">
          <button className="role-btn" onClick={() => setRole('Customer')}>Customer</button>
          <button className="role-btn" onClick={() => setRole('Maid')}>Maid</button>
          <button className="role-btn" onClick={() => setRole('Carpenter')}>Carpenter</button>
          <button className="role-btn" onClick={() => setRole('Laundry Worker')}>Laundry Worker</button>
        </div>
      ) : (
        <>
          {/* Login Form */}
          <h2 className="title">Login as {role}</h2>
          <input className="input-field" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn" onClick={handleLogin}>Login</button>
          <button className="btn-link" onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
