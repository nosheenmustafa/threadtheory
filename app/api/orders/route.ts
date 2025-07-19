import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/models/Order';

// GET: Return total sales and total orders, or user orders if userId is provided
export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const period = searchParams.get('period');

  let dateFilter = {};
  if (period) {
    const now = new Date();
    let start: Date, end: Date;
    if (period === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (period === 'yesterday') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
    if (start && end) {
      dateFilter = { createdAt: { $gte: start, $lt: end } };
    }
  }

  if (userId) {
    // Return orders for this user
    const orders = await Order.find({ userId, ...dateFilter }).populate('products.product');
    return NextResponse.json({ orders });
  }
  // Return all orders, total sales, and total orders for admin
  const orders = await Order.find(dateFilter).populate('products.product');
  const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  return NextResponse.json({
    orders,
    totalSales,
    totalOrders: orders.length,
  });
}

// POST: Create a new order
export async function POST(request: NextRequest) {
  await dbConnect();
  const { userId, products, totalPrice, address } = await request.json();
  if (!userId || !Array.isArray(products) || products.length === 0 || typeof totalPrice !== 'number' || !address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  const order = await Order.create({ userId, products, totalPrice, address });
  return NextResponse.json(order, { status: 201 });
}

// PATCH: Update order status
export async function PATCH(request: NextRequest) {
  await dbConnect();
  const { orderId, status } = await request.json();
  const validStatuses = ['pending', 'shipped', 'cancelled'];
  if (!orderId || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid orderId or status' }, { status: 400 });
  }
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order });
} 