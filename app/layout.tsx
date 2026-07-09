'use client';

import { CartProvider } from '../context/CartContext';
import SiteHeader from '@/components/SiteHeader';
import { homepageCategories } from '@/lib/categoryConfig';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navLinks = homepageCategories.map((category) => ({
    id: category.id,
    label: category.label,
    href: `/products/category/${category.id}`,
  }));

  return (
    <html lang='en'>
      <body>
        <CartProvider>
          <SiteHeader links={navLinks} />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
