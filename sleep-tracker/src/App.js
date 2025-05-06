import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogSleep from './pages/LogSleep';
import Analytics from './pages/Analytics';
import Tips from './pages/Tips';
import Profile from './pages/Profile';

// Import styles - note that the CSS is actually imported in index.js

// Layout component
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto py-4 bg-gray-900 text-gray-300 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Sleep Tracker & Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Create router with routes
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "log-sleep", element: <LogSleep /> },
      { path: "analytics", element: <Analytics /> },
      { path: "tips", element: <Tips /> },
      { path: "profile", element: <Profile /> }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
