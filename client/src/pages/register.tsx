import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stack,
  TextField,
  Button,
  Container,
  Typography,
  FormControlLabel,
  CircularProgress,
  Box,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import SimpleSnackbar from '@/components/snackbar';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'Seeker',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.name) {
      newErrors.name = 'Name is required.';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required.';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field-specific errors
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage('Signup successful!');
    } catch (e) {
      setMessage('Signup failed. Please try again.');
      console.log(e);
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={handleSignup} style={{ width: '100%' }}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center">
            Signup
          </Typography>
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Login
            </Link>
          </Typography>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
            required
          />
          <FormControl>
            <FormLabel>Role</FormLabel>
            <RadioGroup
              aria-labelledby="Account role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <Stack direction="row">
                <FormControlLabel value="Seeker" control={<Radio />} label="Seeker" />
                <FormControlLabel value="Provider" control={<Radio />} label="Provider" />
              </Stack>
            </RadioGroup>
          </FormControl>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button type="submit" fullWidth variant="contained">
              Signup
            </Button>
          )}
        </Stack>
      </form>
      <SimpleSnackbar
        message={message}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
      />
    </Container>
  );
};

export default Signup;
