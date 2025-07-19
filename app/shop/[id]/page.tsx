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
  const res = await fetch(`/api/products/${params.id}`, {
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