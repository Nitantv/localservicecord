import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

const AddAddressPage = () => {
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!newAddress.trim()) {
      setError("Please enter a valid address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/dash/user/add-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for session-based auth
        body: JSON.stringify({ newAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add address.");
      }

      // Successfully added address
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Error adding address:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Address</h2>
      <form onSubmit={handleAddAddress}>
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter new address"
          className="input-field"
        />
        <button type="submit" className="submit-btn">
          Add Address
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default AddAddressPage;
