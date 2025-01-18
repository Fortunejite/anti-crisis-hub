import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/user.context';

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <Routes>
          <Route path='/' element={null} />
          <Route path='/about' element={null} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
