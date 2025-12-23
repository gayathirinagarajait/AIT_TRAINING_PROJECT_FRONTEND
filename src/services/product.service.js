import api from './api';

/* 
   CREATE PRODUCT
*/
export const createProduct = async (data) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('price', String(data.price));
  formData.append('stock', String(data.stock));

  // images = File[]
  if (Array.isArray(data.images)) {
    data.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  return (await api.post('/products', formData)).data;
};

/* 
   UPDATE PRODUCT
 */
export const updateProduct = async (id, data) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append('name', data.name);
  }

  if (data.price !== undefined) {
    formData.append('price', String(data.price));
  }

  if (data.stock !== undefined) {
    formData.append('stock', String(data.stock));
  }

  // existing image filenames to KEEP
  if (Array.isArray(data.existingImages)) {
    data.existingImages.forEach((img) => {
      formData.append('existingImages', img);
    });
  }

  // new uploaded files
  if (Array.isArray(data.images)) {
    data.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  return (await api.put(`/products/${id}`, formData)).data;
};

/* 
   GET PRODUCTS
*/
export const getProducts = (params) =>
  api.get('/products', { params }).then((res) => res.data);

/* 
   DELETE PRODUCT
 */
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((res) => res.data);
