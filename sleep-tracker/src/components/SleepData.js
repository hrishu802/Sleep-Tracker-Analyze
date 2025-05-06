import React, { useState, useEffect } from 'react';
import { PROVIDERS, getSleepData } from '../services/sleepDataService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SleepData = () => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  });
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get chart data for sleep stages
  const getChartData = () => {
    if (!sleepData || sleepData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Extract dates for labels
    const dates = sleepData.map(session => {
      return new Date(session.startTime).toLocaleDateString();
    });

    // Calculate sleep durations by stage
    const awake = sleepData.map(session => {
      return session.stages
        .filter(stage => stage.type === 1 || stage.typeName?.toLowerCase().includes('awake'))
        .reduce((total, stage) => total + (stage.duration / (60 * 60 * 1000)), 0);
    });

    const light = sleepData.map(session => {
      return session.stages
        .filter(stage => stage.type === 4 || stage.typeName?.toLowerCase().includes('light'))
        .reduce((total, stage) => total + (stage.duration / (60 * 60 * 1000)), 0);
    });

    const deep = sleepData.map(session => {
      return session.stages
        .filter(stage => stage.type === 5 || stage.typeName?.toLowerCase().includes('deep'))
        .reduce((total, stage) => total + (stage.duration / (60 * 60 * 1000)), 0);
    });

    const rem = sleepData.map(session => {
      return session.stages
        .filter(stage => stage.type === 6 || stage.typeName?.toLowerCase().includes('rem'))
        .reduce((total, stage) => total + (stage.duration / (60 * 60 * 1000)), 0);
    });

    // Calculate generic sleep (when no detailed stages are available)
    const genericSleep = sleepData.map(session => {
      const hasDetailedStages = session.stages.some(stage => 
        stage.type === 4 || stage.type === 5 || stage.type === 6 ||
        stage.typeName?.toLowerCase().includes('light') ||
        stage.typeName?.toLowerCase().includes('deep') ||
        stage.typeName?.toLowerCase().includes('rem')
      );

      if (!hasDetailedStages) {
        return session.stages
          .filter(stage => stage.type === 2 || stage.typeName?.toLowerCase().includes('sleep'))
          .reduce((total, stage) => total + (stage.duration / (60 * 60 * 1000)), 0);
      }
      return 0;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Awake',
          data: awake,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
        {
          label: 'Light Sleep',
          data: light,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Deep Sleep',
          data: deep,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
        {
          label: 'REM Sleep',
          data: rem,
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
        },
        {
          label: 'Sleep (Unspecified)',
          data: genericSleep,
          backgroundColor: 'rgba(201, 203, 207, 0.7)',
        }
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        title: {
          display: true,
          text: 'Hours',
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      title: {
        display: true,
        text: 'Sleep Stages by Night',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16
        }
      }
    }
  };

  // Fetch sleep data
  const fetchSleepData = async () => {
    if (!selectedProvider) {
      setError('Please select a provider');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Get token data from localStorage
      const tokenDataStr = localStorage.getItem(`${selectedProvider}TokenData`);
      
      if (!tokenDataStr && selectedProvider !== PROVIDERS.APPLE_HEALTH) {
        setError('Please connect to the provider first');
        setLoading(false);
        return;
      }
      
      let accessToken = null;
      
      if (tokenDataStr) {
        const tokenData = JSON.parse(tokenDataStr);
        accessToken = tokenData.access_token;
      }
      
      const data = await getSleepData(
        selectedProvider, 
        dateRange.start, 
        dateRange.end, 
        accessToken
      );
      
      setSleepData(data);
    } catch (err) {
      setError(`Failed to fetch sleep data: ${err.message}`);
      console.error('Error fetching sleep data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate sleep stats
  const calculateStats = () => {
    if (!sleepData || sleepData.length === 0) {
      return { avgDuration: 0, avgDeep: 0, avgRem: 0 };
    }

    // Calculate average total sleep duration in hours
    const totalDuration = sleepData.reduce((total, session) => {
      return total + (session.duration / (60 * 60 * 1000));
    }, 0);
    
    // Calculate average deep sleep percentage
    const deepSleepTotal = sleepData.reduce((total, session) => {
      const deepDuration = session.stages
        .filter(stage => stage.type === 5 || stage.typeName?.toLowerCase().includes('deep'))
        .reduce((sum, stage) => sum + stage.duration, 0);
        
      return total + (deepDuration / session.duration) * 100;
    }, 0);
    
    // Calculate average REM sleep percentage
    const remSleepTotal = sleepData.reduce((total, session) => {
      const remDuration = session.stages
        .filter(stage => stage.type === 6 || stage.typeName?.toLowerCase().includes('rem'))
        .reduce((sum, stage) => sum + stage.duration, 0);
        
      return total + (remDuration / session.duration) * 100;
    }, 0);
    
    return {
      avgDuration: parseFloat((totalDuration / sleepData.length).toFixed(1)),
      avgDeep: parseFloat((deepSleepTotal / sleepData.length).toFixed(1)),
      avgRem: parseFloat((remSleepTotal / sleepData.length).toFixed(1))
    };
  };

  // Check for connected providers
  useEffect(() => {
    const providers = Object.values(PROVIDERS).filter(provider => {
      return localStorage.getItem(`${provider}TokenData`) !== null;
    });
    
    if (providers.length > 0) {
      setSelectedProvider(providers[0]);
    }
  }, []);

  // Fetch data when provider or date range changes
  useEffect(() => {
    if (selectedProvider) {
      fetchSleepData();
    }
  }, [selectedProvider]);

  const stats = calculateStats();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Sleep Data Analysis</h2>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Data Source</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="">Select a provider</option>
            {Object.entries(PROVIDERS).map(([key, value]) => (
              <option key={value} value={value}>
                {key.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        
        <div className="flex items-end">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={fetchSleepData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {sleepData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-sm text-gray-400 mb-1">Average Sleep Duration</h3>
              <p className="text-2xl font-bold">{stats.avgDuration} <span className="text-sm">hours</span></p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-sm text-gray-400 mb-1">Average Deep Sleep</h3>
              <p className="text-2xl font-bold">{stats.avgDeep}% <span className="text-sm">of total</span></p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-sm text-gray-400 mb-1">Average REM Sleep</h3>
              <p className="text-2xl font-bold">{stats.avgRem}% <span className="text-sm">of total</span></p>
            </div>
          </div>
          
          <div className="h-80 md:h-96">
            <Bar data={getChartData()} options={chartOptions} />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Sleep Sessions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bedtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Wake Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sleepData.map((session, index) => (
                    <tr key={session.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(session.startTime).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {(session.duration / (60 * 60 * 1000)).toFixed(1)} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {session.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!loading && sleepData.length === 0 && !error && (
        <div className="text-center py-10 text-gray-400">
          <p>No sleep data to display. Please select a provider and date range.</p>
        </div>
      )}
    </div>
  );
};

export default SleepData; 