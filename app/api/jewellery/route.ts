export async function GET(request: Request) {
  try {
    const response = await fetch('https://fakestoreapi.com/products/category/jewelery');
    const products = await response.json();

    // Map FakeStore API product structure to match our app structure
    const mappedProducts = products.map((product: any) => ({
      id: `fakestore-jewelery-${product.id}`,
      name: product.title,
      category: 'jewelery',
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      rating: product.rating.rate,
      numReviews: product.rating.count,
      countInStock: Math.floor(Math.random() * 30) + 5,
    }));

    return Response.json(mappedProducts);
  } catch (error) {
    console.error('Error fetching jewellery:', error);
    return Response.json([], { status: 200 });
  }
}
