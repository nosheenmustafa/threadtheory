'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on component mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (authStatus === 'true' && email) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Access the admin dashboard</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
              showLogin
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
              !showLogin
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {showLogin ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Login to access the admin dashboard
            </p>
            <a
              href="/login"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 block text-center"
            >
              Go to Login
            </a>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Create a new admin account
            </p>
            <a
              href="/register"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 block text-center"
            >
              Go to Registration
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 