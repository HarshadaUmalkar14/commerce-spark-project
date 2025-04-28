
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Minus, 
  Plus,
  Check
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '@/services/api';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  // Fetch product details
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts, isLoading: isRelatedLoading } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => fetchProducts({ category: product?.category }),
    enabled: !!product,
  });

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        });
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.title} added to your cart.`,
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.inStock) {
      setQuantity(quantity + 1);
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-4">Sorry, the product you are looking for does not exist.</p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Thumbnail images - would have multiple in a real product */}
            <div className="flex gap-2">
              <button 
                className={`border-2 rounded-md overflow-hidden ${activeImage === 0 ? 'border-shop-blue' : 'border-transparent'}`}
                onClick={() => setActiveImage(0)}
              >
                <img
                  src={product.image}
                  alt="Product thumbnail"
                  className="w-16 h-16 object-cover"
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <nav className="flex text-sm mb-2">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-shop-blue">
                    Home
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li>
                  <Link 
                    to={`/products?category=${product.category.toLowerCase()}`} 
                    className="text-gray-500 hover:text-shop-blue"
                  >
                    {product.category}
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-900 font-medium truncate max-w-[200px]">
                  {product.title}
                </li>
              </ol>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(product.rating) ? "text-shop-yellow fill-shop-yellow" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-shop-blue mb-4">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Features */}
            {product.features && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="text-green-500 mr-2 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock status */}
            <div className="mb-6">
              <p className={`font-medium ${product.inStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock > 0 
                  ? `In Stock (${product.inStock} available)`
                  : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={product.inStock <= quantity}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-8">
              <Button 
                className="flex-1 bg-shop-blue hover:bg-shop-blue-dark" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.inStock === 0}
              >
                Add to Cart
              </Button>
              <Button 
                className="flex-1 bg-shop-yellow text-shop-text hover:bg-yellow-500" 
                size="lg"
                disabled={product.inStock === 0}
              >
                Buy Now
              </Button>
            </div>
            
            {/* Shipping and returns */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex">
                <Truck className="text-shop-blue mr-3 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-gray-600">Orders over $50 qualify for free shipping.</p>
                </div>
              </div>
              <div className="flex">
                <ShieldCheck className="text-shop-blue mr-3 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-medium">Secure Payment</h4>
                  <p className="text-sm text-gray-600">Your payment information is processed securely.</p>
                </div>
              </div>
              <div className="flex">
                <RotateCcw className="text-shop-blue mr-3 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-medium">30-Day Returns</h4>
                  <p className="text-sm text-gray-600">Simple returns up to 30 days from purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Related Products */}
      {product && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          {isRelatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : relatedProducts ? (
            <ProductGrid 
              products={relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)} 
            />
          ) : null}
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
