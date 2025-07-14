'use client';

import { useState, useRef, useEffect } from 'react';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: {
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
  }) => void;
  onUpdate?: (productId: string, productData: {
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
  }) => void;
  editingProduct?: Product | null;
  loading?: boolean;
}

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onUpdate,
  editingProduct, 
  loading = false 
}: ProductModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
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

  // Reset form when modal opens/closes or editing product changes
  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        // Edit mode - pre-fill form
        setTitle(editingProduct.title);
        setPrice(editingProduct.price.toString());
        setDescription(editingProduct.description);
        setCategory(editingProduct.category);
        setImagePreview(editingProduct.image);
        setImageFile(null);
      } else {
        // Add mode - reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  }, [isOpen, editingProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloud = async (file: File): Promise<string> => {
    // First try to upload to Cloudinary
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.imageUrl;
      }
    } catch (error) {
      console.log('Cloudinary upload failed, using fallback method');
    }

    // Fallback: Convert to base64 if Cloudinary is not available
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !description || !category) {
      alert('Please fill in all required fields');
      return;
    }

    // For edit mode, if no new image is selected, use the existing image
    if (!editingProduct && !imageFile) {
      alert('Please select an image');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editingProduct?.image || '';

      // If a new image is selected, upload it
      if (imageFile) {
        imageUrl = await uploadImageToCloud(imageFile);
      }

      const productData = {
        title,
        price: parseFloat(price),
        image: imageUrl,
        description,
        category
      };

      if (editingProduct && onUpdate) {
        // Update existing product
        await onUpdate(editingProduct._id, productData);
      } else {
        // Create new product
        await onSubmit(productData);
      }

      // Reset form
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!editingProduct;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (PKR) *
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Product Image {!isEditMode && '*'}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
                {isEditMode && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 