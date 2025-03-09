import React, { useState } from "react";
import "../components/styles/HiringPortal.css";
import { useNavigate } from "react-router-dom";

function HiringPortal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    position: "",
    education: "",
    collegeName: "",
    specialization: "",
    cgpa: "",
    graduationYear: "",
    skills: "",
    accessToPersonalComputer: "",
    preferredStartDate: "",
    time: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file") {
      setFormData({ ...formData, resume: files[0] }); // Store file object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.fullName || !formData.email || !formData.position || !formData.resume) {
      alert("Please complete all required fields.");
      return;
    }
  
    const formDataToSend = new FormData();
  for (const key in formData) {
  if (key === "resume") {
    formDataToSend.append(key, formData[key]); // Append file correctly
  } else {
    formDataToSend.append(key, formData[key]);
  }
}

  
    // Log FormData values to check if data is being sent properly
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }
  
    try {
      const response = await fetch("http://localhost:5000/apply", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (response.ok) {
        alert("Application submitted successfully!");
      } else {
        const errorMessage = await response.text();
        console.error("Error submitting application:", errorMessage);
        alert("Error submitting application: " + errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check console for details.");
    }
  };
  
  
  return (
    <div className="form-container">
      <h1 className="form-title">Application Form</h1>
      <form onSubmit={handleSubmit} className="form-wrapper">
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position:</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Select a Position</option>
            <option value="webDevelopment">Web Development</option>
            <option value="androidApplicationDevelopment">Android Application Development</option>
            <option value="backendDevelopment">Backend Development</option>
            <option value="fullStackDevelopment">Full-Stack Development</option>
            <option value="UI/UXDesign">UI/UX Design</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="resume">Upload Resume:</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default HiringPortal;
