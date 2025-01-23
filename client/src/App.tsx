import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/register';
import { useAppDispatch } from './hooks/redux.hook';
import { backendAPI } from './utils/backendAPI';
import { logout, setUser } from './redux/authSlice';
import Home from './pages/home';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const revalidateUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          const res = await backendAPI.get('/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setUser(res.data));
        } catch (e) {
          console.error('Revailidation failed:', e);
          dispatch(logout());
        }
      }
    };

    revalidateUser();
  }, [dispatch]);
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={null} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
