import type { NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongoClient';
import User from '@/app/models/User';
import Admin from '@/app/models/Admin';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/mongodb';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;
        // Try admin login first
        const admin = await Admin.findOne({ email: credentials.email });
        if (admin) {
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) return null;
          if (admin.role !== 'admin') return null;
          return { id: admin._id.toString(), email: admin.email, name: admin.name, role: admin.role };
        }
        // Fallback to user login (if needed elsewhere)
        const user = await User.findOne({ email: credentials.email });
        if (user) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          return { id: user._id.toString(), email: user.email, name: user.name, role: user.role || 'user' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' as SessionStrategy },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
}; 