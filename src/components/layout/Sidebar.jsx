import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Toolbar,
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 240;
const collapsedWidth = 64;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((s) => s.auth.role);

  const handleToggle = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Products',
      icon: <InventoryIcon />,
      path: '/products',
      subItems: [
        { text: 'All Products', path: '/products' },
      
      ],
    },
    ...(role === 'ADMIN' ? [{
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/users',
      subItems: [
        { text: 'All Users', path: '/users' },
    
      ],
    }] : []),
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          minHeight: '64px !important',
        }}
      >
        {open ? (
          <>
            <Typography variant="h6" noWrap>
             WelCome
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      
      <List sx={{ px: open ? 1 : 0.5 }}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItemButton
              onClick={() => {
                if (item.subItems) {
                  handleToggle(item.text);
                } else {
                  handleNavigation(item.path);
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                mx: 0.5,
                justifyContent: open ? 'initial' : 'center',
                minHeight: 48,
                px: open ? 2.5 : 1.5,
                bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
                color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'primary.main' : 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                  {item.subItems && (
                    expandedItems[item.text] ? <ExpandLess /> : <ExpandMore />
                  )}
                </>
              )}
            </ListItemButton>
            
            {open && item.subItems && (
              <Collapse in={expandedItems[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      onClick={() => handleNavigation(subItem.path)}
                      sx={{
                        pl: 6,
                        borderRadius: 1,
                        mb: 0.5,
                        mx: 0.5,
                        bgcolor: isActive(subItem.path) ? 'primary.light' : 'transparent',
                        color: isActive(subItem.path) ? 'primary.contrastText' : 'inherit',
                        '&:hover': {
                          bgcolor: isActive(subItem.path) ? 'primary.main' : 'action.hover',
                        },
                      }}
                    >
                      <ListItemText 
                        primary={subItem.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive(subItem.path) ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1200 }}>
          <IconButton
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}