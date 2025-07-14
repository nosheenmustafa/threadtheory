'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  createdAt: string;
}

interface ProductsListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductsList({ products, onEdit, onDelete }: ProductsListProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.(productId);
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-16 w-16 object-cover rounded-md"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-green-600">{formatPrice(product.price)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {product.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 