import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/auth.slice';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar 
      position="static"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side: Menu button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && onMenuClick && (
            <IconButton
              color="inherit"
              onClick={onMenuClick}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div">
            Product Management
          </Typography>
        </Box>

        {/* Right side: User info and logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircle />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.name || user.email?.split('@')[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
          </Box>
          
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleLogout}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}