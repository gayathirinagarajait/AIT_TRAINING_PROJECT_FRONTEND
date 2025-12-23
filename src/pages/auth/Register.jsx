import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  InputAdornment,
  Grid,
  Link,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';
import { registerUser } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import AppSnackbar from '../../components/common/AppSnackbar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Email is invalid';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await registerUser(form);

      setToast({
        open: true,
        message: 'Registration successful! Redirecting to login...',
        type: 'success',
      });

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Registration failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
                <PersonAddIcon />
              </Avatar>

              <Typography variant="h5" fontWeight={600} data-testid="register-title">
                Create Account
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Join our platform today
              </Typography>
            </Box>

            <Box component="form" onSubmit={submit} noValidate>
              {/* NAME */}
           <TextField
  fullWidth
  margin="normal"
  label="Full Name"
  value={form.name}
  error={!!errors.name}
  helperText={errors.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <PersonIcon />
        </InputAdornment>
      ),
    },
    htmlInput: {
      "data-testid": "name",
    },
  }}
/>


              {/* EMAIL */}
             <TextField
  fullWidth
  margin="normal"
  label="Email Address"
  value={form.email}
  error={!!errors.email}
  helperText={errors.email}
  onChange={(e) => setForm({ ...form, email: e.target.value })}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <EmailIcon />
        </InputAdornment>
      ),
    },
    htmlInput: {
      "data-testid": "email",
    },
  }}
/>


              {/* PASSWORD */}
              <TextField
  fullWidth
  margin="normal"
  type="password"
  label="Password"
  value={form.password}
  error={!!errors.password}
  helperText={errors.password}
  onChange={(e) => setForm({ ...form, password: e.target.value })}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <LockIcon />
        </InputAdornment>
      ),
    },
    htmlInput: {
      "data-testid": "password",
    },
  }}
/>


              {/* ROLE */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={form.role}
                  label="Role"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>

              {/* SUBMIT */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                data-testid="register-btn"
                sx={{ mt: 3 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Grid container justifyContent="center" mt={2}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component="button" onClick={() => navigate('/')}>
                    Sign In
                  </Link>
                </Typography>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>

      <Loader open={loading} />
      <AppSnackbar {...toast} onClose={() => setToast({ ...toast, open: false })} />
    </>
  );
}
