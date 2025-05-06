import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SleepLogForm from '../components/SleepLogForm';

const LogSleep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    // Check if we're in edit mode
    if (location.state?.editEntry) {
      setEditMode(true);
      setInitialValues(location.state.editEntry);
    }
  }, [location]);

  const handleSubmit = (sleepData) => {
    // In a real app, this would send data to an API
    try {
      // Get existing data from localStorage
      const existingData = localStorage.getItem('sleepTrackerData');
      let sleepTrackerData = existingData ? JSON.parse(existingData) : [];
      
      if (editMode) {
        // Replace the edited entry
        sleepTrackerData = sleepTrackerData.map(entry => 
          entry.id === sleepData.id ? sleepData : entry
        );
        setMessage('Sleep log updated successfully!');
      } else {
        // Add new entry
        sleepTrackerData.push(sleepData);
        setMessage('Sleep log saved successfully!');
      }
      
      // Save to localStorage
      localStorage.setItem('sleepTrackerData', JSON.stringify(sleepTrackerData));
      
      setMessageType('success');
      
      // Reset form or redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving sleep data:', error);
      setMessage('Failed to save sleep log. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="container-md fade-in">
      <div className="mb-8">
        <h1 className="page-title">
          {editMode ? 'Edit Sleep Log' : 'Log Your Sleep'}
        </h1>
        <p className="page-subtitle">
          {editMode 
            ? 'Update the details of your sleep record' 
            : 'Track your sleep patterns to get insights and improve your rest'
          }
        </p>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          messageType === 'success' ? 'form-success' : 'form-error'
        }`}>
          {message}
        </div>
      )}
      
      <div className="form-container slide-in-up">
        <SleepLogForm 
          onSubmit={handleSubmit} 
          initialValues={initialValues}
        />
      </div>
      
      <div className="mt-8 tip-card">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Tips for Accurate Sleep Tracking</h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Log your sleep consistently every day for the most accurate insights.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Rate your sleep quality based on how refreshed you feel upon waking.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Include notes about factors that may have affected your sleep (stress, caffeine, exercise, etc.).</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>For best results, log your sleep shortly after waking while the details are fresh in your mind.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LogSleep;
