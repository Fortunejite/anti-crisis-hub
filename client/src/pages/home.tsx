import { useAppSelector } from '@/hooks/redux.hook';
import { Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  if (!user){
    navigate('/login');
    return null;
  }
  return (
    <div>
      <Typography variant='h1'>Welcome {user.name}</Typography>
    </div>
  );
};

export default Home;
