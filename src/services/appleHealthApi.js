export const SLEEP_STAGES = {
  0: 'InBed',
  1: 'Asleep',
  2: 'Awake',
  3: 'Core',
  4: 'Deep',
  5: 'REM'
};

export const processHealthKitSleepData = (data) => {
  if (!data || !data.sleepSessions || data.sleepSessions.length === 0) {
    return [];
  }

  return data.sleepSessions.map(session => {
    const startTime = new Date(session.startDate);
    const endTime = new Date(session.endDate);
    
    return {
      id: `apple-health-${startTime.getTime()}`,
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
      source: session.source || 'Apple Health',
      stages: (session.stages || []).map(stage => ({
        type: stage.value,
        typeName: SLEEP_STAGES[stage.value] || 'Unknown',
        startTime: new Date(stage.startDate),
        endTime: new Date(stage.endDate),
        duration: new Date(stage.endDate).getTime() - new Date(stage.startDate).getTime()
      }))
    };
  });
};

export const receiveSleepDataFromHealthKit = async (sleepData) => {
  console.log('Received sleep data from Apple HealthKit:', sleepData);
  
  return processHealthKitSleepData(sleepData);
};

export const getSavedHealthKitData = async (startDate, endDate) => {
  return {
    sleepSessions: [
      {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(startDate + 28800000).toISOString(),
        source: 'Apple Watch',
        stages: [
          {
            value: 3,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(startDate + 10800000).toISOString()
          },
          {
            value: 4,
            startDate: new Date(startDate + 10800000).toISOString(),
            endDate: new Date(startDate + 14400000).toISOString()
          },
          {
            value: 5,
            startDate: new Date(startDate + 14400000).toISOString(),
            endDate: new Date(startDate + 18000000).toISOString()
          },
          {
            value: 3,
            startDate: new Date(startDate + 18000000).toISOString(),
            endDate: new Date(startDate + 25200000).toISOString()
          },
          {
            value: 2,
            startDate: new Date(startDate + 25200000).toISOString(),
            endDate: new Date(startDate + 26100000).toISOString()
          },
          {
            value: 3,
            startDate: new Date(startDate + 26100000).toISOString(),
            endDate: new Date(startDate + 28800000).toISOString()
          }
        ]
      }
    ]
  };
};