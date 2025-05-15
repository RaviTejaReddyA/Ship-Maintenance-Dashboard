import { useEffect, useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material'
import {
  DirectionsBoat,
  Build,
  Warning,
  CheckCircle,
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  getShips,
  getComponents,
  getJobs,
} from '../utils/localStorageUtils'

function KPICard({ title, value, icon, color }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  )
}

function DashboardPage() {
  const [stats, setStats] = useState({
    totalShips: 0,
    overdueMaintenance: 0,
    jobsInProgress: 0,
    completedJobs: 0,
  })

  const [jobStats, setJobStats] = useState([])

  useEffect(() => {
    const ships = getShips()
    const components = getComponents()
    const jobs = getJobs()

    // Calculate KPIs
    const totalShips = ships.length
    const overdueMaintenance = components.filter(
      (component) =>
        new Date(component.lastMaintenanceDate) < new Date()
    ).length
    const jobsInProgress = jobs.filter(
      (job) => job.status === 'In Progress'
    ).length
    const completedJobs = jobs.filter(
      (job) => job.status === 'Completed'
    ).length

    setStats({
      totalShips,
      overdueMaintenance,
      jobsInProgress,
      completedJobs,
    })

    // Prepare job statistics for chart
    const jobStatusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      return acc
    }, {})

    const chartData = Object.entries(jobStatusCounts).map(([status, count]) => ({
      status,
      count,
    }))

    setJobStats(chartData)
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Ships"
            value={stats.totalShips}
            icon={<DirectionsBoat sx={{ color: 'primary.main' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Overdue Maintenance"
            value={stats.overdueMaintenance}
            icon={<Warning sx={{ color: 'warning.main' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Jobs in Progress"
            value={stats.jobsInProgress}
            icon={<Build sx={{ color: 'info.main' }} />}
            color="#0288d1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Completed Jobs"
            value={stats.completedJobs}
            icon={<CheckCircle sx={{ color: 'success.main' }} />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      <Card sx={{ height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Jobs by Status
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DashboardPage 