import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// --- PAGE IMPORTS ---
// Ensure the case (Capital Letters) matches your file names exactly
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Invite from './pages/Invite';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Flashy Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Registration Form */}
        <Route path="/register" element={<Register />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        
        {/* The VIP Ticket */}
        <Route path="/invite" element={<Invite />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);