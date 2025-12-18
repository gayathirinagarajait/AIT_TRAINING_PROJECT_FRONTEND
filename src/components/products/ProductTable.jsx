import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Avatar, Stack, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { buildImageUrl } from '../../config/imageBase';

export default function ProductTable({ rows, onEdit, onDelete, onViewImage }) {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(2)}`
    },
    { field: 'stock', headerName: 'Stock', flex: 1 },
    {
      field: 'images',
      headerName: 'Image',
      flex: 1,
      renderCell: (params) => {
        const fileName =
          Array.isArray(params.row.images) && params.row.images.length > 0
            ? params.row.images[0]
            : params.row.images || '';

        const imageUrl = buildImageUrl(fileName);

        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            {imageUrl ? (
              <>
                <Avatar
                  src={imageUrl}
                  variant="rounded"
                  sx={{ width: 40, height: 40, cursor: 'pointer' }}
                  onClick={() => onViewImage && onViewImage(params.row, imageUrl)}
                />
                <IconButton
                  size="small"
                  onClick={() => onViewImage && onViewImage(params.row, imageUrl)}
                  title="View Image"
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
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
      valueGetter: (params) => {
        try {
          const dateString = params.row.createdAt || params.row.updatedAt || params.value;
          if (!dateString) return 'N/A';

          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Invalid Date';

          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        } catch (error) {
          console.error('Date parsing error:', error);
          return '';
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => onDelete(params.row)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        Total Products: {rows.length}
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        getRowId={(row) => row._id || row.id}
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
