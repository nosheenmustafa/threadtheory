"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  products: { product: Product; quantity: number }[];
}

export default function OrdersClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(session.user as any).id) {
      router.push('/user-login');
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      const userId = (session.user as any).id;
      const res = await fetch(`/api/orders?userId=${userId}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    };
    fetchOrders();
  }, [session, status, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">You have no orders yet.</div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                  <div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">Order #{order._id.slice(-6)}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-green-600">PKR {order.totalPrice.toLocaleString('en-PK')}</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center py-3 gap-3 sm:gap-0">
                      <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded mb-2 sm:mb-0 sm:mr-4 flex-shrink-0" />
                      <div className="flex-1 w-full text-center sm:text-left">
                        <div className="font-medium text-gray-900 break-words">{item.product.title}</div>
                        <div className="text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-gray-700 mt-2 sm:mt-0 text-center sm:text-right w-full sm:w-auto">PKR {item.product.price.toLocaleString('en-PK')}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 