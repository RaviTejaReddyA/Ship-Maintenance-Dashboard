// Keys for localStorage
const STORAGE_KEYS = {
  SHIPS: 'ships',
  COMPONENTS: 'components',
  JOBS: 'jobs',
  NOTIFICATIONS: 'notifications',
}

// Initialize default data if not exists
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SHIPS)) {
    localStorage.setItem(
      STORAGE_KEYS.SHIPS,
      JSON.stringify([
        {
          id: 's1',
          name: 'Ever Given',
          imo: '9811000',
          flag: 'Panama',
          status: 'Active',
        },
        {
          id: 's2',
          name: 'Maersk Alabama',
          imo: '9164263',
          flag: 'USA',
          status: 'Under Maintenance',
        },
      ])
    )
  }

  if (!localStorage.getItem(STORAGE_KEYS.COMPONENTS)) {
    localStorage.setItem(
      STORAGE_KEYS.COMPONENTS,
      JSON.stringify([
        {
          id: 'c1',
          shipId: 's1',
          name: 'Main Engine',
          serialNumber: 'ME-1234',
          installDate: '2020-01-10',
          lastMaintenanceDate: '2024-03-12',
        },
        {
          id: 'c2',
          shipId: 's2',
          name: 'Radar',
          serialNumber: 'RAD-5678',
          installDate: '2021-07-18',
          lastMaintenanceDate: '2023-12-01',
        },
      ])
    )
  }

  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(
      STORAGE_KEYS.JOBS,
      JSON.stringify([
        {
          id: 'j1',
          componentId: 'c1',
          shipId: 's1',
          type: 'Inspection',
          priority: 'High',
          status: 'Open',
          assignedEngineerId: '3',
          scheduledDate: '2024-05-05',
        },
      ])
    )
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]))
  }
}

// Generic CRUD operations
export const getItems = (key) => {
  const items = localStorage.getItem(key)
  return items ? JSON.parse(items) : []
}

export const setItems = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items))
}

export const addItem = (key, item) => {
  const items = getItems(key)
  items.push(item)
  setItems(key, items)
  return item
}

export const updateItem = (key, updatedItem) => {
  const items = getItems(key)
  const index = items.findIndex((item) => item.id === updatedItem.id)
  if (index !== -1) {
    items[index] = updatedItem
    setItems(key, items)
    return updatedItem
  }
  return null
}

export const deleteItem = (key, id) => {
  const items = getItems(key)
  const filteredItems = items.filter((item) => item.id !== id)
  setItems(key, filteredItems)
}

// Specific operations for each entity
export const getShips = () => getItems(STORAGE_KEYS.SHIPS)
export const addShip = (ship) => addItem(STORAGE_KEYS.SHIPS, ship)
export const updateShip = (ship) => updateItem(STORAGE_KEYS.SHIPS, ship)
export const deleteShip = (id) => deleteItem(STORAGE_KEYS.SHIPS, id)

export const getComponents = () => getItems(STORAGE_KEYS.COMPONENTS)
export const addComponent = (component) => addItem(STORAGE_KEYS.COMPONENTS, component)
export const updateComponent = (component) => updateItem(STORAGE_KEYS.COMPONENTS, component)
export const deleteComponent = (id) => deleteItem(STORAGE_KEYS.COMPONENTS, id)

export const getJobs = () => getItems(STORAGE_KEYS.JOBS)
export const addJob = (job) => addItem(STORAGE_KEYS.JOBS, job)
export const updateJob = (job) => updateItem(STORAGE_KEYS.JOBS, job)
export const deleteJob = (id) => deleteItem(STORAGE_KEYS.JOBS, id)

export const getNotifications = () => getItems(STORAGE_KEYS.NOTIFICATIONS)
export const addNotification = (notification) => addItem(STORAGE_KEYS.NOTIFICATIONS, notification)
export const deleteNotification = (id) => deleteItem(STORAGE_KEYS.NOTIFICATIONS, id) 