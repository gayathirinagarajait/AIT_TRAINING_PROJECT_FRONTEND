import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { updateUser } from '../../services/user.service';

export default function UserForm({ selectedUser, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'USER',
  });

  useEffect(() => {
    if (selectedUser) {
      setForm({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  const submit = async () => {
    await updateUser(selectedUser._id, form);
    onSuccess();
  };

  if (!selectedUser) return null;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <TextField
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextField
        select
        label="Role"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <MenuItem value="ADMIN">ADMIN</MenuItem>
        <MenuItem value="USER">USER</MenuItem>
      </TextField>
      <Button variant="contained" onClick={submit}>
        Update
      </Button>
    </Box>
  );
}
