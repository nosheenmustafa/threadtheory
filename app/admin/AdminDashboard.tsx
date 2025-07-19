'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductModal from './components/ProductModal';
import ProductsList from './components/ProductsList';
import BannerModal from './components/BannerModal';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPeriod, setOrdersPeriod] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    // Check authentication status on component mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    
    if (authStatus === 'true' && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setUserName(name || email);
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (activeSection === 'products') {
      fetchProducts();
    }
    if (activeSection === 'orders') {
      fetchOrders(ordersPeriod);
    }
    // Fetch total users
    fetch('/api/auth/user-register')
      .then(res => res.json())
      .then(data => setTotalUsers(data.count))
      .catch(() => setTotalUsers(null));
    // Fetch total sales for selected period
    fetchTotalSales(salesPeriod);
  }, [activeSection, salesPeriod, ordersPeriod]);

  const fetchTotalSales = async (period: string) => {
    try {
      const res = await fetch(`/api/orders?period=${period}`);
      const data = await res.json();
      setTotalSales(data.totalSales);
    } catch {
      setTotalSales(null);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async (period: string) => {
    setOrdersLoading(true);
    try {
      const response = await fetch(`/api/orders?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setOrdersCount(data.orders ? data.orders.length : 0);
      } else {
        setOrders([]);
        setOrdersCount(0);
      }
    } catch (error) {
      setOrders([]);
      setOrdersCount(0);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const handleAddProduct = async (productData: {
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
  }) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowProductModal(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh the products list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const handleUpdateProduct = async (productId: string, productData: {
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
  }) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowProductModal(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh the products list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p._id !== productId));
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Banner logic
  const handleAddBanner = async (bannerData: { title: string; link: string; image: File | null }) => {
    if (!bannerData.image) {
      alert('Please select an image.');
      return;
    }
    try {
      // 1. Upload image to /api/upload (returns { imageUrl })
      const formData = new FormData();
      formData.append('image', bannerData.image);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) {
        throw new Error('Image upload failed');
      }
      const { imageUrl } = await uploadRes.json();
      // 2. Save banner to /api/banners
      const bannerRes = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bannerData.title,
          link: bannerData.link,
          image: imageUrl,
        }),
      });
      if (!bannerRes.ok) {
        throw new Error('Failed to save banner');
      }
      alert('Banner added successfully!');
      setShowBannerModal(false);
    } catch (error: any) {
      alert(error.message || 'Error adding banner');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeSection === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Dashboard
            </button>
            
            {/* Products Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('products')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeSection === 'products'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📦 Products
              </button>
              {activeSection === 'products' && (
                <div className="ml-4 space-y-1">
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    ➕ Add Product
                  </button>
                  <button
                    onClick={fetchProducts}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    🔄 Refresh List
                  </button>
                </div>
              )}
            </div>
            {/* Banner Dropdown */}
            <div className="space-y-1 mt-2">
              <button
                onClick={() => setShowBannerModal(true)}
                className="w-full text-left px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
              >
                🖼️ Add Banner
              </button>
            </div>
            {/* Orders Section */}
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeSection === 'orders'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📦 Orders
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'products' ? 'Products Management' : activeSection === 'orders' ? 'Orders' : ''}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dashboard Cards */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">📊</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Sales
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {totalSales !== null ? `PKR ${totalSales.toLocaleString('en-PK')}` : 'Loading...'}
                            </dd>
                          </dl>
                        </div>
                      </div>
                      {/* Sales Period Dropdown */}
                      <div>
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={salesPeriod}
                          onChange={e => setSalesPeriod(e.target.value as any)}
                        >
                          <option value="today">Today</option>
                          <option value="yesterday">Yesterday</option>
                          <option value="week">Last 7 Days</option>
                          <option value="month">Last 30 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">👥</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Users
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {totalUsers !== null ? totalUsers.toLocaleString() : 'Loading...'}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">📦</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Products
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {products.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">New user registered</span>
                      <span className="text-xs text-gray-400">2 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Order #1234 completed</span>
                      <span className="text-xs text-gray-400">5 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Product inventory updated</span>
                      <span className="text-xs text-gray-400">10 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Product
                </button>
              </div>

              {productsLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading products...</div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="p-6">
                    <ProductsList
                      products={products}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
                <div className="flex items-center space-x-4">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={ordersPeriod}
                    onChange={e => setOrdersPeriod(e.target.value as any)}
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                  <span className="text-gray-700 text-sm font-semibold">Orders: {ordersCount}</span>
                </div>
              </div>
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading orders...</div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-lg">No orders found.</div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-xl">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b">Order number</th>
                            <th className="px-4 py-2 border-b">Order ID</th>
                            <th className="px-4 py-2 border-b">User</th>
                            <th className="px-4 py-2 border-b">Address</th>
                            <th className="px-4 py-2 border-b">Products</th>
                            <th className="px-4 py-2 border-b">Total</th>
                            <th className="px-4 py-2 border-b">Date</th>
                            <th className="px-4 py-2 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order: any, idx: number) => (
                            <tr key={order._id}>
                              <td className="px-4 py-2 border-b text-xs">{idx + 1}</td>
                              <td className="px-4 py-2 border-b text-xs">{order._id}</td>
                              <td className="px-4 py-2 border-b text-xs">{order.userId}</td>
                              <td className="px-4 py-2 border-b text-xs">
                                {order.address ? (
                                  <div>
                                    <div>{order.address.street}</div>
                                    <div>{order.address.city}, {order.address.state}</div>
                                    <div>{order.address.zipCode}, {order.address.country}</div>
                                  </div>
                                ) : 'N/A'}
                              </td>
                              <td className="px-4 py-2 border-b text-xs">
                                <ul>
                                  {order.products.map((item: any, idx: number) => (
                                    <li key={idx}>
                                      {item.product?.title || 'Product'} x {item.quantity}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="px-4 py-2 border-b text-xs text-green-700 font-bold">PKR {order.totalPrice?.toLocaleString('en-PK')}</td>
                              <td className="px-4 py-2 border-b text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                              <td className="px-4 py-2 border-b text-xs">
                                <select
                                  className={`border rounded px-2 py-1 text-xs font-semibold
                                    ${order.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                                    ${order.status === 'shipped' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' : ''}
                                  `}
                                  value={order.status || 'pending'}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    try {
                                      const res = await fetch('/api/orders', {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ orderId: order._id, status: newStatus }),
                                      });
                                      if (res.ok) {
                                        setOrders((prev: any[]) => prev.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                                      } else {
                                        alert('Failed to update status');
                                      }
                                    } catch {
                                      alert('Failed to update status');
                                    }
                                  }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <BannerModal onClose={() => setShowBannerModal(false)} onSubmit={handleAddBanner} />
      )}
      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={handleCloseModal}
        onSubmit={handleAddProduct}
        onUpdate={handleUpdateProduct}
        editingProduct={editingProduct}
        loading={false}
      />
    </div>
  );
} 