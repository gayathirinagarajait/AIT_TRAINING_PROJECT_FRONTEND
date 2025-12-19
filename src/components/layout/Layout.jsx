import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar - State managed here to control width transitions */}
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
      />
      
      {/* Main content area - Automatically fills remaining space */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // removed manual margin-left and calc width
          width: '100%', 
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Header onMenuClick={toggleSidebar} />
        
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            backgroundColor: '#F8FAFC', 
            width: '100%', 
            boxSizing: 'border-box' 
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}