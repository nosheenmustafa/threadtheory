import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/app/components/AddToCartButton';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Fetch product from API route with caching
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${params.id}`, {
    next: { revalidate: 60 }, // cache for 60 seconds
    cache: 'force-cache',
  });
  if (!res.ok) {
    notFound();
  }
  const product = await res.json();
  // Pre-format the createdAt date on the server
  const formattedCreatedAt = product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Thread-Based Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-amber-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 rounded-full"></div>
                    </div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-amber-600 animate-bounce"></div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-amber-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-amber-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    <div className="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-amber-600 animate-bounce" style={{animationDelay: '0.6s'}}></div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-ping"></div>
              </div>
              <div className="relative">
                <h1 className="text-3xl font-black text-white tracking-wider relative">
                  <span className="relative">
                    Thread
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40 transform -translate-y-1/2"></div>
                  </span>
                  <span className="relative ml-2">
                    Theory
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-40 transform -translate-y-1/2"></div>
                  </span>
                </h1>
              </div>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
              >
                Shop
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-rose-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-rose-500 transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>
      {/* Product Detail Client (all interactive UI) */}
      <ProductDetailClient product={{ ...product, formattedCreatedAt }} />
    </>
  );
} 