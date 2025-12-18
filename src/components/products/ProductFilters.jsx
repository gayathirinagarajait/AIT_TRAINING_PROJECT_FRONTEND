import { TextField, Button, Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Clear } from '@mui/icons-material';

export default function ProductFilters({ onApply, onReset, hasActiveFilters }) {
  const [filters, setFilters] = useState({
    name: '',
    stock: '',
    startDate: '',
    endDate: '',
  });

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('productFilters');
    if (saved) {
      setFilters(JSON.parse(saved));
    }
  }, []);

  const handleApply = () => {
    // Clean the filters (remove empty values)
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') {
        cleanFilters[key] = filters[key];
      }
    });
    
    sessionStorage.setItem('productFilters', JSON.stringify(cleanFilters));
    onApply(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      stock: '',
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    sessionStorage.removeItem('productFilters');
    onReset();
  };

  const handleClearField = (fieldName) => {
    setFilters({ ...filters, [fieldName]: '' });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 2, 
      p: 2, 
      backgroundColor: '#f5f5f5',
      borderRadius: 1,
      alignItems: 'center'
    }}>
      <Box sx={{ position: 'relative' }}>
        <TextField
          label="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          size="small"
        />
        {filters.name && (
          <IconButton
            size="small"
            onClick={() => handleClearField('name')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <TextField
          label="Stock Available"
          placeholder="true/false"
          value={filters.stock}
          onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
          size="small"
        />
        {filters.stock && (
          <IconButton
            size="small"
            onClick={() => handleClearField('stock')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          size="small"
        />
        {filters.startDate && (
          <IconButton
            size="small"
            onClick={() => handleClearField('startDate')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          size="small"
        />
        {filters.endDate && (
          <IconButton
            size="small"
            onClick={() => handleClearField('endDate')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Button 
        variant="contained" 
        onClick={handleApply}
        size="small"
      >
        Apply
      </Button>

      <Button 
        variant="outlined" 
        onClick={handleReset}
        disabled={!hasActiveFilters}
        size="small"
      >
        Reset
      </Button>
    </Box>
  );
}