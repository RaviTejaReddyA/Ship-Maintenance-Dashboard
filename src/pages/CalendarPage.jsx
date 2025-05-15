import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { getJobs, getShips, getComponents } from '../utils/localStorageUtils';

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let existingJobs = getJobs();
    if (!existingJobs || existingJobs.length === 0) {
      // Injecting mock data if jobs are not present
      existingJobs = [
        {
          id: "j1",
          componentId: "c1",
          shipId: "s1",
          type: "Inspection",
          priority: "High",
          status: "Open",
          assignedEngineerId: "3",
          scheduledDate: "2025-05-05"
        }
      ];
      localStorage.setItem("jobs", JSON.stringify(existingJobs));
    }
    setJobs(existingJobs);
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayJobs = jobs.filter(
      (job) => job.scheduledDate === format(date, 'yyyy-MM-dd')
    );
    setSelectedJobs(dayJobs);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const blanks = Array(monthStart.getDay()).fill(null); // Add blank slots before month start
    const fullDays = [...blanks, ...days];
    const weeks = [];
    for (let i = 0; i < fullDays.length; i += 7) {
      weeks.push(fullDays.slice(i, i + 7));
    }

    return (
      <>
        {/* Weekday labels */}
        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Grid item xs={1.714} key={day}>
              <Typography variant="subtitle2" align="center" sx={{ fontWeight: 'bold' }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar weeks */}
        {weeks.map((week, i) => (
          <Grid container spacing={1} key={i}>
            {week.map((day, index) => {
              if (!day) {
                return <Grid item xs={1.714} key={index}></Grid>; // Empty cell
              }

              const dayJobs = jobs.filter(
                (job) => job.scheduledDate === format(day, 'yyyy-MM-dd')
              );

              return (
                <Grid item xs={1.714} key={day.toString()}>
                  <Paper
                    sx={{
                      p: 1,
                      height: 100,
                      cursor: 'pointer',
                      bgcolor: isToday(day) ? 'action.hover' : 'background.paper',
                      opacity: isSameMonth(day, currentDate) ? 1 : 0.5,
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    <Typography variant="body2">{format(day, 'd')}</Typography>
                    {dayJobs.length > 0 && (
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ display: 'block' }}
                      >
                        {dayJobs.length} job(s)
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h6">{format(currentDate, 'MMMM yyyy')}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </Grid>

          {renderCalendar()}

          <Dialog open={!!selectedDate} onClose={() => setSelectedDate(null)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Jobs on {selectedDate && format(selectedDate, 'yyyy-MM-dd')}
            </DialogTitle>
            <DialogContent dividers>
              {selectedJobs.length > 0 ? (
                selectedJobs.map((job) => (
                  <Box key={job.id} mb={2}>
                    <Typography><strong>Type:</strong> {job.type}</Typography>
                    <Typography><strong>Priority:</strong> {job.priority}</Typography>
                    <Typography><strong>Status:</strong> {job.status}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No jobs scheduled.</Typography>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CalendarPage;