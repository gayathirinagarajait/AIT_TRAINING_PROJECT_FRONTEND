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
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../services/auth.service';
import { loginSuccess } from '../../redux/slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import AppSnackbar from '../../components/common/AppSnackbar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ 
    open: false, 
    message: '', 
    type: 'success' 
  });

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(form);
      dispatch(loginSuccess(res));

      setToast({ 
        open: true, 
        message: 'Login successful! Redirecting...', 
        type: 'success' 
      });
      
      // Small delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Invalid email or password',
        type: 'error',
      });
     
     
      // Clear password on error
      setForm({ ...form, password: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit(e);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: { xs: 4, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              width: '100%',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
              border: '1px solid',
              borderColor: 'primary.light',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Sign in to your account
              </Typography>
            </Box>

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                onKeyDown={handleKeyDown}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment 
                      position="end" 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </InputAdornment>
                  ),
                }}
              />

             
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Link
                  component="button"
                  type="button"  
                  variant="body2"
                  onClick={() => navigate('/forgot-password')}
                  sx={{ color: 'primary.main' }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"  
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 1,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2 30%, #0d47a1 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #0a3d91 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

             
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component="button"
                      type="button"  
                      variant="body2"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Demo credentials hint */}
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              width: '100%',
              borderRadius: 1,
              fontSize: '0.875rem'
            }}
          >
            <Typography variant="body2">
              Demo: admin@example.com / password
            </Typography>
          </Alert>
        </Box>
      </Container>

      
      <Loader open={loading} />
      <AppSnackbar 
        open={toast.open} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </>
  );
}