"use client";
import { useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function ProductDisplay({ products }: { products?: Product[] }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Fancy',
    'Heavy Dress',
    'Light Dress',
    'Embroidery Work',
    'Mirror Work',
    'Mukesh',
    'Tarkashi',
    'Shadow Work',
    'Electronics',
    'Books',
    'Home & Garden',
    'Sports',
    'Other'
  ];

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  const filteredProducts = safeProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter - First */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar - Centered Below Categories */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search our collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {safeProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-gray-500">No products found.</div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedCategory === 'All' ? 'Our Collection' : `${selectedCategory} Collection`}
                </h3>
                <p className="text-gray-600">
                  {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No pieces found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product, index) => (
                    <Link
                      key={product._id}
                      href={`/shop/${product._id}`}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group animate-fade-in-up block"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-64 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </div>
                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            View Details
                          </span>
                        </div>
                      </div>
                      {/* Product Info */}
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description.length > 80
                            ? product.description.slice(0, 80) + '...'
                            : product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          <span className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                            View Details
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
} 