"use client";

import AddToCartButton from '@/app/components/AddToCartButton';
import ProductActions from './ProductActions';
import ProductFeedback from './ProductFeedback';

export default function ProductDetailClient({ product }: { product: any }) {
  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Product Detail Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
              </div>
              {/* Category Badge */}
              <div className="flex items-center space-x-4">
                <span className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-gray-500 text-sm">
                  Product ID: {product._id}
                </span>
              </div>
            </div>
            {/* Product Information */}
            <div className="space-y-8">
              {/* Title and Price */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                <div className="text-3xl font-bold text-green-600 mb-6">
                  {formatPrice(product.price)}
                </div>
              </div>
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>
              {/* Product Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Added:</span>
                    <span className="font-medium text-gray-900">
                      {product.formattedCreatedAt}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
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