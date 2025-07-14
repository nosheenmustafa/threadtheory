'use client';

import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface AddToCartButtonProps {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
  className?: string;
  showQuantity?: boolean;
}

export default function AddToCartButton({ product, className = '', showQuantity = true }: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product, quantity);
    setShowSuccess(true);
    setIsAdding(false);
    
    // Hide success message after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const currentQuantity = getItemQuantity(product._id);
  const isProductInCart = isInCart(product._id);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showQuantity && (
        <div className="flex items-center space-x-2">
          <label htmlFor={`quantity-${product._id}`} className="text-sm font-medium text-gray-700">
            Qty:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              id={`quantity-${product._id}`}
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border-none focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
          isAdding
            ? 'bg-gray-400 cursor-not-allowed'
            : showSuccess
            ? 'bg-green-600 text-white'
            : isProductInCart
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700'
        }`}
      >
        {isAdding ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Adding...</span>
          </div>
        ) : showSuccess ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Added to Cart!</span>
          </div>
        ) : isProductInCart ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>In Cart ({currentQuantity})</span>
          </div>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );
} 