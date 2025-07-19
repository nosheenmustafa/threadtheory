"use client";

import Link from "next/link";
import CartIcon from "./CartIcon";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo/Title */}
          <Link href="/" className="text-white text-xl font-bold">
            ThreadTheory
          </Link>
          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              Shop
            </Link>
            <Link
              href="/user-login"
              className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-blue-600 backdrop-blur-sm border border-blue-400"
            >
              User Login
            </Link>
            <CartIcon />
          </nav>
        </div>
      </div>
    </header>
  );
} 