import React from 'react';

import './App.css';
import { LoginForm } from './components/Auth/LoginForm';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { EmailLogin } from './pages/Auth/EmailLogin';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/loginEmail' element={<EmailLogin />} />
    </Routes>

  );
}

export default App;
