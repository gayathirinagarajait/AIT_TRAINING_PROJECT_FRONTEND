import api from './api';

// Register
export const registerUser = (data) =>
  api.post('/auth/register', data).then(res => res.data);

// Login
export const loginUser = (data) =>
  api.post('/auth/login', data).then(res => res.data);

// Forgot password
export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then(res => res.data);

// Verify OTP and reset password
export const resetPassword = (data) =>
  api.post('/auth/verify-otp', data).then(res => res.data);
