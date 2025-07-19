import ShopClient from './ShopClient';
import { headers } from 'next/headers';

async function getProducts() {
  const host = (await headers()).get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return await res.json();
}

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
} 