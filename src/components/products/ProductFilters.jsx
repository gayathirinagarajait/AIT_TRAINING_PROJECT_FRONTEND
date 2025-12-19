import { TextField, Button, Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Clear } from '@mui/icons-material';

const DEFAULT_FILTERS = {
  name: '',
  stock: '',
  startDate: '',
  endDate: '',
};

export default function ProductFilters({ onApply, onReset, hasActiveFilters }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ✅ SAFE restore from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('productFilters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFilters({
          ...DEFAULT_FILTERS, // 👈 ensures no undefined
          ...parsed,
        });
      } catch (e) {
        console.error('Invalid filter cache', e);
      }
    }
  }, []);

  const handleApply = () => {
    const cleanFilters = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== '') {
        cleanFilters[key] = filters[key];
      }
    });

    sessionStorage.setItem('productFilters', JSON.stringify(cleanFilters));
    onApply(cleanFilters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    sessionStorage.removeItem('productFilters');
    onReset();
  };

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value ?? '', // 👈 NEVER undefined
    }));
  };

  const handleClearField = (field) => {
    setFilters((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const renderField = (props, field) => (
    <Box sx={{ position: 'relative' }}>
      <TextField {...props} value={filters[field]} />
      {filters[field] && (
        <IconButton
          size="small"
          onClick={() => handleClearField(field)}
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
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {renderField(
        {
          label: 'Name',
          size: 'small',
          onChange: handleChange('name'),
        },
        'name'
      )}

      {renderField(
        {
          label: 'Stock Available',
          placeholder: 'true / false',
          size: 'small',
          onChange: handleChange('stock'),
        },
        'stock'
      )}

      {renderField(
        {
          type: 'date',
          label: 'Start Date',
          InputLabelProps: { shrink: true },
          size: 'small',
          onChange: handleChange('startDate'),
        },
        'startDate'
      )}

      {renderField(
        {
          type: 'date',
          label: 'End Date',
          InputLabelProps: { shrink: true },
          size: 'small',
          onChange: handleChange('endDate'),
        },
        'endDate'
      )}

      <Button variant="contained" size="small" onClick={handleApply}>
        Apply
      </Button>

      <Button
        variant="outlined"
        size="small"
        onClick={handleReset}
        disabled={!hasActiveFilters}
      >
        Reset
      </Button>
    </Box>
  );
}
