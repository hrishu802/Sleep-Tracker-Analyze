const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_FIT_API_BASE_URL = 'https://www.googleapis.com/fitness/v1/users/me';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/sleep-tracker/#/dashboard';

export const SLEEP_STAGES = {
  1: 'Awake (during sleep cycle)',
  2: 'Sleep',
  3: 'Out-of-bed',
  4: 'Light sleep',
  5: 'Deep sleep',
  6: 'REM'
};

export const authorizeGoogleFit = () => {
  const scopes = [
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.activity.read'
  ];
  
  const authUrl = `${GOOGLE_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}&access_type=offline&prompt=consent`;
  window.location.href = authUrl;
};

export const getAccessToken = async (code) => {
  alert('In a production app, token exchange would happen on the backend server.');
  
  return {
    access_token: 'simulated_token',
    refresh_token: 'simulated_refresh_token',
    expires_in: 3600
  };
};

export const getSleepSessions = async (startTimeMillis, endTimeMillis, accessToken) => {
  try {
    const response = await fetch(
      `${GOOGLE_FIT_API_BASE_URL}/sessions?startTime=${new Date(startTimeMillis).toISOString()}&endTime=${new Date(endTimeMillis).toISOString()}&activityType=72`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch sleep sessions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Google Fit sleep sessions:', error);
    throw error;
  }
};

export const getSleepStageData = async (startTimeMillis, endTimeMillis, accessToken) => {
  try {
    const response = await fetch(`${GOOGLE_FIT_API_BASE_URL}/dataset:aggregate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.sleep.segment'
        }],
        startTimeMillis,
        endTimeMillis
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sleep stage data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Google Fit sleep stage data:', error);
    throw error;
  }
};

export const processGoogleFitSleepData = (sessions, stageData) => {
  if (!sessions || !sessions.session || sessions.session.length === 0) {
    return [];
  }

  return sessions.session.map(session => {
    const sessionStages = stageData && stageData.bucket && stageData.bucket.length > 0
      ? extractSleepStages(stageData.bucket[0].dataset[0].point, session.startTimeMillis, session.endTimeMillis)
      : [];

    return {
      id: session.id,
      startTime: new Date(parseInt(session.startTimeMillis)),
      endTime: new Date(parseInt(session.endTimeMillis)),
      duration: parseInt(session.endTimeMillis) - parseInt(session.startTimeMillis),
      source: session.application.packageName,
      stages: sessionStages
    };
  });
};

const extractSleepStages = (points, sessionStartMillis, sessionEndMillis) => {
  if (!points || points.length === 0) {
    return [];
  }

  return points
    .filter(point => {
      const startTimeMillis = Math.floor(parseInt(point.startTimeNanos) / 1000000);
      return startTimeMillis >= parseInt(sessionStartMillis) && startTimeMillis <= parseInt(sessionEndMillis);
    })
    .map(point => {
      const stageValue = point.value[0].intVal;
      return {
        type: stageValue,
        typeName: SLEEP_STAGES[stageValue] || 'Unknown',
        startTime: new Date(Math.floor(parseInt(point.startTimeNanos) / 1000000)),
        endTime: new Date(Math.floor(parseInt(point.endTimeNanos) / 1000000)),
        duration: Math.floor(parseInt(point.endTimeNanos) - parseInt(point.startTimeNanos)) / 1000000
      };
    });
};