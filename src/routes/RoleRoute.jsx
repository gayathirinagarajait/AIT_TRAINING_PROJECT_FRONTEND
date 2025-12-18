import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function RoleRoute({ role, children }) {
  const userRole = useSelector(s => s.auth.role);
  return userRole === role ? children : <Navigate to="/" />;
}


{/* <Route
  path="/admin/products"
  element={
    <RoleRoute role="ADMIN">
      <Products />
    </RoleRoute>
  }
/> */}
