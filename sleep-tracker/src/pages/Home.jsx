import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Improve Your Sleep. Enhance Your Life.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            Track, analyze, and improve your sleep patterns with our comprehensive sleep tracker and analyzer.
          </p>
          
          {currentUser ? (
            <Link
              to="/dashboard"
              className="bg-indigo-700 text-white py-3 px-8 rounded-full font-medium text-lg hover:bg-indigo-800 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-indigo-700 text-white py-3 px-8 rounded-full font-medium text-lg hover:bg-indigo-800 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-indigo-400 text-white py-3 px-8 rounded-full font-medium text-lg hover:bg-indigo-900 hover:bg-opacity-30 transition-colors"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            The Complete Sleep Management Solution
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-md border border-gray-700">
              <div className="text-4xl mb-4 text-indigo-400">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-white">Comprehensive Tracking</h3>
              <p className="text-gray-300">
                Log your sleep patterns, duration, quality, and notes. Build a complete picture of your sleep health.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl shadow-md border border-gray-700">
              <div className="text-4xl mb-4 text-indigo-400">📈</div>
              <h3 className="text-xl font-semibold mb-3 text-white">Smart Analytics</h3>
              <p className="text-gray-300">
                Visualize your sleep data with intuitive charts and graphs. Identify trends and areas for improvement.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl shadow-md border border-gray-700">
              <div className="text-4xl mb-4 text-indigo-400">🔔</div>
              <h3 className="text-xl font-semibold mb-3 text-white">Bedtime Reminders</h3>
              <p className="text-gray-300">
                Set customizable reminders to maintain a consistent sleep schedule and develop better habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center text-indigo-300 text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Track Your Sleep</h3>
              <p className="text-gray-300">Log when you go to bed and wake up, plus rate your sleep quality.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center text-indigo-300 text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Review Analytics</h3>
              <p className="text-gray-300">See visualizations of your sleep patterns and identify trends.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center text-indigo-300 text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Get Insights</h3>
              <p className="text-gray-300">Receive personalized recommendations based on your sleep data.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center text-indigo-300 text-xl font-bold mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Improve Sleep</h3>
              <p className="text-gray-300">Follow recommendations and build better sleep habits over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Sleep?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who have improved their sleep quality and overall health with our app.
          </p>
          
          {currentUser ? (
            <Link
              to="/log-sleep"
              className="bg-indigo-700 text-white py-3 px-8 rounded-full font-medium text-lg hover:bg-indigo-800 transition-colors"
            >
              Log Your Sleep
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-indigo-700 text-white py-3 px-8 rounded-full font-medium text-lg hover:bg-indigo-800 transition-colors"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
