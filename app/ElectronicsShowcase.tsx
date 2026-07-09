'use client';

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '@/context/CartContext';

type ElectronicsProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image?: string;
  rating: number;
  countInStock: number;
};

export default function ElectronicsShowcase() {
  const [products, setProducts] = useState<ElectronicsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    fetch('/api/electronics')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 4)); // Show top 4 electronics
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className='space-y-6'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-indigo-600'>Premium Electronics</p>
          <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Latest Tech Gadgets</h2>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-72 rounded-[1.75rem] border border-gray-200 bg-slate-100 animate-pulse' />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className='space-y-6'>
      <div>
        <p className='text-sm uppercase tracking-[0.3em] text-indigo-600'>Premium Electronics</p>
        <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Latest Tech Gadgets</h2>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className='group overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
          >
            <div className='relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center'>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-contain p-4 group-hover:scale-105 transition duration-300'
                />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-slate-200 to-slate-300' />
              )}
            </div>
            <div className='space-y-3 p-4'>
              <h3 className='text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600'>
                {product.name}
              </h3>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-bold text-blue-600'>${product.price}</span>
                <span className='text-xs font-semibold text-yellow-600'>{product.rating.toFixed(1)} ★</span>
              </div>
              <p className='text-xs text-gray-600 line-clamp-2'>{product.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
