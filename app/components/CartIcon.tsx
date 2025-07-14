'use client';

import { useCart } from '../contexts/CartContext';
import Link from 'next/link';

export default function CartIcon() {
  const { state } = useCart();

  return (
    <Link href="/cart" className="relative group">
      <div className="relative p-2 text-white/90 hover:text-white transition-colors">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        
        {/* Cart Count Badge */}
        {state.itemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="p-3">
          <div className="text-sm font-medium text-gray-900">Shopping Cart</div>
          <div className="text-xs text-gray-600 mt-1">
            {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} • PKR {state.total.toLocaleString('en-PK')}
          </div>
        </div>
      </div>
    </Link>
  );
} 