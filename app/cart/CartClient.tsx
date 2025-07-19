"use client";
import { useCart } from '../contexts/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Extend NextAuth session user type
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function CartClient() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderError, setOrderError] = useState<string | null>(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  const handleCheckout = () => {
    const user = session?.user as SessionUser | undefined;
    if (!user?.id) {
      router.push('/login');
      return;
    }
    setShowPayment(true);
  };

  const handlePlaceOrder = async () => {
    setIsCheckingOut(true);
    setOrderError(null);
    try {
      // Validate address
      if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
        setOrderError('Please fill in all address fields.');
        setIsCheckingOut(false);
        return;
      }
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Prepare order data
      const user = session?.user as SessionUser | undefined;
      if (!user?.id) throw new Error('User not authenticated');
      const userId = user.id;
      const products = state.items.map(item => ({ product: item._id, quantity: item.quantity }));
      const totalPrice = state.total;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, products, totalPrice, address }),
      });
      if (!res.ok) {
        throw new Error('Failed to create order');
      }
      clearCart();
      router.push('/user-dashboard');
      setShowPayment(false);
      setPaymentMethod('');
      setAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
    } catch (err: any) {
      setOrderError(err.message || 'Order failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/shop"
              className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
            <div className="space-y-6">
              {state.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-green-600 font-bold">{formatPrice(item.price)}</p>
                  </div>
                  {/* Quantity Controls */}
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                  {/* Total Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({state.itemCount}):</span>
              <span className="font-medium">{formatPrice(state.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(state.total)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || showPayment}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
              isCheckingOut || showPayment
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowPayment(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="Street Address"
                className="w-full px-4 py-2 border rounded"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 border rounded"
                value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-2 border rounded"
                value={address.state}
                onChange={e => setAddress({ ...address, state: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Zip Code"
                className="w-full px-4 py-2 border rounded"
                value={address.zipCode}
                onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full px-4 py-2 border rounded"
                value={address.country}
                onChange={e => setAddress({ ...address, country: e.target.value })}
                required
              />
              {/* ...rest of the modal ... */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 