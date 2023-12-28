import React from 'react';

import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { EmailLogin } from './pages/Auth/EmailLogin';
import { LoginPassword } from './pages/Auth/LoginPassword';
import { Home } from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/loginEmail' element={<EmailLogin />} />
      <Route path='/loginPassword' element={<LoginPassword />} />
      <Route path='/home' element={<Home />} />
    </Routes>

  );
}

export default App;
