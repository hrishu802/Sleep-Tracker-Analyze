# Sleep Tracker API Setup Guide

This guide explains how to set up and use the sleep tracking APIs (Fitbit, Google Fit, and Apple HealthKit) in your Sleep Tracker & Analyzer website.

## API Credentials Setup

### 1. Fitbit API

1. **Register a Fitbit Application**:
   - Go to [Fitbit Developer Portal](https://dev.fitbit.com/apps/new)
   - Log in with your Fitbit account (or create one)
   - Click "Register a new app"
   - Fill in the required details:
     - Application Name: "Sleep Tracker & Analyzer"
     - Description: "A web application to track and analyze sleep patterns"
     - Application Website: Your website URL
     - Organization: Your name or organization
     - OAuth 2.0 Application Type: "Client"
     - Callback URL: `http://localhost:3000/sleep-tracker/#/dashboard` (for development)
     - Default Access Type: "Read-Only"

2. **Get API Credentials**:
   - After registration, note your:
     - OAuth 2.0 Client ID
     - Client Secret

3. **Set Up Environment Variables**:
   - Create a `.env` file in the sleep-tracker directory if not already present
   - Add your Fitbit credentials:
     ```
     REACT_APP_FITBIT_CLIENT_ID=your_client_id
     ```

### 2. Google Fit API

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Dashboard"
   - Click "ENABLE APIS AND SERVICES"
   - Search for and enable "Fitness API"

2. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" (or "Internal" if you have Google Workspace)
   - Fill in required information
   - Add scopes:
     - `https://www.googleapis.com/auth/fitness.sleep.read`
     - `https://www.googleapis.com/auth/fitness.activity.read`
   - Add test users if needed

3. **Create OAuth 2.0 Client ID**:
   - Go to "APIs & Services" > "Credentials"
   - Click "CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Sleep Tracker & Analyzer"
   - Authorized JavaScript origins: `http://localhost:3000` (for development)
   - Authorized redirect URIs: `http://localhost:3000/sleep-tracker/#/dashboard` (for development)
   - Click "CREATE"

4. **Set Up Environment Variables**:
   - Add your Google credentials to the `.env` file:
     ```
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
     ```

### 3. Apple HealthKit

Apple HealthKit cannot be directly accessed from a web application. You need to:

1. **Create an iOS Companion App**:
   - Develop a native iOS app using Swift or Objective-C
   - Request HealthKit permissions in your app
   - Set up a backend server to receive and store sleep data

2. **Configure HealthKit in Xcode**:
   - Enable HealthKit capability in your Xcode project
   - Update your Info.plist with required privacy descriptions

3. **Send Data to Web App**:
   - Implement functionality to send sleep data to your backend
   - Create API endpoints in your backend to store and retrieve this data
   - Use these endpoints from your web application

## Using the APIs in the Website

### 1. Connecting to Providers

1. **Navigate to "Connected Devices" Tab**:
   - On the Dashboard, click the "Connected Devices" tab
   - You'll see cards for Fitbit, Google Fit, and Apple Health

2. **Connect to a Provider**:
   - Click the "Connect" button for your preferred provider
   - For Fitbit and Google Fit:
     - You'll be redirected to the provider's authorization page
     - Log in and authorize the app
     - You'll be redirected back to the Dashboard
   - For Apple Health:
     - You'll need the companion iOS app

### 2. Viewing Sleep Data

1. **Navigate to "API Data" Tab**:
   - On the Dashboard, click the "API Data" tab

2. **Select Provider and Date Range**:
   - Choose a connected provider from the dropdown
   - Select start and end dates
   - Click "Fetch Data"

3. **Analyze Sleep Data**:
   - View sleep statistics (duration, deep sleep %, REM %)
   - Examine the sleep stages chart
   - Review detailed sleep sessions in the table

### 3. Troubleshooting

- **Connection Issues**:
  - Ensure your API credentials are correct in the `.env` file
  - Check that your redirect URIs are properly configured
  - Verify you have the required scopes

- **Data Retrieval Problems**:
  - Check browser console for error messages
  - Ensure your access token hasn't expired
  - Verify you have sleep data for the selected date range

- **Apple HealthKit Data**:
  - For demo purposes, the application uses simulated data
  - In production, implement the companion iOS app and backend

## Development Notes

The sleep API implementation is structured as follows:

- `services/fitbitApi.js` - Fitbit API integration
- `services/googleFitApi.js` - Google Fit API integration
- `services/appleHealthApi.js` - Apple HealthKit integration
- `services/sleepDataService.js` - Unified service for all providers
- `components/ConnectDevices.js` - UI for connecting to providers
- `components/SleepData.js` - UI for displaying sleep data

When extending the application, follow the existing patterns to maintain a consistent structure and user experience. 