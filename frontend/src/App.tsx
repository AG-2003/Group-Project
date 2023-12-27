import React from 'react';

import './App.css';
import { LoginForm } from './components/LoginForm';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Auth/Login';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>

  );
}

export default App;
