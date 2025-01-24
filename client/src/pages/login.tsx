import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stack,
  TextField,
  Button,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Box,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { login } from '@/redux/authSlice';

const Login = () => {
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState<Record<string, string>>({});

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password, rememberMe }));
    if (login.rejected.match(result)) {
      const payload = result.payload as string;
      setMessage({
        ...(payload.includes('Email') && { email: payload }),
        ...(payload.includes('Password') && { password: payload }),
      });
      console.log(result.payload);
      return;
    }
    navigate('/')
  };

  return (
    <Container
      maxWidth='xs'
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={handleLogin} style={{ width: '100%' }}>
        <Stack spacing={3}>
          <Typography variant='h4' align='center'>
            Login
          </Typography>
          <Typography variant='body2' align='center'>
            Don&#39;t have an account?{' '}
            <Link
              to='/register'
              style={{ textDecoration: 'none', color: '#1976d2' }}
            >
              Register
            </Link>
          </Typography>
          <TextField
            label='Email'
            type='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage((prev) => ({ ...prev, email: '' }));
            }}
            fullWidth
            required
            error={!!message.email}
            helperText={message.email}
            autoFocus
          />
          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage((prev) => ({ ...prev, password: '' }));
            }}
            fullWidth
            error={!!message.password}
            helperText={message.password}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                size='small'
              />
            }
            label='Remember me'
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                disabled={loading}
              >
                Login
              </Button>
            )}
          </Box>
        </Stack>
      </form>
    </Container>
  );
};

export default Login;
