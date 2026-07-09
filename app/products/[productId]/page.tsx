import Link from 'next/link';
import CategoryItemsGrid from './CategoryItemsGrid';
import ProductActions from './ProductActions';
import { buildCategoryNavLinks, homepageCategories } from '@/lib/categoryConfig';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

type ProductPageParams = {
  params: {
    productId: string;
  };
};

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

async function getProduct(productId: string): Promise<Product | null> {
  // Check if it's an API product
  if (productId.startsWith('fakestore-electronics-')) {
    const response = await fetch('https://fakestoreapi.com/products/category/electronics');
    const products = await response.json();
    const product = products.find((p: any) => `fakestore-electronics-${p.id}` === productId);
    if (product) {
      return {
        id: productId,
        name: product.title,
        category: 'electronics',
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        rating: product.rating.rate,
        numReviews: product.rating.count,
        countInStock: Math.floor(Math.random() * 50) + 5,
      };
    }
  } else if (productId.startsWith('fakestore-jewelery-')) {
    const response = await fetch('https://fakestoreapi.com/products/category/jewelery');
    const products = await response.json();
    const product = products.find((p: any) => `fakestore-jewelery-${p.id}` === productId);
    if (product) {
      return {
        id: productId,
        name: product.title,
        category: 'jewelery',
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        rating: product.rating.rate,
        numReviews: product.rating.count,
        countInStock: Math.floor(Math.random() * 30) + 5,
      };
    }
  }

  // Fall back to local data
  const data = [...largeData, ...smallData];
  const localProduct = data.find((item) => item.id === productId);
  if (localProduct) {
    return {
      id: localProduct.id,
      name: localProduct.name,
      category: localProduct.category,
      description: localProduct.description,
      price: localProduct.price,
      rating: localProduct.rating,
      numReviews: localProduct.numReviews,
      countInStock: localProduct.countInStock,
    };
  }

  return null;
}

const productDetail = async ({ params }: ProductPageParams) => {
  const product = await getProduct(params.productId);
  const data = [...largeData, ...smallData];
  const navLinks = buildCategoryNavLinks(data);

  if (!product) {
    return <p className='p-8 text-center text-red-600'>Product not found.</p>;
  }

  const activeCategory = homepageCategories.find((category) => category.match(product.category))?.id;

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='space-y-14 px-8 py-10 lg:px-16'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
          </svg>
          Back to Home
        </Link>

        <CategoryItemsGrid category={product.category} currentProductId={product.id} />
      </div>
    </div>
  );
};

export default productDetail;
