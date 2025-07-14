import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Product from '@/app/models/Product';

// DELETE - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, price, image, description, category } = await request.json();

    // Validate input
    if (!title || !price || !image || !description || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        title,
        price: parseFloat(price),
        image,
        description,
        category,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Product updated successfully',
        product
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 

// GET - Fetch a single product (lean, plain object)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).select('title price image description category createdAt');
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    // Convert to plain object
    const plainProduct = {
      _id: product._id.toString(),
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      createdAt: product.createdAt,
    };
    return NextResponse.json(plainProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 