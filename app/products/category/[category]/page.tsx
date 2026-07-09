'use client';

import { useEffect, useState, useContext, useMemo } from 'react';
import { buildCategoryNavLinks, homepageCategories } from '@/lib/categoryConfig';
import { CartContext } from '@/context/CartContext';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image?: string;
  rating: number;
  numReviews: number;
  countInStock: number;
};

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const cartContext = useContext(CartContext) as {
    cart?: any[];
    addItem?: (item: any) => void;
    updateQuantity?: (id: string, quantity: number) => void;
    removeItem?: (id: string) => void;
  };
  const cart = cartContext?.cart ?? [];
  const addItem = cartContext?.addItem;
  const updateQuantity = cartContext?.updateQuantity;
  const removeItem = cartContext?.removeItem;

  const allLocalProducts = [...largeData, ...smallData];
  const navLinks = buildCategoryNavLinks(allLocalProducts);

  const categoryConfig = homepageCategories.find((c) => c.id === params.category);
  const categoryLabel = categoryConfig?.label || params.category;

  // Map of product IDs to quantities in cart
  const quantityMap = useMemo(
    () => new Map<string, number>((cart || []).map((item: any) => [String(item.id), Number(item.quantity)])),
    [cart]
  );

  const handleQuantityChange = (product: Product, delta: number) => {
    const current = quantityMap.get(product.id) ?? 0;
    const next = current + delta;

    if (!addItem || !updateQuantity || !removeItem) {
      return;
    }

    if (next <= 0) {
      if (current > 0) {
        removeItem(product.id);
      }
      return;
    }

    if (current === 0) {
      addItem({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
      return;
    }

    updateQuantity(product.id, next);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // Fetch from API or use local data
        let apiProducts: Product[] = [];

        if (params.category === 'electronics') {
          const response = await fetch('/api/electronics');
          apiProducts = await response.json();
        } else if (params.category === 'jewelery') {
          const response = await fetch('/api/jewellery');
          apiProducts = await response.json();
        } else {
          // For other categories, use local data
          apiProducts = allLocalProducts.filter((product) => categoryConfig?.match(product.category));
        }

        setProducts(apiProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [params.category, categoryConfig]);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='space-y-10 px-8 py-10 lg:px-16'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-indigo-600'>Category</p>
          <h1 className='mt-3 text-4xl font-semibold text-slate-900'>{categoryLabel}</h1>
          <p className='mt-3 text-gray-600'>Browse our collection of {categoryLabel.toLowerCase()}</p>
        </div>

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-80 rounded-[1.75rem] border border-gray-200 bg-slate-100 animate-pulse' />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {products.map((product) => {
              const quantity = quantityMap.get(product.id) ?? 0;
              const isOutOfStock = product.countInStock === 0;

              return (
                <div
                  key={product.id}
                  className='overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition hover:shadow-lg'
                >
                  <div className='relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center'>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className='h-full w-full object-contain p-4 transition duration-300'
                      />
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-slate-200 to-slate-300' />
                    )}
                  </div>

                  <div className='space-y-4 p-4'>
                    <h3 className='text-sm font-semibold text-slate-900 line-clamp-2'>{product.name}</h3>

                    <p className='text-xs text-gray-600 line-clamp-2'>{product.description}</p>

                    <div className='flex items-center justify-between pt-2'>
                      <span className='text-lg font-bold text-blue-600'>${product.price}</span>
                      <span className='text-xs font-semibold text-yellow-600'>{product.rating.toFixed(1)} ★</span>
                    </div>

                    <div className='space-y-3 pt-2 border-t border-gray-200'>
                      <div className='flex items-center gap-3'>
                        <button
                          type='button'
                          disabled={isOutOfStock || quantity === 0}
                          onClick={() => handleQuantityChange(product, -1)}
                          className='h-10 w-10 rounded-full bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-base'
                          title='Remove from cart'
                        >
                          −
                        </button>

                        <div className='flex-1 rounded-full bg-slate-100 px-4 py-2 text-center'>
                          <span className='text-sm font-semibold text-slate-900'>{quantity}</span>
                        </div>

                        <button
                          type='button'
                          disabled={isOutOfStock || quantity >= product.countInStock}
                          onClick={() => handleQuantityChange(product, 1)}
                          className='h-10 w-10 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-base'
                          title='Add to cart'
                        >
                          +
                        </button>
                      </div>

                      {quantity > 0 && (
                        <div className='rounded-lg bg-green-50 px-3 py-2 text-center'>
                          <p className='text-xs font-semibold text-green-700'>
                            ${(Number(product.price) * quantity).toFixed(2)} in cart
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='rounded-[1.75rem] border border-gray-200 bg-white p-12 text-center'>
            <p className='text-gray-600'>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
