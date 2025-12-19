import {
  Box,
  Button,
  TextField,
  Typography,
  FormHelperText,
  Chip,
  Stack,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { createProduct, updateProduct } from '../../services/product.service';
import Loader from '../common/Loader';
import AppSnackbar from '../common/AppSnackbar';

export default function ProductForm({ selectedProduct, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
  });
  const [newImages, setNewImages] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const fileInputRef = useRef(null);

  // Prefill data when editing
  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      });
      setExistingImages(Array.isArray(selectedProduct.images) ? selectedProduct.images : []);
      setNewImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      resetForm();
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const resetForm = () => {
    setForm({ name: '', price: '', stock: '' });
    setNewImages([]);
    setExistingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // prepare data in format service expects
  const submit = async () => {
    try {
      setLoading(true);

      const submitData = {
        name: form.name,
        price: form.price,
        stock: form.stock,
        existingImages, 
        images: newImages, 
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct._id, submitData);
        setToast({ open: true, message: 'Product updated successfully', type: 'success' });
      } else {
        await createProduct(submitData);
        setToast({ open: true, message: 'Product created successfully', type: 'success' });
      }

      onSuccess();
      resetForm();
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Operation failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" mb={2}>
          {selectedProduct ? 'Update Product' : 'Create Product'}
        </Typography>

        <TextField
          label="Product Name"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          margin="normal"
          value={form.price}
          onChange={handleChange}
          required
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />

        <TextField
          label="Stock"
          name="stock"
          type="number"
          fullWidth
          margin="normal"
          value={form.stock}
          onChange={handleChange}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />

        {/* EXISTING IMAGES - Show during update */}
        {selectedProduct && existingImages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" mb={1}>Current Images:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              {existingImages.map((imageUrl, index) => (
                <Chip
                  key={index}
                  label={`Image ${index + 1}`}
                  onDelete={() => removeExistingImage(index)}
                  avatar={
                    <img 
                      src={imageUrl} 
                      alt="product"
                      style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 12 }}
                    />
                  }
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* NEW IMAGE UPLOAD */}
        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'block', marginTop: 8 }}
          />
          <FormHelperText>
            New files to add: {newImages.length} {newImages.length === 1 ? 'file' : 'files'}
            {newImages.length > 0 && (
              <Stack component="span" spacing={0.5} sx={{ ml: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                {newImages.map((img, idx) => (
                  <div key={idx}>{img.name}</div>
                ))}
              </Stack>
            )}
          </FormHelperText>
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={submit}
          disabled={!form.name || !form.price || !form.stock || loading}
        >
          {loading ? 'Processing...' : (selectedProduct ? 'Update Product' : 'Create Product')}
        </Button>
      </Box>

      <Loader open={loading} />
      <AppSnackbar
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}
