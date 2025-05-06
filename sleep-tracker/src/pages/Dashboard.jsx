import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SleepSummaryCard from '../components/SleepSummaryCard';
import SleepChart from '../components/SleepChart';
import TipsList from '../components/TipsList';
import ConnectDevices from '../components/ConnectDevices';
import SleepData from '../components/SleepData';
import { useAuth } from '../context/AuthContext';
import { getSampleSleepData, generateSleepRecommendations, calculateSleepProgress, getSleepGoalAdvice } from '../utils/sleepUtils';

const Dashboard = () => {
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [sleepProgress, setSleepProgress] = useState({ percentage: 0, averageDuration: 0, deficit: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser } = useAuth();

  useEffect(() => {
    // In a real app, fetch data from API or localStorage
    const fetchData = () => {
      setLoading(true);
      try {
        // Get user sleep goal from settings
        const userSettings = JSON.parse(localStorage.getItem('sleepTrackerSettings')) || {};
        setSleepGoal(userSettings.sleepGoal || 8);
        
        // Check if we have data in localStorage
        const storedData = localStorage.getItem('sleepTrackerData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setSleepData(parsedData);
          setRecommendations(generateSleepRecommendations(parsedData));
          
          // Calculate progress towards sleep goal
          const progress = calculateSleepProgress(parsedData, userSettings.sleepGoal || 8);
          setSleepProgress(progress);
        } else {
          // Use sample data for demo
          const sampleData = getSampleSleepData();
          setSleepData(sampleData);
          setRecommendations(generateSleepRecommendations(sampleData));
          
          // Calculate progress with sample data
          const progress = calculateSleepProgress(sampleData, userSettings.sleepGoal || 8);
          setSleepProgress(progress);
          
          // Save sample data to localStorage
          localStorage.setItem('sleepTrackerData', JSON.stringify(sampleData));
        }
      } catch (error) {
        console.error('Error fetching sleep data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate averages for dashboard stats
  const calculateStats = () => {
    if (sleepData.length === 0) return { avgDuration: 0, avgQuality: 0 };
    
    const totalDuration = sleepData.reduce((sum, entry) => sum + entry.duration, 0);
    const totalQuality = sleepData.reduce((sum, entry) => sum + entry.quality, 0);
    
    return {
      avgDuration: (totalDuration / sleepData.length).toFixed(1),
      avgQuality: Math.round(totalQuality / sleepData.length)
    };
  };

  const stats = calculateStats();
  
  // Get latest entry
  const latestEntry = sleepData.length > 0 
    ? sleepData.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  // Get recent entries (last 7 days)
  const recentEntries = sleepData.length > 0
    ? sleepData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7)
    : [];

  return (
    <div className="container-xl fade-in">
      <div className="mb-8">
        <h1 className="page-title">
          Welcome, {currentUser?.name || 'User'}
        </h1>
        <p className="page-subtitle">
          Here's your sleep overview and recent activity
        </p>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`${
                activeTab === 'connected'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Connected Devices
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`${
                activeTab === 'api'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              API Data
            </button>
          </nav>
        </div>
      </div>

      {loading && activeTab === 'dashboard' ? (
        <div className="text-center py-12">
          <div className="loading-spinner inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading your sleep data<span className="loading-dots"></span></p>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card slide-in-up" style={{animationDelay: '0.1s'}}>
                  <h3 className="stat-label">Average Sleep Duration</h3>
                  <div className="flex items-end justify-between">
                    <p className="stat-value">{stats.avgDuration}h</p>
                    <span className="text-sm text-gray-500">per night</span>
                  </div>
                </div>
                
                <div className="stat-card slide-in-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="stat-label">Average Sleep Quality</h3>
                  <div className="flex items-end justify-between">
                    <p className="stat-value">{stats.avgQuality}/100</p>
                    <span className="text-sm text-gray-500">average rating</span>
                  </div>
                </div>
                
                <div className="stat-card slide-in-up" style={{animationDelay: '0.3s'}}>
                  <h3 className="stat-label">Sleep Goal</h3>
                  <div className="flex items-end justify-between">
                    <p className="stat-value">{sleepGoal}h</p>
                    <Link to="/profile" className="text-sm text-indigo-600 hover:text-indigo-800">Adjust</Link>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${sleepProgress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{sleepProgress.averageDuration}h avg</span>
                      <span className="text-xs text-gray-500">{sleepProgress.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="dashboard-layout">
                <div className="lg:col-span-2">
                  {/* Sleep Chart */}
                  <div className="mb-6 card-hover slide-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Sleep Duration</h2>
                      <Link to="/analytics" className="text-sm text-indigo-600 hover:text-indigo-800">
                        View all analytics
                      </Link>
                    </div>
                    <SleepChart sleepData={recentEntries} chartType="duration" />
                  </div>
                  
                  {/* Latest Entry */}
                  <div className="mb-6 slide-in-up" style={{animationDelay: '0.5s'}}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Latest Sleep Log</h2>
                      <Link to="/log-sleep" className="text-sm text-indigo-600 hover:text-indigo-800">
                        Log new entry
                      </Link>
                    </div>
                    <SleepSummaryCard sleepData={latestEntry} />
                  </div>
                </div>
                
                <div>
                  {/* Sleep Goal Progress */}
                  <div className="mb-6 slide-in-up" style={{animationDelay: '0.55s'}}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sleep Goal Progress</h2>
                    <div className="card-hover p-4">
                      <p className="text-gray-700 mb-3">{getSleepGoalAdvice(sleepProgress.percentage, sleepProgress.deficit)}</p>
                      <Link to="/profile" className="text-sm text-indigo-600 hover:text-indigo-800">
                        Update your sleep goal
                      </Link>
                    </div>
                  </div>
                
                  {/* Sleep Recommendations */}
                  <div className="mb-6 slide-in-up" style={{animationDelay: '0.6s'}}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
                    {recommendations.length > 0 ? (
                      <div className="card-hover">
                        <ul className="space-y-3">
                          {recommendations.map((recommendation, index) => (
                            <li key={index} className="recommendation-card">
                              <span className="text-gray-700">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="card-hover text-center text-gray-500">
                        <p>No recommendations available yet. Keep logging your sleep!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Sleep Tips */}
                  <div className="slide-in-up" style={{animationDelay: '0.7s'}}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tips for Better Sleep</h2>
                    <TipsList category="bedtime-routine" limit={3} />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'connected' && (
            <div className="fade-in">
              <ConnectDevices />
            </div>
          )}

          {activeTab === 'api' && (
            <div className="fade-in">
              <SleepData />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
