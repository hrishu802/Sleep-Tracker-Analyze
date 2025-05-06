/**
 * Fitbit API Service
 * Documentation: https://dev.fitbit.com/build/reference/web-api/sleep/
 */

// Constants
const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize';
const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';
const FITBIT_API_BASE_URL = 'https://api.fitbit.com/1.2';

// Set up your Fitbit app credentials (these should be stored in environment variables)
const CLIENT_ID = process.env.REACT_APP_FITBIT_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/sleep-tracker/#/dashboard';

/**
 * Initiate Fitbit OAuth flow
 */
export const authorizeFitbit = () => {
  const scopes = ['sleep'];
  const authUrl = `${FITBIT_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}&expires_in=604800`;
  window.location.href = authUrl;
};

/**
 * Exchange authorization code for access token
 * (Note: This would typically happen on your backend for security)
 */
export const getAccessToken = async (code) => {
  // In a real implementation, this request should be made from your backend
  // Frontend should not have access to your client secret
  alert('In a production app, token exchange would happen on the backend server.');
  
  // Simulate successful token response for demo purposes
  return {
    access_token: 'simulated_token',
    refresh_token: 'simulated_refresh_token',
    expires_in: 604800
  };
};

/**
 * Get sleep log by date
 */
export const getSleepByDate = async (date, accessToken) => {
  try {
    const response = await fetch(`${FITBIT_API_BASE_URL}/user/-/sleep/date/${date}.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sleep data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Fitbit sleep data:', error);
    throw error;
  }
};

/**
 * Get sleep log by date range
 */
export const getSleepByDateRange = async (startDate, endDate, accessToken) => {
  try {
    const response = await fetch(`${FITBIT_API_BASE_URL}/user/-/sleep/date/${startDate}/${endDate}.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sleep data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Fitbit sleep data:', error);
    throw error;
  }
};

/**
 * Create sleep log
 */
export const createSleepLog = async (sleepData, accessToken) => {
  try {
    const response = await fetch(`${FITBIT_API_BASE_URL}/user/-/sleep.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(sleepData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create sleep log');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Fitbit sleep log:', error);
    throw error;
  }
}; 