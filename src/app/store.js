import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/auth.slice';
import productReducer from '../redux/slices/product.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});
