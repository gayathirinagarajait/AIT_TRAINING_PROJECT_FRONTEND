import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Avatar,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { Edit, Delete, Email, Phone } from '@mui/icons-material';

export default function UserList({ rows = [], onEdit, onDelete }) {
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={2.5} sx={{ width: '100%', marginRight:20 }}>
      {rows.length === 0 ? (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography>No users found in the system.</Typography>
          </Box>
        </Grid>
      ) : (
        rows.map((user) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={3} 
            key={user._id}
            sx={{
              display: 'flex',
              minWidth: 0,
            
            }}
          >
            <Card
              sx={{
                width: '100%',
                height: 340, 
                minWidth: 380,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: 'grey.200',
                flex: 1,
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: 'primary.main',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Chip
                      label={user.role || 'User'}
                      size="small"
                      color={getRoleColor(user.role)}
                      sx={{ mt: 0.5 , padding: 2}}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Content */}
                <Box sx={{ flex: 1, mb: 2 }}>
                  <Stack spacing={1.5}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Email
                        sx={{
                          fontSize: 18,
                          color: 'text.secondary',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>

                    {user.phone && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Phone
                          sx={{
                            fontSize: 18,
                            color: 'text.secondary',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.phone}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                  }}
                >
                  <Button
                  data-cy="edit-user-btn"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit(user)}
                    startIcon={<Edit sx={{ fontSize: 16 }} />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 1.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                  data-cy="delete-user-btn"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => onDelete(user)}
                    startIcon={<Delete sx={{ fontSize: 16 }} />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 1.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}