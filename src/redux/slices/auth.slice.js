import { createSlice } from '@reduxjs/toolkit';
import { decodeToken } from '../../utils/jwt.util';

// Load token from storage
const token = localStorage.getItem('token');
const decoded = decodeToken(token);

const initialState = {
  token: token,
  role: decoded?.role || null,
  email: decoded?.email || null, 
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const token = action.payload.token;
      const decoded = decodeToken(token);

      state.token = token;
      state.role = decoded?.role || null;
      state.email = decoded?.email || null;
      state.isAuthenticated = true;

      localStorage.setItem('token', token);
    },

    logout() {
      localStorage.clear();
      return {
        token: null,
        role: null,
        email: null,
        isAuthenticated: false,
      };
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
