# Sleep Tracker & Analyzer

A modern web application for tracking and analyzing sleep patterns, with integration for Fitbit, Google Fit, and Apple HealthKit APIs.

## Features

- Track sleep duration, quality, and patterns
- Visualize sleep data with interactive charts
- Connect to popular fitness tracking services
- Receive personalized recommendations
- View sleep stage analysis (Deep, Light, REM)

## API Integrations

This application supports integration with three major sleep tracking APIs:

### Fitbit API
- OAuth 2.0 authentication
- Fetch sleep logs by date or date range
- Access detailed sleep stage information

### Google Fit API
- OAuth 2.0 authentication
- Access sleep sessions and segments
- Analyze sleep stage data (Light, Deep, REM)

### Apple HealthKit
- Integration via a companion iOS app
- Process and display sleep data from Apple devices
- Support for detailed sleep stage analysis

**Note:** For detailed setup instructions for these APIs, see the [API_SETUP.md](./API_SETUP.md) file.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- API credentials (see API_SETUP.md)

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/sleep-tracker-analyzer.git
cd sleep-tracker-analyzer
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the sleep-tracker directory with your API credentials:
```
REACT_APP_FITBIT_CLIENT_ID=your_fitbit_client_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the development server:
```
npm start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Structure

- `/src/components` - React components
- `/src/services` - API service integrations
- `/src/pages` - Main application pages
- `/src/utils` - Utility functions
- `/src/context` - React context providers

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
