import React from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { Container, Typography, useColorScheme } from '@mui/material';

const Home = () => {
  const { user } = useAppSelector((state) => state.auth);
  const color = useColorScheme()
  color.setColorScheme('light')

  if (!user) return null; // Prevent rendering if redirection is ongoing.

  return (
    <Container maxWidth='md'>
      <Typography variant='h1' align='center'>
        Welcome {user.name}
      </Typography>
    </Container>
  );
};

export default Home;
