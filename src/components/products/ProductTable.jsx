import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { buildImageUrl } from '../../config/imageBase';

export default function ProductTable({
  rows = [],
  onEdit,
  onDelete,
  onViewImage,
}) {
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) =>
        params?.value ? `₹${Number(params.value).toFixed(2)}` : '—',
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
    },

{
  field: 'images',
  headerName: 'Image',
  flex: 1,
  sortable: false,
  renderCell: (params) => {
    const row = params?.row;
    const newLocal = '—';
    if (!row) return newLocal;

    // Handle different possible image data structures
    let imageArray = [];
    
    if (Array.isArray(row.images)) {
      imageArray = row.images.filter(img => img && img.trim() !== '');
    } else if (row.images && typeof row.images === 'string') {
      imageArray = [row.images];
    }

    const firstImage = imageArray.length > 0 ? imageArray[0] : null;
    const imageUrl = buildImageUrl(firstImage);

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {imageUrl ? (
          <>
            <Avatar
              src={imageUrl}
              alt={row.name}
              variant="rounded"
              sx={{
                width: 42,
                height: 42,
                cursor: 'pointer',
                border: '1px solid #ddd',
                bgcolor: 'grey.100',
              }}
              onClick={() => onViewImage && onViewImage(row, imageUrl)}
              // Add onError handler for broken images
              imgProps={{
                onError: (e) => {
                  console.warn('Image failed to load:', imageUrl);
                  e.target.style.display = 'none';
                  e.target.parentElement.querySelector('.MuiSvgIcon-root')?.remove();
                }
              }}
            />

            <IconButton
              size="small"
              onClick={() => onViewImage && onViewImage(row, imageUrl)}
              title="View Image"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Typography variant="caption" color="text.secondary">
            No Image
          </Typography>
        )}
      </Stack>
    );
  },
},
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,

      //renderCell is SAFER than valueGetter
      renderCell: (params) => {
        const row = params?.row;
        if (!row) return '—';

        const dateValue = row.createdAt || row.updatedAt;
        if (!dateValue) return '—';

        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return 'Invalid';

        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const row = params?.row;
        if (!row) return null;

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdit(row)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onDelete(row)}
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        Total Products: {Array.isArray(rows) ? rows.length : 0}
      </Typography>

      <DataGrid
        rows={Array.isArray(rows) ? rows : []} 
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        getRowId={(row) => row?._id || row?.id} 
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
    </Box>
  );
}
