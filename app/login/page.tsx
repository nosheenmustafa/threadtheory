import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">Access the admin dashboard</p>
        <LoginForm />
      </div>
    </main>
  );
} 