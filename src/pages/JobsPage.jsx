import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import {
  getJobs,
  getShips,
  getComponents,
  addJob,
  updateJob,
  deleteJob,
} from '../utils/localStorageUtils'

function JobForm({ job, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    type: '',
    priority: 'Medium',
    status: 'Open',
    scheduledDate: '',
    shipId: '',
    componentId: '',
    assignedEngineerId: '',
    ...job,
  })

  const ships = getShips()
  const components = getComponents().filter(
    (c) => !formData.shipId || c.shipId === formData.shipId
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="ship-select-label">Ship</InputLabel>
              <Select
                labelId="ship-select-label"
                value={formData.shipId}
                label="Ship"
                onChange={(e) =>
                  setFormData({ ...formData, shipId: e.target.value })
                }
                required
              >
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="component-select-label">Component</InputLabel>
              <Select
                labelId="component-select-label"
                value={formData.componentId}
                label="Component"
                onChange={(e) =>
                  setFormData({ ...formData, componentId: e.target.value })
                }
                required
              >
                {components.map((component) => (
                  <MenuItem key={component.id} value={component.id}>
                    {component.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                value={formData.priority}
                label="Priority"
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                required
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Scheduled Date"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {job ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  )
}

function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filters, setFilters] = useState({
    shipId: '',
    status: '',
    priority: '',
  })

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  useEffect(() => {
    const allJobs = getJobs()
    setJobs(allJobs)
    setFilteredJobs(allJobs)
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (filters.shipId) {
      filtered = filtered.filter((job) => job.shipId === filters.shipId)
    }

    if (filters.status) {
      filtered = filtered.filter((job) => job.status === filters.status)
    }

    if (filters.priority) {
      filtered = filtered.filter((job) => job.priority === filters.priority)
    }

    setFilteredJobs(filtered)
  }, [filters, jobs])

  const handleAddJob = () => {
    setSelectedJob(null)
    setOpenDialog(true)
  }

  const handleEditJob = (job) => {
    setSelectedJob(job)
    setOpenDialog(true)
  }

  const handleDeleteJob = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(id)
      const updatedJobs = getJobs()
      setJobs(updatedJobs)
      showSnackbar('Job deleted successfully', 'warning')
    }
  }

  const handleSubmit = (formData) => {
    if (selectedJob) {
      updateJob({ ...formData, id: selectedJob.id })
      if (formData.status === 'Completed') {
        showSnackbar('Job marked as completed', 'info')
      } else {
        showSnackbar('Job updated successfully', 'success')
      }
    } else {
      addJob({
        ...formData,
        id: `j${Date.now()}`,
      })
      showSnackbar('Job created successfully', 'success')
    }
    setJobs(getJobs())
    setOpenDialog(false)
  }

  const ships = getShips()

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
        <Typography variant="h4">Maintenance Jobs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddJob}
        >
          Add Job
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="filter-ship-label">Filter by Ship</InputLabel>
                <Select
                  labelId="filter-ship-label"
                  value={filters.shipId}
                  label="Filter by Ship"
                  onChange={(e) =>
                    setFilters({ ...filters, shipId: e.target.value })
                  }
                >
                  <MenuItem value="">All Ships</MenuItem>
                  {ships.map((ship) => (
                    <MenuItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="filter-status-label">Filter by Status</InputLabel>
                <Select
                  labelId="filter-status-label"
                  value={filters.status}
                  label="Filter by Status"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="filter-priority-label">Filter by Priority</InputLabel>
                <Select
                  labelId="filter-priority-label"
                  value={filters.priority}
                  label="Filter by Priority"
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ship</TableCell>
                  <TableCell>Component</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => {
                  const ship = ships.find((s) => s.id === job.shipId)
                  const component = getComponents().find(
                    (c) => c.id === job.componentId
                  )
                  return (
                    <TableRow key={job.id}>
                      <TableCell>{ship?.name || 'N/A'}</TableCell>
                      <TableCell>{component?.name || 'N/A'}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>{job.priority}</TableCell>
                      <TableCell>{job.status}</TableCell>
                      <TableCell>{job.scheduledDate}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEditJob(job)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteJob(job.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
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
          {selectedJob ? 'Edit Job' : 'Add New Job'}
        </DialogTitle>
        <JobForm
          job={selectedJob}
          onSubmit={handleSubmit}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default JobsPage
