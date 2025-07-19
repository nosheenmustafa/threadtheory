import ShopClient from './ShopClient';

async function getProducts() {
  const res = await fetch('/api/products', { cache: 'no-store' });
  if (!res.ok) return [];
  return await res.json();
}

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
} 