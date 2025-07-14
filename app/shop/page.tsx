import ShopClient from './ShopClient';

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return await res.json();
}

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
} 