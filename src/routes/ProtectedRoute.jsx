import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function ProtectedRoute({ children }) {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);

  if (!isAuth) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
}
