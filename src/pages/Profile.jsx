import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sleepGoal: 8,
    bedtimeReminder: false,
    bedtimeReminderTime: '22:00',
    wakeupReminder: false,
    wakeupReminderTime: '07:00',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (currentUser) {
      const userData = JSON.parse(localStorage.getItem('sleepTrackerUser')) || {};
      const userSettings = JSON.parse(localStorage.getItem('sleepTrackerSettings')) || {};
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        sleepGoal: userSettings.sleepGoal || 8,
        bedtimeReminder: userSettings.bedtimeReminder || false,
        bedtimeReminderTime: userSettings.bedtimeReminderTime || '22:00',
        wakeupReminder: userSettings.wakeupReminder || false,
        wakeupReminderTime: userSettings.wakeupReminderTime || '07:00',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
      };
      
      await updateProfile(userData);
      
      const userSettings = {
        sleepGoal: formData.sleepGoal,
        bedtimeReminder: formData.bedtimeReminder,
        bedtimeReminderTime: formData.bedtimeReminderTime,
        wakeupReminder: formData.wakeupReminder,
        wakeupReminderTime: formData.wakeupReminderTime,
      };
      
      localStorage.setItem('sleepTrackerSettings', JSON.stringify(userSettings));
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    }
  };

  if (!currentUser) {
    return (
      <div className="container-xl fade-in">
        <h1 className="page-title mb-6">Profile</h1>
        <div className="card-hover text-center py-10">
          <p className="text-gray-600">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl fade-in">
      <div className="mb-8">
        <h1 className="page-title">Your Profile</h1>
        <p className="page-subtitle">
          Manage your account and sleep preferences
        </p>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-hover p-6 slide-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="card-hover p-6 slide-in-up" style={{animationDelay: '0.2s'}}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sleep Goal</h2>
          
          <form>
            <div className="mb-4">
              <label className="form-label" htmlFor="sleepGoal">Target Sleep Hours</label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="sleepGoal"
                  name="sleepGoal"
                  min="5"
                  max="12"
                  step="0.5"
                  value={formData.sleepGoal}
                  onChange={handleChange}
                  className="w-full form-range mr-4"
                />
                <span className="min-w-[3rem] text-right">{formData.sleepGoal}h</span>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary"
              >
                Update Goal
              </button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-3 card-hover p-6 slide-in-up" style={{animationDelay: '0.3s'}}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Reminders</h2>
          
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-hover p-4 bg-gray-50">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="bedtimeReminder"
                    name="bedtimeReminder"
                    checked={formData.bedtimeReminder}
                    onChange={handleChange}
                    className="form-checkbox mr-2"
                  />
                  <label htmlFor="bedtimeReminder" className="form-label m-0">
                    Bedtime Reminder
                  </label>
                </div>
                <div className={`transition-opacity ${formData.bedtimeReminder ? 'opacity-100' : 'opacity-50'}`}>
                  <label className="form-label" htmlFor="bedtimeReminderTime">Remind me at</label>
                  <input
                    type="time"
                    id="bedtimeReminderTime"
                    name="bedtimeReminderTime"
                    value={formData.bedtimeReminderTime}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!formData.bedtimeReminder}
                  />
                </div>
              </div>
              
              <div className="card-hover p-4 bg-gray-50">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="wakeupReminder"
                    name="wakeupReminder"
                    checked={formData.wakeupReminder}
                    onChange={handleChange}
                    className="form-checkbox mr-2"
                  />
                  <label htmlFor="wakeupReminder" className="form-label m-0">
                    Wake-up Reminder
                  </label>
                </div>
                <div className={`transition-opacity ${formData.wakeupReminder ? 'opacity-100' : 'opacity-50'}`}>
                  <label className="form-label" htmlFor="wakeupReminderTime">Remind me at</label>
                  <input
                    type="time"
                    id="wakeupReminderTime"
                    name="wakeupReminderTime"
                    value={formData.wakeupReminderTime}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!formData.wakeupReminder}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary"
              >
                Save Reminder Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
