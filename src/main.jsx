import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Home from './pages/Home/Home.jsx'
import AboutUs from './pages/AboutUs/AboutUs.jsx'
import Login from './pages/Login/Login.jsx';
import Checkout from './pages/DatosTarjeta/Checkout.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/checkout' element={ <Checkout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
