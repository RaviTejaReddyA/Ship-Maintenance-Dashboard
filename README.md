# Ship Maintenance Dashboard

A comprehensive dashboard for managing ship maintenance operations, built with React and Material-UI.

## Features

- User Authentication (Simulated)
- Ships Management
- Ship Components Management
- Maintenance Jobs Management
- Maintenance Calendar
- Notification Center
- KPIs Dashboard

## Tech Stack

- React 18
- React Router v6
- Material-UI
- Context API for State Management
- LocalStorage for Data Persistence
- Recharts for Data Visualization

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ship-maintenance-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Application Architecture

The application follows a component-based architecture with the following structure:

- `/src/components`: Reusable UI components
- `/src/contexts`: Context providers for state management
- `/src/pages`: Main page components
- `/src/utils`: Utility functions and helpers
- `/src/styles`: Global styles and theme configuration

## Authentication

The application uses simulated authentication with the following test accounts:

- Admin: admin@entnt.in / admin123
- Inspector: inspector@entnt.in / inspect123
- Engineer: engineer@entnt.in / engine123

## Data Persistence

All data is persisted using localStorage, including:
- User sessions
- Ships data
- Components data
- Maintenance jobs
- Notifications

## Known Limitations

- No backend integration (as per requirements)
- Data is stored locally in the browser
- No real-time updates
- Limited offline capabilities

## Technical Decisions

1. **Material-UI**: Chosen for its comprehensive component library and theming capabilities
2. **Context API**: Selected over Redux for simpler state management needs
3. **LocalStorage**: Used for data persistence as per requirements
4. **Recharts**: Implemented for data visualization needs
5. **React Router**: Used for client-side routing

