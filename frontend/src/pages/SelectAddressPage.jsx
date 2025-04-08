import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SelectAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch addresses from the backend
    const fetchAddresses = async () => {
      try {
        const response = await fetch("http://localhost:5000/dash/user/addresses", {
          method: "GET",
          credentials: "include", // Ensures authentication
        });
        if (response.status === 401 || response.status === 403) {
          // If unauthorized or forbidden, redirect to login
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setAddresses(data.addresses || []);
      } catch (error) {
        console.log(error);
        alert("Unauthorized! Redirecting to login.");
        navigate("/login");
      }
    };

    fetchAddresses();
  }, []);

  const handleSelect = () => {
    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }
    //navigate(`/change-address?selected=${encodeURIComponent(selectedAddress)}`);
  };

  return (
    <div className="page-container">
      <h2>Select an Address</h2>
      <div className="address-list">
        {addresses.map((addr, index) => (
          <label key={index} className="address-option">
            <input
              type="radio"
              name="address"
              value={addr}
              onChange={(e) => setSelectedAddress(e.target.value)}
            />
            {addr}
          </label>
        ))}
      </div>
      <button className="btn" onClick={handleSelect}>Next</button>
    </div>
  );
};

export default SelectAddressPage;
