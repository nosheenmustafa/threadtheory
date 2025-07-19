import ProductDisplay from './components/ProductDisplay';
import CartIcon from './components/CartIcon';
import BannerSlider from './components/BannerSlider';

async function getProducts() {
  console.log('SITE_URL:', process.env.SITE_URL);
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function HomePage() {
  console.log('SITE_URL:', process.env.SITE_URL);
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/banners`, { cache: 'no-store' });
  const banners = res.ok ? await res.json() : [];
  const products = await getProducts();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Banner Slider replaces HeroSection */}
      <BannerSlider banners={banners} />
      {/* Product Display Component with server-fetched products */}
      <ProductDisplay products={products} />
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">ThreadTheory</h3>
              </div>
              <p className="text-gray-400">
                Where fashion meets artistry. Your destination for handcrafted elegance and unique style.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/shop" className="hover:text-white transition-colors">Shop</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: threadtheory258@gmail.com<br />
                Phone: 03265282388
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ThreadTheory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
