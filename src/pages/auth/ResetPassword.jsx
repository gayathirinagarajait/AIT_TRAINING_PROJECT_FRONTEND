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
  Link
} from '@mui/material';
import { useState } from 'react';
import { resetPassword } from '../../services/auth.service';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import AppSnackbar from '../../components/common/AppSnackbar';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockResetIcon from '@mui/icons-material/LockReset';
import LockIcon from '@mui/icons-material/Lock';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';

  const [form, setForm] = useState({ 
    email: emailFromState, 
    otp: '', 
    newPassword: '',
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
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
    if (!form.otp) {
      newErrors.otp = 'OTP is required';
    } else if (form.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await resetPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword
      });
      setToast({ 
        open: true, 
        message: 'Password reset successful! Redirecting to login...', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch {
      setToast({ 
        open: true, 
        message: 'Invalid OTP or email. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit();
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
                  bgcolor: 'success.main',
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                <LockResetIcon />
              </Avatar>
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                Set New Password
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                Enter the OTP sent to your email and set a new password
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
                id="otp"
                label="OTP Code"
                name="otp"
                value={form.otp}
                onChange={(e) => {
                  setForm({ ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) });
                  if (errors.otp) setErrors({ ...errors, otp: '' });
                }}
                onKeyPress={handleKeyPress}
                error={!!errors.otp}
                helperText={errors.otp}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                value={form.newPassword}
                onChange={(e) => {
                  setForm({ ...form, newPassword: e.target.value });
                  if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                }}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                onKeyPress={handleKeyPress}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                onClick={submit}
                disabled={loading}
                sx={{
                  mt: 3,
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
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                <Grid item>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/forgot-password')}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Resend OTP
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/')}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Back to Login
                  </Link>
                </Grid>
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