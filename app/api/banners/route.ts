import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Banner from '@/app/models/Banner';

// GET: List all banners
export async function GET() {
  await dbConnect();
  const banners = await Banner.find().sort({ createdAt: -1 });
  return NextResponse.json(banners);
}

// POST: Create a new banner
export async function POST(request: NextRequest) {
  await dbConnect();
  const { title, link, image } = await request.json();
  if (!title || !link || !image) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const banner = await Banner.create({ title, link, image });
  return NextResponse.json(banner, { status: 201 });
} 