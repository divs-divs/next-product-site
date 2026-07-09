'use client';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  countInStock: number;
  image?: string;
};

type Props = {
  category: string;
  currentProductId: string;
};

export default function CategoryItemsGrid({ category, currentProductId }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    let active = true;
    let url = `/api/category-items?category=${encodeURIComponent(category)}`;

    if (category.toLowerCase().includes('electron')) {
      url = '/api/electronics';
    } else if (category.toLowerCase().includes('jewelery') || category.toLowerCase().includes('jewelry')) {
      url = '/api/jewellery';
    }

    fetch(url)
      .then((response) => response.json())
      .then((data: Product[]) => {
        if (!active) return;
        setItems(data.filter((product) => product.id !== currentProductId));
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, currentProductId]);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-indigo-600'>More from this collection</p>
          <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Explore related items</h2>
        </div>
        {loading && <p className='text-sm text-slate-500'>Loading related products...</p>}
      </div>

      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className='group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
          >
            <div className='block overflow-hidden rounded-3xl'>
              <img
                src={product.image || `https://picsum.photos/seed/${encodeURIComponent(product.id)}/600/380`}
                alt={product.name}
                className='h-44 w-full object-cover transition duration-300 group-hover:scale-105'
              />
            </div>
            <div className='mt-4 space-y-3'>
              <div className='block text-lg font-semibold text-slate-900 group-hover:text-blue-600'>{product.name}</div>
              <p className='text-sm leading-6 text-gray-600'>{product.description}</p>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-xs uppercase tracking-[0.25em] text-slate-500'>
                  {product.countInStock} available
                </span>
              </div>
            </div>
          </Link>
        ))}

        {!loading && items.length === 0 && (
          <div className='rounded-[1.75rem] border border-gray-200 bg-white p-8 text-center text-sm text-slate-500'>
            No related items available for this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
