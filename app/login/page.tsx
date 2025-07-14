import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-gray-600 text-center mb-8">Access the admin dashboard</p>
        <LoginForm />
      </div>
    </main>
  );
} 