import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductForm from '../../components/products/ProductForm';
import ProductTable from '../../components/products/ProductTable';
import ProductFilters from '../../components/products/ProductFilters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import AppSnackbar from '../../components/common/AppSnackbar';
import { fetchProducts } from '../../redux/slices/product.slice';
import { deleteProduct } from '../../services/product.service';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Stack,
} from '@mui/material';
import { Close, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { buildImageUrl } from '../../config/imageBase';

export default function Products() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products?.list || []);
  const loadingState = useSelector((state) => state.products?.loading || false);

  const [editProduct, setEditProduct] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  // Image modal states
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    const filters = JSON.parse(sessionStorage.getItem('productFilters')) || {};
    setActiveFilters(filters);
    dispatch(fetchProducts(filters));
  }, [dispatch]);

  const applyFilters = (filters) => {
    setActiveFilters(filters);
    sessionStorage.setItem('productFilters', JSON.stringify(filters));
    dispatch(fetchProducts(filters));
  };

  const resetFilters = () => {
    const emptyFilters = {};
    setActiveFilters(emptyFilters);
    sessionStorage.removeItem('productFilters');
    dispatch(fetchProducts(emptyFilters));
  };

  const refresh = () => {
    setEditProduct(null);
    const filters = JSON.parse(sessionStorage.getItem('productFilters')) || {};
    dispatch(fetchProducts(filters));
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(deleteItem._id);
      setToast({ open: true, message: 'Product deleted successfully', type: 'success' });
      refresh();
    } catch {
      setToast({ open: true, message: 'Delete failed', type: 'error' });
    } finally {
      setLoading(false);
      setDeleteItem(null);
    }
  };

  const hasActiveFilters = () => {
    return Object.values(activeFilters).some(
      value => value !== undefined && value !== null && value !== ''
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      switch (e.key) {
        case 'Escape':
          handleCloseImage();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        default:
          break;
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedProductImages, currentImageIndex]);

  // Handle image viewing
// Update handleViewImage in Products.js:
const handleViewImage = (product, imageUrlFromCell) => {
  
  // Handle different image data structures
  let fileNames = [];
  
  if (Array.isArray(product.images)) {
    fileNames = product.images.filter(img => img && img.trim() !== '');
  } else if (product.images && typeof product.images === 'string') {
    fileNames = [product.images];
  }
  
  
  // Build URLs
  const images = fileNames
    .map((name) => {
      const url = buildImageUrl(name);
      return url;
    })
    .filter(url => url !== null && url !== undefined);
  
  
  if (images.length === 0) {
    console.warn('No valid images found for product:', product.name);
    setToast({ 
      open: true, 
      message: 'No valid images found for this product', 
      type: 'warning' 
    });
    return;
  }

  // Find the clicked image
  const index = images.findIndex((img) => img === imageUrlFromCell);
  const startIndex = Math.max(index, 0);
  

  setSelectedProductImages(images);
  setCurrentImageIndex(startIndex);
  setSelectedImage(images[startIndex]);
};


  const handleCloseImage = () => {
    setSelectedImage(null);
    setSelectedProductImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedProductImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % selectedProductImages.length;
      setCurrentImageIndex(nextIndex);
      setSelectedImage(selectedProductImages[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    if (selectedProductImages.length > 0) {
      const prevIndex = (currentImageIndex - 1 + selectedProductImages.length) % selectedProductImages.length;
      setCurrentImageIndex(prevIndex);
      setSelectedImage(selectedProductImages[prevIndex]);
    }
  };

  return (
    <>
      {/* filter */}
      <ProductFilters
        onApply={applyFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters()}
      />

      {/* form */}
      <ProductForm selectedProduct={editProduct} onSuccess={refresh} />

      {/* table */}
      <ProductTable
        rows={products}
        onEdit={setEditProduct}
        onDelete={setDeleteItem}
        onViewImage={handleViewImage}
      />

      {/* delete confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />

      {/* image view model*/}
      <Modal
        open={Boolean(selectedImage && selectedProductImages.length > 0)}

        onClose={handleCloseImage}
        aria-labelledby="image-modal"
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: '1200px',
            height: '90vh',
            bgcolor: 'transparent',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" color="white">
              Product Image {selectedProductImages.length > 1
                ? `(${currentImageIndex + 1} of ${selectedProductImages.length})`
                : ''}
            </Typography>
            <IconButton
              onClick={handleCloseImage}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Image Container */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {selectedProductImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 20,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                  }}
                >
                  <NavigateBefore />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 20,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                  }}
                >
                  <NavigateNext />
                </IconButton>
              </>
            )}

{selectedImage && (
  <img
    src={selectedImage}
    alt="Product"
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    }}
    onError={(e) => {
      console.error('Image failed to load:', selectedImage);
      e.currentTarget.style.display = 'none';
    }}
  />
)}


          </Box>

          {selectedProductImages.length > 1 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="white" mb={1}>
                All Images
              </Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                {selectedProductImages.map((img, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setSelectedImage(img);
                    }}
                    sx={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      border:
                        index === currentImageIndex
                          ? '3px solid #1976d2'
                          : '1px solid #ccc',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: index === currentImageIndex ? 1 : 0.7,
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Modal>

      <Loader open={loading || loadingState} />
      <AppSnackbar
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}
