import React, { useState, ChangeEvent, FormEvent } from 'react';

interface BannerModalProps {
  onClose: () => void;
  onSubmit?: (data: { title: string; link: string; image: File | null }) => void;
}

const BannerModal: React.FC<BannerModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const isValidLink = (link: string) => {
    try {
      new URL(link); // Absolute URL
      return true;
    } catch {
      return link.startsWith('/'); // Allow relative path
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    if (!isValidLink(link)) {
      setLinkError('Please enter a valid URL or a path starting with /');
      return;
    }
    setSubmitting(true);
    if (onSubmit) {
      onSubmit({ title, link, image });
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Link</label>
            <input
              type="text"
              value={link}
              onChange={e => setLink(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="https://example.com or /shop"
              required
            />
            {linkError && <div className="text-red-500 text-sm mt-1">{linkError}</div>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerModal; 