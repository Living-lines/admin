import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Submitted:", formData);
    alert("Login Successful!");
    navigate("/main"); // navigate to main page
  };

  return (
    <div className="popup-overlay1" onClick={onClose}>
      <div className="card1" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn1" onClick={onClose}> ✖ </button>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <button><span>Login</span></button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
