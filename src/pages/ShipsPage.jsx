import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import {
  getShips,
  addShip,
  updateShip,
  deleteShip,
} from '../utils/localStorageUtils'

function ShipForm({ ship, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active',
    ...ship,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <TextField
          fullWidth
          label="Ship Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="IMO Number"
          value={formData.imo}
          onChange={(e) =>
            setFormData({ ...formData, imo: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Flag"
          value={formData.flag}
          onChange={(e) =>
            setFormData({ ...formData, flag: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          margin="normal"
          required
          SelectProps={{
            native: true,
          }}
        >
          <option value="Active">Active</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Inactive">Inactive</option>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {ship ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  )
}

function ShipsPage() {
  const [ships, setShips] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedShip, setSelectedShip] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setShips(getShips())
  }, [])

  const handleAddShip = () => {
    setSelectedShip(null)
    setOpenDialog(true)
  }

  const handleEditShip = (ship) => {
    setSelectedShip(ship)
    setOpenDialog(true)
  }

  const handleDeleteShip = (id) => {
    if (window.confirm('Are you sure you want to delete this ship?')) {
      deleteShip(id)
      setShips(getShips())
    }
  }

  const handleSubmit = (formData) => {
    if (selectedShip) {
      updateShip({ ...formData, id: selectedShip.id })
    } else {
      addShip({ ...formData, id: `s${Date.now()}` })
    }
    setShips(getShips())
    setOpenDialog(false)
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Ships</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddShip}
        >
          Add Ship
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>IMO Number</TableCell>
                  <TableCell>Flag</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ships.map((ship) => (
                  <TableRow key={ship.id}>
                    <TableCell>{ship.name}</TableCell>
                    <TableCell>{ship.imo}</TableCell>
                    <TableCell>{ship.flag}</TableCell>
                    <TableCell>{ship.status}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => navigate(`/ships/${ship.id}`)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditShip(ship)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteShip(ship.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedShip ? 'Edit Ship' : 'Add New Ship'}
        </DialogTitle>
        <ShipForm
          ship={selectedShip}
          onSubmit={handleSubmit}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>
    </Box>
  )
}

export default ShipsPage 