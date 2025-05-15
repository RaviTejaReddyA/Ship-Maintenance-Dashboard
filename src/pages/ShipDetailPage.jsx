import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
  Tabs,
  Tab,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import {
  getShips,
  getComponents,
  getJobs,
  addComponent,
  updateComponent,
  deleteComponent,
} from '../utils/localStorageUtils'

function ComponentForm({ component, shipId, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: '',
    ...component,
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
          label="Component Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Serial Number"
          value={formData.serialNumber}
          onChange={(e) =>
            setFormData({ ...formData, serialNumber: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Installation Date"
          type="date"
          value={formData.installDate}
          onChange={(e) =>
            setFormData({ ...formData, installDate: e.target.value })
          }
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Last Maintenance Date"
          type="date"
          value={formData.lastMaintenanceDate}
          onChange={(e) =>
            setFormData({ ...formData, lastMaintenanceDate: e.target.value })
          }
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {component ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  )
}

function ShipDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ship, setShip] = useState(null)
  const [components, setComponents] = useState([])
  const [jobs, setJobs] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const ships = getShips()
    const foundShip = ships.find((s) => s.id === id)
    if (foundShip) {
      setShip(foundShip)
      const shipComponents = getComponents().filter(
        (c) => c.shipId === id
      )
      setComponents(shipComponents)
      const shipJobs = getJobs().filter((j) => j.shipId === id)
      setJobs(shipJobs)
    } else {
      navigate('/ships')
    }
  }, [id, navigate])

  const handleAddComponent = () => {
    setSelectedComponent(null)
    setOpenDialog(true)
  }

  const handleEditComponent = (component) => {
    setSelectedComponent(component)
    setOpenDialog(true)
  }

  const handleDeleteComponent = (componentId) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(componentId)
      setComponents(getComponents().filter((c) => c.shipId === id))
    }
  }

  const handleSubmit = (formData) => {
    if (selectedComponent) {
      updateComponent({ ...formData, id: selectedComponent.id })
    } else {
      addComponent({
        ...formData,
        id: `c${Date.now()}`,
        shipId: id,
      })
    }
    setComponents(getComponents().filter((c) => c.shipId === id))
    setOpenDialog(false)
  }

  if (!ship) return null

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <IconButton onClick={() => navigate('/ships')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{ship.name}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Information
              </Typography>
              <Typography>
                <strong>IMO Number:</strong> {ship.imo}
              </Typography>
              <Typography>
                <strong>Flag:</strong> {ship.flag}
              </Typography>
              <Typography>
                <strong>Status:</strong> {ship.status}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Components</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddComponent}
                >
                  Add Component
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Serial Number</TableCell>
                      <TableCell>Installation Date</TableCell>
                      <TableCell>Last Maintenance</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {components.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell>{component.serialNumber}</TableCell>
                        <TableCell>{component.installDate}</TableCell>
                        <TableCell>{component.lastMaintenanceDate}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleEditComponent(component)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteComponent(component.id)}
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
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Maintenance History
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Type</TableCell>
                      <TableCell>Component</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Scheduled Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((job) => {
                      const component = components.find(
                        (c) => c.id === job.componentId
                      )
                      return (
                        <TableRow key={job.id}>
                          <TableCell>{job.type}</TableCell>
                          <TableCell>{component?.name || 'N/A'}</TableCell>
                          <TableCell>{job.priority}</TableCell>
                          <TableCell>{job.status}</TableCell>
                          <TableCell>{job.scheduledDate}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedComponent ? 'Edit Component' : 'Add New Component'}
        </DialogTitle>
        <ComponentForm
          component={selectedComponent}
          shipId={id}
          onSubmit={handleSubmit}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>
    </Box>
  )
}

export default ShipDetailPage 