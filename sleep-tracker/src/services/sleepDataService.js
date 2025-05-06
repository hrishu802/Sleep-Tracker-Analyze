/**
 * Unified Sleep Data Service
 * 
 * This service provides a common interface to work with sleep data
 * from multiple providers: Fitbit, Google Fit, and Apple HealthKit
 */

import * as fitbitApi from './fitbitApi';
import * as googleFitApi from './googleFitApi';
import * as appleHealthApi from './appleHealthApi';

// Provider identifiers
export const PROVIDERS = {
  FITBIT: 'fitbit',
  GOOGLE_FIT: 'googleFit',
  APPLE_HEALTH: 'appleHealth',
};

/**
 * Initialize authentication flow for a specific provider
 */
export const startAuth = (provider) => {
  switch (provider) {
    case PROVIDERS.FITBIT:
      fitbitApi.authorizeFitbit();
      break;
    case PROVIDERS.GOOGLE_FIT:
      googleFitApi.authorizeGoogleFit();
      break;
    case PROVIDERS.APPLE_HEALTH:
      alert('Apple HealthKit requires a companion iOS app to share data with this web app.');
      break;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};

/**
 * Process authorization code from OAuth callback
 */
export const handleAuthCallback = async (provider, code) => {
  switch (provider) {
    case PROVIDERS.FITBIT:
      return await fitbitApi.getAccessToken(code);
    case PROVIDERS.GOOGLE_FIT:
      return await googleFitApi.getAccessToken(code);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};

/**
 * Get sleep data for a specific date range from a provider
 */
export const getSleepData = async (provider, startDate, endDate, accessToken = null) => {
  try {
    switch (provider) {
      case PROVIDERS.FITBIT:
        if (!accessToken) {
          throw new Error('Access token is required for Fitbit API');
        }
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);
        const fitbitData = await fitbitApi.getSleepByDateRange(startDateStr, endDateStr, accessToken);
        return processFitbitData(fitbitData);
        
      case PROVIDERS.GOOGLE_FIT:
        if (!accessToken) {
          throw new Error('Access token is required for Google Fit API');
        }
        const startTimeMillis = new Date(startDate).getTime();
        const endTimeMillis = new Date(endDate).getTime();
        
        // For Google Fit, we need to get both session data and detailed stage data
        const sessionsData = await googleFitApi.getSleepSessions(startTimeMillis, endTimeMillis, accessToken);
        const stageData = await googleFitApi.getSleepStageData(startTimeMillis, endTimeMillis, accessToken);
        return googleFitApi.processGoogleFitSleepData(sessionsData, stageData);
        
      case PROVIDERS.APPLE_HEALTH:
        // For Apple Health, we're retrieving previously stored data from our backend
        // that would have been sent from an iOS app
        const healthKitData = await appleHealthApi.getSavedHealthKitData(startTimeMillis, endTimeMillis);
        return appleHealthApi.processHealthKitSleepData(healthKitData);
        
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error fetching sleep data from ${provider}:`, error);
    throw error;
  }
};

/**
 * Process and normalize Fitbit sleep data
 */
const processFitbitData = (data) => {
  if (!data || !data.sleep || data.sleep.length === 0) {
    return [];
  }

  return data.sleep.map(session => {
    return {
      id: session.logId,
      startTime: new Date(session.startTime),
      endTime: new Date(session.endTime),
      duration: session.duration,
      efficiency: session.efficiency,
      source: 'Fitbit',
      mainSleep: session.mainSleep,
      stages: processStages(session)
    };
  });
};

/**
 * Process sleep stages from Fitbit data
 */
const processStages = (session) => {
  // If the session has detailed data
  if (session.levels && session.levels.data && session.levels.data.length > 0) {
    return session.levels.data.map(level => ({
      type: getStageType(level.level),
      typeName: level.level,
      startTime: new Date(level.dateTime),
      endTime: new Date(new Date(level.dateTime).getTime() + level.seconds * 1000),
      duration: level.seconds * 1000
    }));
  }
  
  // Otherwise return a single stage representing the whole session
  return [{
    type: 2, // Generic "sleep" type
    typeName: 'sleep',
    startTime: new Date(session.startTime),
    endTime: new Date(session.endTime),
    duration: session.duration
  }];
};

/**
 * Map Fitbit sleep stage to standard type
 */
const getStageType = (stageName) => {
  switch (stageName.toLowerCase()) {
    case 'wake':
    case 'awake':
      return 1;
    case 'light':
      return 4;
    case 'deep':
      return 5;
    case 'rem':
      return 6;
    default:
      return 2; // Default to generic "sleep"
  }
};

/**
 * Format date as YYYY-MM-DD for API requests
 */
const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}; 