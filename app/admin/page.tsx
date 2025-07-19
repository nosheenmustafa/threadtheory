import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/authOptions';
import AdminDashboard from './AdminDashboard';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }
  return <AdminDashboard />;
} 