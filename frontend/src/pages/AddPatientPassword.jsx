import React, { useState } from "react";
import axios from "axios";
import { Container, Card, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faAngleLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function PasswordMatch() {
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // Check if passwords match when the password field changes
    setPasswordsMatch(event.target.value === retypePassword);
  };

  const handleRetypePasswordChange = (event) => {
    setRetypePassword(event.target.value);
    // Check if passwords match when the retype password field changes
    setPasswordsMatch(password === event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };

  const handleSubmit = async () => {
    if (passwordsMatch) {
      // Send data to your server using Axios (Replace with your API endpoint)
      try {
       console.log(passwordsMatch);
        // Handle success or any other action after sending data
      } catch (error) {
        // Handle error if the request fails
        console.log(passwordsMatch);
        console.error("Error sending data:", error);
      }
    } else {
      alert("Passwords do not match. Please ensure they match before submitting.");
    }
  };

  return (
    <div>
      <h2>Password Matching Example</h2>
      <div>
        <label>Password:</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button onClick={togglePasswordVisibility}>
          {showPassword ? "Hide Password" : "Show Password"}
        </button>
      </div>
      <div>
        <label>Retype Password:</label>
        <input
          type={showRetypePassword ? "text" : "password"}
          placeholder="Retype password"
          value={retypePassword}
          onChange={handleRetypePasswordChange}
        />
        <button onClick={toggleRetypePasswordVisibility}>
          {showRetypePassword ? "Hide Password" : "Show Password"}
        </button>
      </div>
      {passwordsMatch ? (
        <p>Passwords match.</p>
      ) : (
        <p>Passwords do not match.</p>
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default PasswordMatch;
