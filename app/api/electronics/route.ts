export async function GET(request: Request) {
  try {
    const response = await fetch('https://fakestoreapi.com/products/category/electronics');
    const products = await response.json();

    // Map FakeStore API product structure to match our app structure
    const mappedProducts = products.map((product: any) => ({
      id: `fakestore-${product.id}`,
      name: product.title,
      category: 'electronics',
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      rating: product.rating.rate,
      numReviews: product.rating.count,
      countInStock: Math.floor(Math.random() * 50) + 5, // Random stock for demonstration
    }));

    return Response.json(mappedProducts);
  } catch (error) {
    console.error('Error fetching electronics:', error);
    return Response.json([], { status: 200 }); // Return empty array on error
  }
}
