import { Button, MenuItem, TextField, Stack, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { updateUser } from '../../services/user.service';
import { Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';

export default function UserForm({ selectedUser, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'USER',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setForm({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || 'USER',
      });
    }
  }, [selectedUser]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await updateUser(selectedUser._id, form);
      
      // Reset form
      setForm({
        name: '',
        email: '',
        role: 'USER',
      });
      
      // Call onSuccess with message
      if (onSuccess) {
        onSuccess(`User "${form.name}" updated successfully`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      
      // You could show error in form
      setErrors({
        submit: error.message || 'Failed to update user'
      });
      
      if (onSuccess) {
        onSuccess('Failed to update user', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!selectedUser) return null;

  return (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <EditIcon color="primary" />
          <Typography variant="h6" color="primary">
            Edit User: {selectedUser.name}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            size="small"
          />
          
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={handleChange('role')}
            error={!!errors.role}
            helperText={errors.role}
            fullWidth
            size="small"
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="MANAGER">MANAGER</MenuItem>
            <MenuItem value="EDITOR">EDITOR</MenuItem>
          </TextField>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
              startIcon={<EditIcon />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
        
        {errors.submit && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {errors.submit}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}