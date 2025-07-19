"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user || !(session.user as any).id) {
      router.push("/login");
      return;
    }
    // Fetch user orders
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?userId=${(session.user as any).id}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading your orders...</div>;
  }

  if (!orders.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
        <p className="mb-4">You have not placed any orders yet.</p>
        <Link href="/shop" className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-purple-700 transition-all duration-200">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-8">
        {orders.map((order, idx) => (
          <div key={order._id || idx} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-semibold text-gray-700">Order ID:</span> {order._id}
              </div>
              <div className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Total:</span> <span className="text-green-600 font-bold">PKR {order.totalPrice?.toLocaleString("en-PK")}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Items:</span>
              <ul className="list-disc ml-6 mt-2">
                {order.products.map((item: any) => (
                  <li key={item.product?._id || item.product} className="mb-1">
                    <span className="font-medium">{item.product?.title || "Product"}</span> x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 