"use client";

import AddToCartButton from '@/app/components/AddToCartButton';
import ProductActions from './ProductActions';
import ProductFeedback from './ProductFeedback';

export default function ProductDetailClient({ product }: { product: any }) {
  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Product Detail Section */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
                />
              </div>
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-gray-500 text-sm break-all">
                  Product ID: {product._id}
                </span>
              </div>
            </div>
            {/* Product Information */}
            <div className="space-y-8">
              {/* Title and Price */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
                  {product.title}
                </h1>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-6">
                  {formatPrice(product.price)}
                </div>
              </div>
              {/* Description */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>
              {/* Product Details */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Added:</span>
                    <span className="font-medium text-gray-900">
                      {product.formattedCreatedAt}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center py-2">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium text-green-600">In Stock</span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="space-y-4">
                <AddToCartButton 
                  product={product} 
                  className="w-full"
                  showQuantity={true}
                />
                <ProductActions product={product} />
              </div>
              {/* Like/Dislike/Comment Feedback */}
              <ProductFeedback productId={product._id} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 