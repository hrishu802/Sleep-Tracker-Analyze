import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PROVIDERS, startAuth, handleAuthCallback } from '../services/sleepDataService';

const ConnectDevices = () => {
  const { currentUser } = useAuth();
  const [connectedProviders, setConnectedProviders] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        setLoading(true);
        try {
          const provider = state;
          const tokenData = await handleAuthCallback(provider, code);
          
          localStorage.setItem(`${provider}TokenData`, JSON.stringify({
            ...tokenData,
            timestamp: Date.now()
          }));
          
          setConnectedProviders(prev => ({
            ...prev,
            [provider]: true
          }));
          
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setError('Authentication failed. Please try again.');
          console.error('Auth callback error:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleOAuthCallback();
    
    const checkConnectedProviders = () => {
      const connected = {};
      
      Object.values(PROVIDERS).forEach(provider => {
        const tokenData = localStorage.getItem(`${provider}TokenData`);
        if (tokenData) {
          const parsedData = JSON.parse(tokenData);
          
          const isExpired = parsedData.timestamp + (parsedData.expires_in * 1000) < Date.now();
          
          if (!isExpired || parsedData.refresh_token) {
            connected[provider] = true;
          }
        }
      });
      
      setConnectedProviders(connected);
    };
    
    checkConnectedProviders();
  }, []);

  const connectProvider = (provider) => {
    setError('');
    try {
      if (provider === PROVIDERS.FITBIT || provider === PROVIDERS.GOOGLE_FIT) {
        startAuth(provider);
      } else if (provider === PROVIDERS.APPLE_HEALTH) {
        alert('To connect Apple Health data, you need to download our iOS app and grant it permission to read your Health data.');
      }
    } catch (err) {
      setError(`Failed to connect to ${provider}: ${err.message}`);
    }
  };

  const disconnectProvider = (provider) => {
    localStorage.removeItem(`${provider}TokenData`);
    setConnectedProviders(prev => {
      const updated = { ...prev };
      delete updated[provider];
      return updated;
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Connect Your Sleep Tracking Devices</h2>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="font-bold">F</span>
                </div>
                <h3 className="font-medium">Fitbit</h3>
              </div>
              <div className={`h-3 w-3 rounded-full ${connectedProviders[PROVIDERS.FITBIT] ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Connect your Fitbit account to sync sleep data and track your sleep patterns over time.
            </p>
            {connectedProviders[PROVIDERS.FITBIT] ? (
              <button 
                onClick={() => disconnectProvider(PROVIDERS.FITBIT)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
              >
                Disconnect
              </button>
            ) : (
              <button 
                onClick={() => connectProvider(PROVIDERS.FITBIT)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
              >
                Connect
              </button>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="font-bold">G</span>
                </div>
                <h3 className="font-medium">Google Fit</h3>
              </div>
              <div className={`h-3 w-3 rounded-full ${connectedProviders[PROVIDERS.GOOGLE_FIT] ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Sync sleep data from Google Fit and analyze sleep stages recorded by your Android device.
              <br />
              <span className="text-xs text-yellow-500">Note: Google Fit APIs will be deprecated in 2026</span>
            </p>
            {connectedProviders[PROVIDERS.GOOGLE_FIT] ? (
              <button 
                onClick={() => disconnectProvider(PROVIDERS.GOOGLE_FIT)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
              >
                Disconnect
              </button>
            ) : (
              <button 
                onClick={() => connectProvider(PROVIDERS.GOOGLE_FIT)}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition duration-200"
              >
                Connect
              </button>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mr-3">
                  <span className="font-bold">A</span>
                </div>
                <h3 className="font-medium">Apple Health</h3>
              </div>
              <div className={`h-3 w-3 rounded-full ${connectedProviders[PROVIDERS.APPLE_HEALTH] ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Access sleep data from Apple Health (requires downloading our iOS app from the App Store).
            </p>
            <button 
              onClick={() => connectProvider(PROVIDERS.APPLE_HEALTH)}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
            >
              Get iOS App
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-400">
        <p>Your data is securely stored and you can revoke access at any time.</p>
      </div>
    </div>
  );
};

export default ConnectDevices; 