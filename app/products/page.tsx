'use client';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PAGE_SIZE = 20;

export default function Products() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCategory = searchParams?.get('category') ?? 'All';
  const initialQuery = searchParams?.get('q') ?? '';

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const data = [...largeData, ...smallData];

  const categories = useMemo(() => {
    const unique = Array.from(new Set(data.map((product) => product.category)));
    return ['All', ...unique.slice(0, 10)];
  }, [data]);

  const filteredData = useMemo(() => {
    const baseData =
      selectedCategory === 'All' ? data : data.filter((product) => product.category === selectedCategory);

    const query = searchQuery.trim().toLowerCase();
    if (!query) return baseData;

    return baseData.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [data, selectedCategory, searchQuery]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  const updateUrl = (category: string, query: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (query.trim()) params.set('q', query.trim());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const nextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    updateUrl(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, pathname]);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='mb-6 w-full max-w-5xl'>
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-3xl font-bold'>Products</h1>
          <Link href='/products' className='text-sm text-blue-600 hover:underline'>
            View all categories
          </Link>
        </div>

        <div className='mt-4 grid gap-4 sm:grid-cols-[1.5fr_1fr]'>
          <div>
            <label htmlFor='product-search' className='sr-only'>
              Search products
            </label>
            <div className='relative'>
              <input
                id='product-search'
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                onBlur={() => updateUrl(selectedCategory, searchQuery)}
                placeholder='Search products, descriptions, or categories'
                className='w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              />
              {searchQuery && (
                <button
                  type='button'
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    updateUrl(selectedCategory, '');
                  }}
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-200'
                >
                  Clear
                </button>
              )}
            </div>
            {searchQuery && (
              <p className='mt-2 text-xs text-gray-500'>Filtering {filteredData.length} matching products.</p>
            )}
          </div>

          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <Link
                key={category}
                href={category === 'All' ? '/products' : `/category/${encodeURIComponent(category)}`}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedCategory === category
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-700'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left gap-4'>
          {productData.length === 0 ? (
            <div className='rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600'>
              No products found for <strong>{selectedCategory}</strong>.
            </div>
          ) : (
            productData.map((product) => (
              <div
                key={product.id}
                className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100'
              >
                <Link href={`/products/${product.id}`}>
                  <h3 className='mb-3 text-2xl font-semibold'>{product.name}</h3>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Price: {product.price}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Description: {product.description}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Category: {product.category}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Rating: {product.rating}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Reviews: {product.numReviews}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Stock: {product.countInStock}</p>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4'>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </main>
  );
}
