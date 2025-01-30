import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import { InputAdornment } from '@mui/material';

const PersonForm = ({ open, onClose, person, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (person) {
      setFormData(person);
    } else {
      setFormData({ name: '', dateOfBirth: '' });
    }
  }, [person]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        fontSize: '1.5rem',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {person ? 'Edit Person' : 'Add New Person'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              autoFocus
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {person ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PersonForm; 