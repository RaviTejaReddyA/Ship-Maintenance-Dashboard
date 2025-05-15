import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ShipsPage from './pages/ShipsPage'
import ShipDetailPage from './pages/ShipDetailPage'
import JobsPage from './pages/JobsPage'
import CalendarPage from './pages/CalendarPage'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> // Or a proper loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="ships" element={<ShipsPage />} />
        <Route path="ships/:id" element={<ShipDetailPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  )
}

export default App
