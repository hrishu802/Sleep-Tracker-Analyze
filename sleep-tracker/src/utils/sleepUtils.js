// Calculate sleep duration in hours and minutes
export const calculateSleepDuration = (sleepTime, wakeTime) => {
  const sleep = new Date(sleepTime);
  const wake = new Date(wakeTime);
  
  // Handle case where wake time is the next day
  let diffMs = wake - sleep;
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000; // Add 24 hours if wake time is earlier
  }
  
  const diffHrs = diffMs / (1000 * 60 * 60);
  return parseFloat(diffHrs.toFixed(2));
};

// Format duration as hours and minutes
export const formatDuration = (durationHours) => {
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

// Calculate sleep quality score (0-100)
export const calculateSleepQuality = (quality, interruptions = 0, restfulness = 5) => {
  // Quality is on a scale of 1-10
  // Interruptions reduce score
  // Restfulness is on a scale of 1-10
  
  const qualityScore = (quality / 10) * 50; // 50% of score from subjective quality
  const interruptionPenalty = interruptions * 5; // Each interruption reduces score
  const restfulnessScore = (restfulness / 10) * 50; // 50% from restfulness
  
  let score = qualityScore + restfulnessScore - interruptionPenalty;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

// Generate sleep recommendations based on data
export const generateSleepRecommendations = (sleepData) => {
  const recommendations = [];
  
  // Calculate average sleep duration
  const avgDuration = sleepData.reduce((sum, entry) => sum + entry.duration, 0) / sleepData.length;
  
  // Calculate average sleep quality
  const avgQuality = sleepData.reduce((sum, entry) => sum + entry.quality, 0) / sleepData.length;
  
  // Check sleep duration
  if (avgDuration < 7) {
    recommendations.push('Try to increase your sleep duration to at least 7 hours per night.');
  } else if (avgDuration > 9) {
    recommendations.push('You might be oversleeping. Adults typically need 7-9 hours of sleep.');
  }
  
  // Check sleep quality
  if (avgQuality < 60) {
    recommendations.push('Your sleep quality could be improved. Consider reducing screen time before bed.');
  }
  
  // Check sleep consistency
  const bedtimes = sleepData.map(entry => new Date(entry.sleepTime).getHours());
  const maxBedtime = Math.max(...bedtimes);
  const minBedtime = Math.min(...bedtimes);
  
  if (maxBedtime - minBedtime > 2) {
    recommendations.push('Your sleep schedule is inconsistent. Try to maintain a regular sleep schedule, even on weekends.');
  }
  
  return recommendations;
};

// Get color based on sleep quality
export const getSleepQualityColor = (quality) => {
  if (quality >= 80) return 'bg-green-500';
  if (quality >= 60) return 'bg-green-300';
  if (quality >= 40) return 'bg-yellow-300';
  if (quality >= 20) return 'bg-orange-400';
  return 'bg-red-500';
};

// Sample sleep data for development/testing
export const getSampleSleepData = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const sampleData = [];
  
  // Generate sample data for the last 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random values for demonstration
    const duration = 5 + Math.random() * 4; // 5-9 hours
    const quality = Math.floor(30 + Math.random() * 70); // 30-100 quality score
    
    const sleepTime = new Date(date);
    sleepTime.setHours(22 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0); // 10pm - 1am
    
    const wakeTime = new Date(date);
    wakeTime.setDate(wakeTime.getDate() + 1);
    wakeTime.setHours(6 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0); // 6am - 9am
    
    sampleData.push({
      id: `sleep-${i}`,
      date: date.toISOString().split('T')[0],
      sleepTime: sleepTime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      duration,
      quality,
      notes: ''
    });
  }
  
  return sampleData;
};

// Get default sleep goal based on age
export const getDefaultSleepGoal = (age) => {
  if (!age) return 8; // Default for adults
  
  if (age < 1) return 14; // Infants: 12-16 hours
  if (age < 3) return 12; // Toddlers: 11-14 hours
  if (age < 6) return 11; // Preschool: 10-13 hours
  if (age < 13) return 10; // School age: 9-11 hours
  if (age < 18) return 9; // Teens: 8-10 hours
  if (age < 65) return 8; // Adults: 7-9 hours
  return 7.5; // Older adults: 7-8 hours
};

// Calculate progress towards sleep goal
export const calculateSleepProgress = (sleepData, sleepGoal) => {
  if (!sleepData || sleepData.length === 0 || !sleepGoal) {
    return { percentage: 0, averageDuration: 0, deficit: 0 };
  }
  
  // Get last 7 days data
  const recentData = sleepData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);
  
  // Calculate average duration
  const totalDuration = recentData.reduce((sum, entry) => sum + entry.duration, 0);
  const averageDuration = totalDuration / recentData.length;
  
  // Calculate percentage of goal met
  const percentage = Math.min(100, Math.round((averageDuration / sleepGoal) * 100));
  
  // Calculate sleep deficit/surplus in hours
  const deficit = (averageDuration - sleepGoal).toFixed(1);
  
  return { percentage, averageDuration: averageDuration.toFixed(1), deficit };
};

// Generate advice based on sleep goal progress
export const getSleepGoalAdvice = (percentage, deficit) => {
  if (percentage >= 95) {
    return "Great job! You're consistently meeting your sleep goal.";
  } else if (percentage >= 85) {
    return "You're doing well, but could use a little more sleep to reach your goal.";
  } else if (percentage >= 70) {
    return "You're getting decent sleep, but falling short of your goal by about " + Math.abs(deficit) + " hours.";
  } else {
    return "You're significantly under your sleep goal. Try to prioritize sleep and adjust your schedule.";
  }
};

// Format time for reminder settings (24h format to user-friendly)
export const formatReminderTime = (time24h) => {
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

// Parse reminder time from user-friendly to 24h format
export const parseReminderTime = (time12h) => {
  const [timePart, period] = time12h.split(' ');
  let [hours, minutes] = timePart.split(':');
  hours = parseInt(hours, 10);
  
  if (period.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};
