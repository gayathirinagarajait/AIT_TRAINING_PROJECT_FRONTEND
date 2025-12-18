import { useEffect, useState } from 'react';
import UserTable from '../../components/users/UserTable';
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

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(deleteTarget._id);
      setToast({ open: true, message: 'User deleted successfully', type: 'success' });
      loadUsers();
    } catch {
      setToast({ open: true, message: 'Delete failed', type: 'error' });
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <UserForm selectedUser={editUser} onSuccess={loadUsers} />
      <UserTable rows={users} onEdit={setEditUser} onDelete={setDeleteTarget} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Loader open={loading} />
      <AppSnackbar {...toast} onClose={() => setToast({ ...toast, open: false })} />
    </>
  );
}
