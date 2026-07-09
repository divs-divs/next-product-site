'use client';

import { useContext, useMemo } from 'react';
import { CartContext } from '@/context/CartContext';

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

type Props = {
  product: Product;
};

export default function ProductActions({ product }: Props) {
  const cartContext = useContext(CartContext);
  const cart = cartContext?.cart ?? [];
  const addItem = cartContext?.addItem;
  const updateQuantity = cartContext?.updateQuantity;
  const removeItem = cartContext?.removeItem;

  const quantityInCart = useMemo(() => {
    const cartItem = cart.find((item: any) => item.id === product.id);
    return cartItem?.quantity ?? 0;
  }, [cart, product.id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantityInCart + delta;

    if (!addItem || !updateQuantity || !removeItem) {
      return;
    }

    if (newQuantity <= 0) {
      if (quantityInCart > 0) {
        removeItem(product.id);
      }
      return;
    }

    if (quantityInCart === 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
      });
      return;
    }

    updateQuantity(product.id, newQuantity);
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className='rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm space-y-6'>
      <div>
        <p className='text-sm uppercase tracking-[0.3em] text-indigo-600 mb-4'>Add to cart</p>

        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              disabled={isOutOfStock || quantityInCart === 0}
              onClick={() => handleQuantityChange(-1)}
              className='h-12 w-12 rounded-full bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg'
            >
              −
            </button>

            <div className='flex-1 rounded-full bg-slate-100 px-6 py-3 text-center'>
              <span className='text-lg font-semibold text-slate-900'>{quantityInCart}</span>
            </div>

            <button
              type='button'
              disabled={isOutOfStock || quantityInCart >= product.countInStock}
              onClick={() => handleQuantityChange(1)}
              className='h-12 w-12 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg'
            >
              +
            </button>
          </div>

          {isOutOfStock ? (
            <div className='rounded-xl bg-red-50 px-4 py-3 text-center'>
              <p className='text-sm font-semibold text-red-600'>Out of Stock</p>
            </div>
          ) : quantityInCart > 0 ? (
            <div className='rounded-xl bg-green-50 px-4 py-3 text-center'>
              <p className='text-sm font-semibold text-green-600'>
                {quantityInCart} item{quantityInCart > 1 ? 's' : ''} in cart
              </p>
            </div>
          ) : null}

          {quantityInCart > 0 && (
            <div className='rounded-xl bg-slate-100 px-4 py-3'>
              <p className='text-sm text-slate-600'>
                Subtotal:{' '}
                <span className='font-bold text-slate-900'>${(Number(product.price) * quantityInCart).toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
