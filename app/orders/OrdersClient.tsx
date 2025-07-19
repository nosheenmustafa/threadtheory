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
      router.push('/login');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">You have no orders yet.</div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-6)}</div>
                    <div className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xl font-bold text-green-600">PKR {order.totalPrice.toLocaleString('en-PK')}</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center py-3">
                      <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded mr-4" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.product.title}</div>
                        <div className="text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-gray-700">PKR {item.product.price.toLocaleString('en-PK')}</div>
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