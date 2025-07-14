import type { NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongoClient';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/mongodb';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' as SessionStrategy },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        (session.user as any).id = token.sub;
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