
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  rating,
  category,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      title,
      price,
      image
    });
  };

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
      <Link to={`/product/${id}`} className="block">
        <div className="relative pb-[100%]"> {/* 1:1 aspect ratio */}
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">{category}</div>
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{title}</h3>
          
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${i < rating ? 'text-shop-yellow fill-shop-yellow' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating})</span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
            <Button 
              size="sm"
              className="bg-shop-blue hover:bg-shop-blue-dark text-white rounded-full"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
