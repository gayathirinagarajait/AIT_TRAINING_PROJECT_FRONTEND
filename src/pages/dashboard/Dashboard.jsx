import { 
  Box, Card, CardContent, Typography, Grid, Avatar, 
  LinearProgress, Divider, alpha, Container 
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/user.service';
import { getProducts } from '../../services/product.service';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, stockProducts: 0, lowStockProducts: 0 });
  const [loading, setLoading] = useState(true);

  const deepBlack = '#0F172A'; 
  const slateGrey = '#64748B';

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, products] = await Promise.all([getUsers(), getProducts({})]);
        setStats({
          users: users.length,
          products: products.length,
          stockProducts: products.filter(p => p.stock > 0).length,
          lowStockProducts: products.filter(p => p.stock > 0 && p.stock <= 10).length,
        });
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const topStats = [
    { title: 'Total Users', val: stats.users, icon: <PeopleAltIcon />, col: '#2563EB' },
    { title: 'Total Products', val: stats.products, icon: <Inventory2Icon />, col: '#059669' },
    { title: 'In-Stock Items', val: stats.stockProducts, icon: <StorefrontIcon />, col: '#7C3AED' },
    { title: 'Low Stock Alerts', val: stats.lowStockProducts, icon: <WarningAmberIcon />, col: '#DC2626' },
  ];

  if (loading) return <LinearProgress sx={{ width: '100%', height: 4 }} />;

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      p: { xs: 2, md: 5 },
      bgcolor: '#F8FAFC' 
    }}>
      <Container maxWidth="xl" disableGutters>
        
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: deepBlack, letterSpacing: '-0.04em' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="h6" sx={{ color: slateGrey, fontWeight: 500, mt: 1 }}>
            Monitoring system performance and inventory health.
          </Typography>
        </Box>

        {/* TOP ROW: 4 LARGE CARDS */}
        {/* TOP ROW: 4 LARGE CARDS */}
<Grid container spacing={4} sx={{ mb: 6 }}>
  {topStats.map((card, i) => (
    <Grid
      item
      key={i}
      sx={{
        width: 300,
        flexGrow: 0,
        mb: 4,
      }}
    >
      <Card
        sx={{
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: 5,
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
          transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <CardContent
          sx={{
            p: 5,
            textAlign: 'center',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(card.col, 0.1),
              color: card.col,
              mx: 'auto',
              mb: 3,
              width: 80,
              height: 80,
            }}
          >
            {card.icon}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: slateGrey,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontSize: '0.9rem',
            }}
          >
            {card.title}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 950,
              color: deepBlack,
              mt: 1,
              fontSize: '4rem',
            }}
          >
            {card.val}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}

          {/* BOTTOM ROW: MASSIVE HEALTH CARD */}
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: 5, 
              border: '1px solid #E2E8F0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 6 }}>
                  <Avatar sx={{ bgcolor: deepBlack, width: 60, height: 60 }}>
                    <ShowChartIcon sx={{ fontSize: 35 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: deepBlack }}>Inventory Health Metrics</Typography>
                    <Typography variant="body1" sx={{ color: slateGrey }}>Deep-dive analysis of your current stock performance</Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 6 }} />

                <Grid container spacing={4}>
                  {[
                    { label: 'Out of Stock', val: stats.products - stats.stockProducts, color: '#EF4444' },
                    { label: 'Stock Ratio', val: `${Math.round((stats.stockProducts / stats.products) * 100) || 0}%`, color: '#10B981' },
                    { label: 'Efficiency', val: stats.users > 0 ? (stats.products / stats.users).toFixed(1) : 0, color: '#3B82F6' },
                    { label: 'Active Alerts', val: stats.lowStockProducts, color: '#F59E0B' }
                  ].map((item, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                      <Box sx={{ 
                        p: 6, 
                        textAlign: 'center', 
                        borderRadius: 8, 
                        bgcolor: '#F8FAFC',
                        border: '1px solid #F1F5F9'
                      }}>
                        <Typography variant="h2" sx={{ fontWeight: 950, color: item.color, mb: 2, fontSize: '3.5rem' }}>
                          {item.val}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: deepBlack, textTransform: 'uppercase' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}