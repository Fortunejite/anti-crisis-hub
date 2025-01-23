import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/register';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={null} />
        <Route path='/about' element={null} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
