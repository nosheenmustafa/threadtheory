"use client";

import Link from "next/link";
import CartIcon from "./CartIcon";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo/Title */}
          <Link href="/" className="text-white text-xl font-bold">
            ThreadTheory
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 text-white focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          {/* Cart icon for mobile */}
          <div className="md:hidden ml-2">
            <CartIcon />
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-lg shadow-lg py-4 px-4 absolute left-0 right-0 top-full z-40 animate-fade-in-up">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/user-login"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 hover:bg-blue-600 backdrop-blur-sm border border-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                User Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 