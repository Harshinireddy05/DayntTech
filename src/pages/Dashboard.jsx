import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { differenceInYears } from 'date-fns';
import toast from 'react-hot-toast';
import PersonForm from '../components/PersonForm';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editPerson, setEditPerson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Get data specific to this user
      const userData = allUserData[userEmail] || generateInitialData();
      
      // Save if it's new data
      if (!allUserData[userEmail]) {
        allUserData[userEmail] = userData;
        localStorage.setItem('userData', JSON.stringify(allUserData));
      }
      
      setPeople(userData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  const generateInitialData = () => {
    return Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      name: `Person ${index + 1}`,
      dateOfBirth: new Date(1980 + index, 0, 1).toISOString().split('T')[0],
    }));
  };

  const handleSubmit = (person) => {
    const userEmail = localStorage.getItem('userEmail');
    const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    let updatedPeople;

    if (person.id) {
      // Editing existing person
      updatedPeople = people.map(p => p.id === person.id ? person : p);
      toast.success('Person updated successfully');
    } else {
      // Adding new person
      const newPerson = { ...person, id: Date.now() }; // Use timestamp as ID
      updatedPeople = [...people, newPerson];
      toast.success('Person added successfully');
    }

    setPeople(updatedPeople);
    allUserData[userEmail] = updatedPeople;
    localStorage.setItem('userData', JSON.stringify(allUserData));
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    const updatedPeople = people.filter(person => person.id !== id);
    setPeople(updatedPeople);
    
    const userEmail = localStorage.getItem('userEmail');
    const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    allUserData[userEmail] = updatedPeople;
    localStorage.setItem('userData', JSON.stringify(allUserData));
    
    toast.success('Person deleted successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleEdit = (person) => {
    setEditPerson(person);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setEditPerson(null);
    setOpenForm(true);
  };

  const calculateAge = (dateOfBirth) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">People Management</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ mr: 2 }}
          >
            Add Person
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : (
              people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{calculateAge(person.dateOfBirth)}</TableCell>
                  <TableCell>{person.dateOfBirth}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(person)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(person.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <PersonForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        person={editPerson}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default Dashboard; 