import React from 'react';

import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { EmailLogin } from './pages/Auth/EmailLogin';
import { LoginPassword } from './pages/Auth/LoginPassword';
import { Home } from './pages/Home';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { SignUpEmail } from './pages/Auth/SignUpEmail';
import { SignUpPassword } from './pages/Auth/SignUpPassword';
import { NewPassword } from './pages/Auth/NewPassword';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/loginEmail' element={<EmailLogin />} />
      <Route path='/loginPassword' element={<LoginPassword />} />
      <Route path='/home' element={<Home />} />
      <Route path='/forgotPwd' element={<ForgotPassword />} />
      <Route path='/signUpEmail' element={<SignUpEmail />} />
      <Route path='/signUpPwd' element={<SignUpPassword />} />
      <Route path='/newPwd' element={<NewPassword />} />
    </Routes>

  );
}

export default App;
