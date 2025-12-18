import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/user.service';
import { getProducts } from '../../services/product.service';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Import your images
import totalUsersImage from '../../assets/images/totaluser.jpg';
import totalProductsImage from '../../assets/images/totalproducts.jpg';
import productsInStockImage from '../../assets/images/productinstock.jpg';

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    stockProducts: 0,
      lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const users = await getUsers();
        const products = await getProducts({});
        const stockProducts = products.filter(p => p.stock > 0);
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);

        setStats({
          users: users.length,
          products: products.length,
          stockProducts: stockProducts.length,
          lowStockProducts: lowStockProducts.length,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const cardData = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
      illustration: totalUsersImage,
      trend: '+12%',
      description: 'Active accounts',
      suffix: '',
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: <InventoryIcon />,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
      illustration: totalProductsImage,
      trend: '+8%',
      description: 'All products in catalog',
      suffix: '',
    },
    {
      title: 'Products In Stock',
      value: stats.stockProducts,
      icon: <StorefrontIcon />,
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
      illustration: productsInStockImage,
      trend: '+5%',
      description: 'Available for purchase',
      suffix: '',
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockProducts,
      icon: <LocalShippingIcon />,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
      trend: stats.lowStockProducts > 0 ? 'Needs attention' : 'All good',
      description: 'Products below 10 units',
      suffix: '',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 600,
        mb: 4,
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <TrendingUpIcon /> Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                borderRadius: 3,
                overflow: 'visible',
                boxShadow: `0 10px 30px ${alpha(card.color, 0.15)}`,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 15px 40px ${alpha(card.color, 0.25)}`,
                },
                border: `1px solid ${alpha(card.color, 0.1)}`,
                position: 'relative',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: card.gradient,
                  clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                  opacity: 0.1,
                }}
              />
              
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        mt: 1,
                        background: card.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {card.value.toLocaleString()}
                      {card.suffix && <Typography component="span" variant="h5" sx={{ ml: 0.5 }}>{card.suffix}</Typography>}
                    </Typography>
                  </Box>
                  
                  <Avatar
                    sx={{
                      bgcolor: alpha(card.color, 0.1),
                      color: card.color,
                      width: 56,
                      height: 56,
                      boxShadow: `0 5px 15px ${alpha(card.color, 0.2)}`,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>

                {/* Image Display Section */}
                {card.illustration ? (
                  <Box
                    sx={{
                      height: 100,
                      mb: 2,
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={card.illustration}
                      alt={card.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, transparent 0%, ${alpha(card.color, 0.1)} 100%)`,
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 80,
                      mb: 2,
                      borderRadius: 2,
                      background: card.gradient,
                      opacity: 0.08,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: alpha(card.color, 0.2),
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: alpha(card.color, 0.2),
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.85rem',
                    }}
                  >
                    {card.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {card.trend.includes('+') || card.trend.includes('good') ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 600,
                        color: card.trend.includes('+') || card.trend.includes('good') 
                          ? theme.palette.success.main 
                          : theme.palette.error.main,
                      }}
                    >
                      {card.trend}
                    </Typography>
                  </Box>
                </Box>

                {card.title === 'Products In Stock' && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stats.stockProducts / stats.products) * 100 || 0}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(card.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          background: card.gradient,
                          borderRadius: 3,
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.palette.text.secondary }}>
                      {Math.round((stats.stockProducts / stats.products) * 100) || 0}% of total products
                    </Typography>
                  </Box>
                )}

                {card.title === 'Low Stock Alert' && stats.lowStockProducts > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalShippingIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                    <Typography variant="caption" sx={{ color: theme.palette.warning.dark }}>
                      Consider restocking these items
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
                    <Typography variant="h5" color="error.main">
                      {stats.products - stats.stockProducts}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Stock Ratio</Typography>
                    <Typography variant="h5" color="success.main">
                      {Math.round((stats.stockProducts / stats.products) * 100) || 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">User:Product Ratio</Typography>
                    <Typography variant="h5" color="info.main">
                      {stats.users > 0 ? (stats.products / stats.users).toFixed(1) : 0}:1
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Low Stock %</Typography>
                    <Typography variant="h5" color="warning.main">
                      {Math.round((stats.lowStockProducts / stats.products) * 100) || 0}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}