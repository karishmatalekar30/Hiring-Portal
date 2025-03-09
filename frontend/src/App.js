import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HiringPortal from "./components/HiringPortal";
import './App.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HiringPortal />} />
      </Routes>
    </Router>
  );;
}

export default App;
