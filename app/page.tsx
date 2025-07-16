import ProductDisplay from './components/ProductDisplay';
import CartIcon from './components/CartIcon';
import BannerSlider from './components/BannerSlider';

async function getProducts() {
  const res = await fetch('/api/products', { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function HomePage() {
  // Fetch banners from API
  const res = await fetch('/api/banners', { cache: 'no-store' });
  const banners = res.ok ? await res.json() : [];
  const products = await getProducts();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Thread-Based Logo */}
            <div className="flex items-center space-x-4">
              {/* Thread Spool Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {/* Thread Spool */}
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-amber-600 relative">
                    {/* Thread Lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-amber-600 rounded-full"></div>
                    </div>
                    {/* Thread Strands */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-amber-600 animate-bounce"></div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-amber-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-amber-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    <div className="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-amber-600 animate-bounce" style={{animationDelay: '0.6s'}}></div>
                  </div>
                </div>
                {/* Thread Trail */}
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-ping"></div>
              </div>
              {/* Thread-Based Text Logo */}
              <div className="relative">
                <h1 className="text-3xl font-black text-white tracking-wider relative">
                  <span className="relative">
                    Thread
                    {/* Thread Stitches on "Thread" */}
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40 transform -translate-y-1/2"></div>
                  </span>
                  <span className="relative ml-2">
                    Theory
                    {/* Thread Stitches on "Theory" */}
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-40 transform -translate-y-1/2"></div>
                  </span>
                </h1>
                {/* Thread Lines Connecting Letters */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-30 transform -translate-y-1/2"></div>
                {/* Stitching Dots */}
                <div className="absolute -top-1 left-2 w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute -top-1 left-14 w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <div className="absolute -top-1 left-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                <div className="absolute -top-1 left-26 w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                <div className="absolute -bottom-1 left-2 w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute -bottom-1 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -bottom-1 left-14 w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
                <div className="absolute -bottom-1 left-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{animationDelay: '1.1s'}}></div>
                <div className="absolute -bottom-1 left-26 w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '1.4s'}}></div>
              </div>
            </div>
            <nav className="flex items-center space-x-8">
              <a
                href="/"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
              >
                Home
              </a>
              <a
                href="/shop"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
              >
                Shop
              </a>
              <a
                href="/user-login"
                className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:bg-blue-600 backdrop-blur-sm border border-blue-400"
              >
                User Login
              </a>
              <CartIcon />
            </nav>
          </div>
        </div>
      </header>
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
