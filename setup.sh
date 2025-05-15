#!/bin/bash

# Create project directory structure
mkdir -p src/{components,contexts,pages,utils,styles}

# Install dependencies
npm install

# Initialize localStorage with default data
echo "Initializing localStorage with default data..."
node -e "
const { initializeStorage } = require('./src/utils/localStorageUtils');
initializeStorage();
"

echo "Setup completed successfully!" 