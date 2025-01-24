import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/register';
import Home from './pages/home';
import { useAppDispatch } from './hooks/redux.hook';
import { revalidateUser } from './redux/authSlice';
import ProtectedRoute from './components/protectedRoutes';
const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(revalidateUser());
  }, [dispatch]);
  return (
    <div className='App' style={{ minHeight: '100vh', width: '100vw' }}>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/about' element={<div>About Page</div>} />
      </Routes>
    </div>
  );
};

export default App;
