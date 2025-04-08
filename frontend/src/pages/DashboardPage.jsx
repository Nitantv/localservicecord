import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import "./PageStyles.css";

const DashboardPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("http://localhost:5000/dash/user/addresses", {
          credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        console.log("Fetched addresses:", data.addresses);

        if (Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [navigate]);

  const handleAddressChange = (event) => {
    const value = event.target.value;
    if (value === "add_new") {
      navigate("/add-address");
      return;
    }
    setSelectedAddress(value);
    console.log("Selected Address:", value);
  };

  return (
    <div>
      {/* Address Dropdown Section */}
      <div className="address-section">
        <label htmlFor="addressDropdown" className="dropdown-label">
          Select Address:
        </label>

        <select
          id="addressDropdown"
          value={selectedAddress}
          onChange={handleAddressChange}
          className="address-dropdown"
        >
          <option value="">Select...</option>
          {addresses.map((addr, index) => (
            <option key={index} value={addr}>
              {addr}
            </option>
          ))}
          {addresses.length < 3 && (
            <option value="add_new">➕ Add New Address</option>
          )}
        </select>
      </div>

      {/* Settings Dropdown */}
      <div className="top-right">
        <button className="settings-btn" onClick={() => setShowOptions(!showOptions)}>
          <FiSettings size={24} />
        </button>

        {showOptions && (
          <div className="dropdown">
            <button className="option">Change Email</button>
            <button className="option" onClick={() => navigate("/select-address")}>
              Change Address
            </button>
            <button
              className="option"
              onClick={() => {
                fetch("http://localhost:5000/auth/logout", {
                  method: "POST",
                  credentials: "include",
                }).then(() => {
                  navigate("/login");
                });
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
