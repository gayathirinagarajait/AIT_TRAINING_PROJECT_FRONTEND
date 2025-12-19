import { useEffect, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import UserTable from '../../components/users/UserTable';
import UserList from '../../components/users/UserList';
import UserForm from '../../components/users/UserForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import AppSnackbar from '../../components/common/AppSnackbar';
import { getUsers, deleteUser } from '../../services/user.service';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  // NEW
  const [view, setView] = useState('grid');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setToast({ 
        open: true, 
        message: 'Failed to load users', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(deleteTarget._id);
      setToast({ 
        open: true, 
        message: 'User deleted successfully', 
        type: 'success' 
      });
      loadUsers();
    } catch {
      setToast({ 
        open: true, 
        message: 'Delete failed', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleEditSuccess = (message = 'User updated successfully') => {
    setEditUser(null); // Reset edit form
    setToast({ 
      open: true, 
      message, 
      type: 'success' 
    });
    loadUsers(); // Refresh user list
  };

  const handleCancelEdit = () => {
    setEditUser(null);
  };

  return (
    <>
      {/* VIEW TOGGLE */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          {/* Optional: Add user button or title here */}
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, val) => val && setView(val)}
          size="small"
        >
          <ToggleButton value="list">List View</ToggleButton>
          <ToggleButton value="grid">Grid View</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* USER FORM - Always visible for editing */}
      {editUser && (
        <UserForm
          selectedUser={editUser}
          onSuccess={handleEditSuccess}
          onCancel={handleCancelEdit}
        />
      )}

      {/* CONDITIONAL VIEW */}
      {view === 'list' ? (
        <UserTable
          rows={users}
          onEdit={setEditUser}
          onDelete={setDeleteTarget}
        />
      ) : (
        <UserList
          rows={users}
          onEdit={setEditUser}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Loader open={loading} />
      <AppSnackbar 
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}