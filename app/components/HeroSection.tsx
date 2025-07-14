'use client';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 py-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in">
          Welcome to ThreadTheory
        </h2>
        <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
          Where fashion meets artistry. Discover our exquisite collection of handcrafted clothing 
          and accessories that tell your unique story.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-rose-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
} 