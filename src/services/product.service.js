import api from './api';

// CREATE (with images)
export const createProduct = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data.images.forEach((img) => formData.append('images', img));
    } else {
      formData.append(key, data[key]);
    }
  });
  return (await api.post('/products', formData)).data;
};

// GET (filters)
export const getProducts = (params) =>
  api.get('/products', { params }).then(res => res.data);

// FIXED: Update now uses FormData like create
export const updateProduct = async (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      data.images.forEach((img) => formData.append('images', img));
    } else if (key === 'existingImages') {
      // Send existing images to keep
      data.existingImages.forEach((img) => formData.append('existingImages', img));
    } else {
      formData.append(key, data[key]);
    }
  });
  return (await api.put(`/products/${id}`, formData)).data;
};

// DELETE
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then(res => res.data);
