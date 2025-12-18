import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Products from '../pages/products/Products';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Users from '../pages/users/Users';
import Dashboard from '../pages/dashboard/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes without layout */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes with layout */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
         
              <Products />
       
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleRoute role="ADMIN">
           
                <Users />
          
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
          
              <Dashboard />
         
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}