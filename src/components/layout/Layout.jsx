import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Sidebar widths
  const drawerWidth = 240;
  const collapsedWidth = 64;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
      />
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          ml: isMobile ? 0 : (sidebarOpen ? `${drawerWidth}px` : `${collapsedWidth}px`),
          transition: theme.transitions.create(['margin-left', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />
        
        {/* Content */}
        <Box
          sx={{
            flexGrow: 2,
            p: 2,
            backgroundColor: 'background.default',
            overflow: 'auto',
            width: '90%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}