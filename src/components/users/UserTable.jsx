import { DataGrid } from '@mui/x-data-grid';
import { Button, Stack } from '@mui/material';

export default function UserTable({ rows = [], onEdit, onDelete }) {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button data-cy="edit-user-btn"
          size="small" onClick={() => onEdit(params.row)}>
            Edit
          </Button>
          <Button
          data-cy="delete-user-btn"
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
    <DataGrid
      rows={Array.isArray(rows) ? rows : []}
      columns={columns}
      autoHeight
      pageSize={5}
      rowsPerPageOptions={[5, 10]}
      getRowId={(row) => row._id}
    />
  );
}
