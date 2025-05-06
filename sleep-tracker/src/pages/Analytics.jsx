import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SleepChart from '../components/SleepChart';

const Analytics = () => {
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('duration');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      try {
        const storedData = localStorage.getItem('sleepTrackerData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setSleepData(parsedData);
        }
      } catch (error) {
        console.error('Error fetching sleep data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartTypes = [
    { id: 'duration', name: 'Sleep Duration' },
    { id: 'quality', name: 'Sleep Quality' },
    { id: 'bedtime', name: 'Bedtime Consistency' }
  ];

  return (
    <div className="container-xl fade-in">
      <div className="mb-8">
        <h1 className="page-title">Sleep Analytics</h1>
        <p className="page-subtitle">
          Visualize and analyze your sleep patterns
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="loading-spinner inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading your sleep data<span className="loading-dots"></span></p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {chartTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveChart(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeChart === type.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card-hover p-6 mb-8">
            {sleepData.length > 0 ? (
              <SleepChart sleepData={sleepData} chartType={activeChart} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No sleep data available.</p>
                <p className="mt-2">Start logging your sleep to see analytics.</p>
              </div>
            )}
          </div>

          <div className="card-hover p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sleep Insights</h2>
            <p className="text-gray-700">
              This feature is coming soon. In the future, you'll see AI-powered insights about your sleep patterns here.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
