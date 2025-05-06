import React, { useState, useEffect } from 'react';

const ReminderSettings = () => {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    time: '22:00',
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    message: 'Time to prepare for bed!',
    enabled: true
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load reminders from localStorage on mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('sleepReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sleepReminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('day-')) {
      const day = name.replace('day-', '');
      setFormData({
        ...formData,
        days: {
          ...formData.days,
          [day]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing reminder
      setReminders(reminders.map(reminder => 
        reminder.id === formData.id ? formData : reminder
      ));
    } else {
      // Add new reminder
      const newReminder = {
        ...formData,
        id: `reminder-${Date.now()}`
      };
      setReminders([...reminders, newReminder]);
    }
    
    // Reset form and hide it
    resetForm();
  };

  const handleEdit = (id) => {
    const reminderToEdit = reminders.find(reminder => reminder.id === id);
    setFormData(reminderToEdit);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const handleToggle = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      time: '22:00',
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      message: 'Time to prepare for bed!',
      enabled: true
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const formatDays = (days) => {
    const dayNames = Object.keys(days).filter(day => days[day]);
    
    if (dayNames.length === 7) return 'Every day';
    if (dayNames.length === 0) return 'Never';
    if (dayNames.length === 5 && 
        days.monday && days.tuesday && days.wednesday && days.thursday && days.friday) {
      return 'Weekdays';
    }
    if (dayNames.length === 2 && days.saturday && days.sunday) {
      return 'Weekends';
    }
    
    return dayNames
      .map(day => day.charAt(0).toUpperCase() + day.slice(1, 3))
      .join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Bedtime Reminders</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Reminder'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <input
                type="text"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat on
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.days).map(([day, isChecked]) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={`day-${day}`}
                    checked={isChecked}
                    onChange={handleChange}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? 'Update Reminder' : 'Save Reminder'}
            </button>
          </div>
        </form>
      )}

      {reminders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reminders set yet. Add your first bedtime reminder!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reminders.map(reminder => (
            <li 
              key={reminder.id} 
              className={`border rounded-lg p-4 flex justify-between items-center ${
                reminder.enabled ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div>
                <div className="flex items-center space-x-3">
                  <span className={`text-lg font-medium ${reminder.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
                    {reminder.time}
                  </span>
                  <span className={`text-sm ${reminder.enabled ? 'text-gray-600' : 'text-gray-400'}`}>
                    {formatDays(reminder.days)}
                  </span>
                </div>
                <p className={reminder.enabled ? 'text-gray-600' : 'text-gray-400'}>
                  {reminder.message}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggle(reminder.id)}
                  className={`p-2 rounded-full ${
                    reminder.enabled 
                      ? 'text-indigo-600 hover:bg-indigo-50' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={reminder.enabled ? 'Disable' : 'Enable'}
                >
                  {reminder.enabled ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleEdit(reminder.id)}
                  className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="p-2 text-red-600 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderSettings;
