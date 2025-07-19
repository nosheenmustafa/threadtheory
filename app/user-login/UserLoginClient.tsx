"use client";
import UserLoginForm from './UserLoginForm';
import UserRegisterForm from './UserRegisterForm';
import { useState } from 'react';

export default function UserLoginClient() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <div className="flex mb-6">
          <button
            onClick={() => setShowRegister(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${!showRegister ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${showRegister ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Register
          </button>
        </div>
        {showRegister ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">User Registration</h1>
            <p className="text-gray-600 text-center mb-8">Create a new user account</p>
            <UserRegisterForm />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">User Login</h1>
            <p className="text-gray-600 text-center mb-8">Login to your account</p>
            <UserLoginForm />
          </>
        )}
      </div>
    </main>
  );
} 