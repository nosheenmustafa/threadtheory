import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Registration</h1>
        <p className="text-gray-600 text-center mb-8">Create a new admin account</p>
        <RegisterForm />
      </div>
    </main>
  );
} 