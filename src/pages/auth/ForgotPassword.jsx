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
import { forgotPassword } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import AppSnackbar from '../../components/common/AppSnackbar';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ 
    open: false, 
    message: '', 
    type: 'success' 
  });

  const validateEmail = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setToast({ 
        open: true, 
        message: 'OTP sent to your email. Redirecting...', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
      
    } catch {
      setToast({ 
        open: true, 
        message: 'Failed to send OTP. Please check your email.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
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
                  bgcolor: 'warning.main',
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                <VpnKeyIcon />
              </Avatar>
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                Reset Your Password
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                Enter your email address and we'll send you an OTP to reset your password.
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                onKeyDown={handleKeyDown}
                error={!!errors.email}
                helperText={errors.email}
                slotProps={{
                     input: {
                    'data-cy': 'email',
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                  },
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
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>

              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Remember your password?{' '}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate('/')}
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

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
              Check your spam folder if you don't see the email in your inbox.
            </Typography>
          </Alert>
        </Box>
      </Container>

      <Loader open={loading} />
      <AppSnackbar {...toast} onClose={() => setToast({ ...toast, open: false })} />
    </>
  );
}