import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (filters) => {
    sessionStorage.setItem('productFilters', JSON.stringify(filters));
    const res = await api.get('/products', { params: filters });
    return res.data;
  }
);

const productSlice = createSlice({
  name: 'products', 
  initialState: { 
    list: [],
    loading: false,
    error: null,
    total: 0,
    page: 1
  },
  reducers: {
    clearProducts: (state) => {
      state.list = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
        state.total = action.payload.total || action.payload.length || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;