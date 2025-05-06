import React, { useState } from 'react';
import { calculateSleepDuration } from '../utils/sleepUtils';

const SleepLogForm = ({ onSubmit, initialValues = null }) => {
  const [formData, setFormData] = useState({
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    sleepTime: initialValues?.sleepTime 
      ? new Date(initialValues.sleepTime).toTimeString().slice(0, 5) 
      : '22:00',
    wakeTime: initialValues?.wakeTime 
      ? new Date(initialValues.wakeTime).toTimeString().slice(0, 5) 
      : '06:30',
    quality: initialValues?.quality || 5,
    notes: initialValues?.notes || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const sleepDateTime = new Date(`${formData.date}T${formData.sleepTime}`);
    let wakeDateTime = new Date(`${formData.date}T${formData.wakeTime}`);
    
    if (wakeDateTime < sleepDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }

    const duration = calculateSleepDuration(sleepDateTime, wakeDateTime);
    
    if (duration <= 0 || duration > 24) {
      setError('Please enter valid sleep and wake times (duration must be between 0 and 24 hours)');
      return;
    }

    const sleepData = {
      id: initialValues?.id || `sleep-${new Date().getTime()}`,
      date: formData.date,
      sleepTime: sleepDateTime.toISOString(),
      wakeTime: wakeDateTime.toISOString(),
      duration,
      quality: parseInt(formData.quality, 10),
      notes: formData.notes
    };

    onSubmit(sleepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
            Sleep Quality (1-10)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              id="quality"
              name="quality"
              min="1"
              max="10"
              value={formData.quality}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-medium w-8 text-center">{formData.quality}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sleepTime" className="block text-sm font-medium text-gray-700 mb-1">
            Bedtime
          </label>
          <input
            type="time"
            id="sleepTime"
            name="sleepTime"
            value={formData.sleepTime}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700 mb-1">
            Wake Time
          </label>
          <input
            type="time"
            id="wakeTime"
            name="wakeTime"
            value={formData.wakeTime}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder="How did you feel when you woke up? Any disturbances during the night?"
          className="input-field"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {initialValues ? 'Update Sleep Log' : 'Save Sleep Log'}
        </button>
      </div>
    </form>
  );
};

export default SleepLogForm;
