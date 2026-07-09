import { NextResponse } from 'next/server';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

function shuffleArray<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || '';
  const allProducts = [...largeData, ...smallData];
  const normalizedCategory = category.toLowerCase();

  const filtered = allProducts.filter((product) => product.category.toLowerCase().includes(normalizedCategory));

  const results = filtered.length ? filtered : allProducts;
  return NextResponse.json(shuffleArray(results).slice(0, 12));
}
