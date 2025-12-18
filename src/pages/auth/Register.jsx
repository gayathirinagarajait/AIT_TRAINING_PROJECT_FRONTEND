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
  InputLabel
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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
    type: 'success' 
  });

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
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
      await registerUser(form);
      setToast({ 
        open: true, 
        message: 'Registration successful! Redirecting to login...', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
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
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                <PersonAddIcon />
              </Avatar>
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                Create Account
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Join our platform today
              </Typography>
            </Box>

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                onKeyPress={handleKeyPress}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={form.role}
                  label="Role"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <AdminPanelSettingsIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="USER">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      <span>User</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="ADMIN">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminPanelSettingsIcon fontSize="small" />
                      <span>Admin</span>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
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
        </Box>
      </Container>

      <Loader open={loading} />
      <AppSnackbar {...toast} onClose={() => setToast({ ...toast, open: false })} />
    </>
  );
}