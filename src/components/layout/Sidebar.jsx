import {
  Drawer, List, ListItemButton, ListItemText, ListItemIcon,
  IconButton, Box, Toolbar, Divider, useMediaQuery, useTheme, Typography
} from '@mui/material';
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon, Inventory as InventoryIcon, People as PeopleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 240;
const collapsedWidth = 64;

export default function Sidebar({ open, setOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((s) => s.auth.role);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    ...(role === 'ADMIN' ? [{ text: 'Users', icon: <PeopleIcon />, path: '/users' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', px: open ? 2 : 1 }}>
        {open ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Welcome</Typography>
            <IconButton onClick={() => setOpen(false)}><ChevronLeftIcon /></IconButton>
          </>
        ) : (
          <IconButton onClick={() => setOpen(true)}><MenuIcon /></IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2, mb: 1,
              justifyContent: open ? 'initial' : 'center',
              bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
              color: isActive(item.path) ? 'white' : 'inherit',
              '&:hover': { bgcolor: isActive(item.path) ? 'primary.dark' : 'action.hover' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'inherit' }}>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 700 : 500 }} />}
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', { duration: theme.transitions.duration.enteringScreen }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}