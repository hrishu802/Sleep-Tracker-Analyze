import React, { useState, useEffect } from 'react';
import { PROVIDERS, getSleepData } from '../services/sleepDataService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SleepData = () => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getChartData = () => {
    if (!sleepData || sleepData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const dates = sleepData.map(session => {
      return new Date(session.startTime).toLocaleDateString();
    });

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

  const fetchSleepData = async () => {
    if (!selectedProvider) {
      setError('Please select a provider');
      return;
    }

    setError('');
    setLoading(true);

    try {
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

  const calculateStats = () => {
    if (!sleepData || sleepData.length === 0) {
      return { avgDuration: 0, avgDeep: 0, avgRem: 0 };
    }

    const totalDuration = sleepData.reduce((total, session) => {
      return total + (session.duration / (60 * 60 * 1000));
    }, 0);
    
    const deepSleepTotal = sleepData.reduce((total, session) => {
      const deepDuration = session.stages
        .filter(stage => stage.type === 5 || stage.typeName?.toLowerCase().includes('deep'))
        .reduce((sum, stage) => sum + stage.duration, 0);
        
      return total + (deepDuration / session.duration) * 100;
    }, 0);
    
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

  useEffect(() => {
    const providers = Object.values(PROVIDERS).filter(provider => {
      return localStorage.getItem(`${provider}TokenData`) !== null;
    });
    
    if (providers.length > 0) {
      setSelectedProvider(providers[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchSleepData();
    }
  }, [selectedProvider]);

  const stats = calculateStats();

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  };

  const handleFetchClick = () => {
    fetchSleepData();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">Sleep Data from Connected Services</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Data Provider</label>
          <select
            value={selectedProvider}
            onChange={handleProviderChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="">Select Provider</option>
            {Object.values(PROVIDERS).map(provider => (
              <option key={provider} value={provider}>
                {provider === 'fitbit' ? 'Fitbit' : 
                 provider === 'googleFit' ? 'Google Fit' :
                 provider === 'appleHealth' ? 'Apple Health' : provider}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={handleFetchClick}
            disabled={loading || !selectedProvider}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {sleepData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Average Sleep Duration</p>
              <p className="text-3xl font-bold text-white">{stats.avgDuration} hrs</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Deep Sleep</p>
              <p className="text-3xl font-bold text-white">{stats.avgDeep}%</p>
              <p className="text-xs text-gray-400">(recommended: 15-25%)</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">REM Sleep</p>
              <p className="text-3xl font-bold text-white">{stats.avgRem}%</p>
              <p className="text-xs text-gray-400">(recommended: 20-25%)</p>
            </div>
          </div>
          
          <div className="h-96">
            <Bar data={getChartData()} options={chartOptions} />
          </div>
        </>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>Select a provider and date range to view your sleep data</p>
          {selectedProvider && (
            <p className="mt-2 text-sm">
              If you haven't connected your {selectedProvider} account yet, please visit the Dashboard to set up the connection.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SleepData;