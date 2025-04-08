import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const RoleSelectionPage = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = () => {
    if (!role) {
      alert("Please select a role!");
      return;
    }
    localStorage.setItem("selectedRole", role); // ✅ Save role in localStorage
    navigate("/login");
  };

  return (
    <div className="page-container">
      <h1 className="title">Select Your Role</h1>
      <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="customer">Customer</option>
        <option value="maid">Maid</option>
        <option value="carpenter">Carpenter</option>
        <option value="laundry">Laundry Worker</option>
      </select>
      <button className="btn" onClick={handleRoleSelection}>Proceed to Login</button>
    </div>
  );
};

export default RoleSelectionPage;
