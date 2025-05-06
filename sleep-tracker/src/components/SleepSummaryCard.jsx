import React from 'react';
import { formatDuration, getSleepQualityColor } from '../utils/sleepUtils';

const SleepSummaryCard = ({ sleepData }) => {
  if (!sleepData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  const { date, duration, quality, sleepTime, wakeTime, notes } = sleepData;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedSleepTime = new Date(sleepTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedWakeTime = new Date(wakeTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const qualityColor = getSleepQualityColor(quality);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{formattedDate}</h3>
        <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${qualityColor}`}>
          {quality}/100
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Bedtime</p>
          <p className="text-lg font-medium">{formattedSleepTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Wake time</p>
          <p className="text-lg font-medium">{formattedWakeTime}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">Sleep duration</p>
        <p className="text-xl font-bold text-indigo-600">{formatDuration(duration)}</p>
      </div>

      {notes && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Notes</p>
          <p className="text-gray-700 text-sm italic">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default SleepSummaryCard;
