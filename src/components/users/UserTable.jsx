import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function UserTable({ rows, onEdit, onDelete }) {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <Button onClick={() => onEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => onDelete(params.row)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      getRowId={(row) => row._id}
    />
  );
}
