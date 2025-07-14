"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ShopClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  // Optionally, you can re-fetch products on mount if you want freshest data
  // useEffect(() => {
  //   async function fetchProducts() {
  //     setLoading(true);
  //     try {
  //       const res = await fetch('/api/products');
  //       if (res.ok) {
  //         const data = await res.json();
  //         setProducts(data);
  //       }
  //     } catch (e) {
  //       setProducts([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchProducts();
  // }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Shop</h1>
      <p className="mb-8 text-lg">Browse our products here.</p>
      {loading ? (
        <div className="text-lg">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
          {products.map(product => (
            <Link key={product._id} href={`/shop/${product._id}`} className="block bg-white rounded-xl shadow hover:shadow-lg transition p-4">
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-green-600 font-bold mb-2">PKR {product.price.toLocaleString('en-PK')}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
} 