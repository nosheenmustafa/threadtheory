import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/models/Order';

// GET: Return total sales and total orders, or user orders if userId is provided
export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (userId) {
    // Return orders for this user
    const orders = await Order.find({ userId }).populate('products.product');
    return NextResponse.json({ orders });
  }
  // Return total sales and total orders
  const orders = await Order.find();
  const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  return NextResponse.json({
    totalSales,
    totalOrders: orders.length,
  });
}

// POST: Create a new order
export async function POST(request: NextRequest) {
  await dbConnect();
  const { userId, products, totalPrice } = await request.json();
  if (!userId || !Array.isArray(products) || products.length === 0 || typeof totalPrice !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  const order = await Order.create({ userId, products, totalPrice });
  return NextResponse.json(order, { status: 201 });
} 