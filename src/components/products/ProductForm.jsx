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

  /* PREFILL ON EDIT */
  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name ?? '',
        price: selectedProduct.price ?? '',
        stock: selectedProduct.stock ?? '',
      });

      setExistingImages(
        Array.isArray(selectedProduct.images) ? selectedProduct.images : []
      );

      setNewImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      resetForm();
    }
  }, [selectedProduct]);

  /* HANDLERS */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setNewImages((prev) => [...prev, ...files]);

    // ✅ reset input so same file can be added again
    e.target.value = '';
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({ name: '', price: '', stock: '' });
    setNewImages([]);
    setExistingImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* SUBMIT */
  const submit = async () => {
    try {
      setLoading(true);

      const payload = {
        name: form.name,
        price: form.price,
        stock: form.stock,
        existingImages,
        images: newImages,
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct._id, payload);
        setToast({ open: true, message: 'Product updated', type: 'success' });
      } else {
        await createProduct(payload);
        setToast({ open: true, message: 'Product created', type: 'success' });
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
        />

        {/* EXISTING IMAGES */}
        {selectedProduct && existingImages.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2">Existing Images</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {existingImages.map((img, index) => (
                <Chip
                  key={index}
                  label={`Image ${index + 1}`}
                  onDelete={() => removeExistingImage(index)}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* NEW IMAGES */}
        {newImages.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2">New Images</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {newImages.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => removeNewImage(index)}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* FILE INPUT */}
        <Box mt={2}>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <FormHelperText>
            Selected files: {newImages.length}
          </FormHelperText>
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Processing...' : selectedProduct ? 'Update' : 'Create'}
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
