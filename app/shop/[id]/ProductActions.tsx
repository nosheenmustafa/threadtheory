"use client";

import { useCart } from '@/app/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductActions({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'));
    }
  }, []);
  const [shareMsg, setShareMsg] = useState('');

  // Buy Now handler
  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push('/cart');
  };

  // Wishlist handler
  const handleWishlist = () => {
    let newWishlist = wishlist;
    if (!wishlist.find((item: any) => item._id === product._id)) {
      newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  // Share handler
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url,
        });
        setShareMsg('Shared!');
      } catch (e) {
        setShareMsg('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg('Link copied!');
      } catch (e) {
        setShareMsg('Failed to copy');
      }
    }
    setTimeout(() => setShareMsg(''), 2000);
  };

  return (
    <>
      <button
        className="w-full bg-white border-2 border-rose-500 text-rose-500 py-4 px-6 rounded-xl font-semibold hover:bg-rose-50 transition-all duration-200"
        onClick={handleBuyNow}
      >
        Buy Now
      </button>
      <div className="flex items-center space-x-4 mt-2">
        <button
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={handleWishlist}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{wishlist.find((item: any) => item._id === product._id) ? 'Wishlisted' : 'Add to Wishlist'}</span>
        </button>
        <button
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={handleShare}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </div>
      {shareMsg && <div className="text-green-600 text-sm mt-2">{shareMsg}</div>}
    </>
  );
} 