
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button className="bg-shop-blue hover:bg-shop-blue-dark">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                  {/* Product */}
                  <div className="md:col-span-6 flex items-center">
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link 
                        to={`/product/${item.id}`}
                        className="font-medium hover:text-shop-blue line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center text-red-500 text-sm mt-2 hover:underline"
                      >
                        <Trash2 size={14} className="mr-1" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="md:col-span-2 text-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                    ${item.price.toFixed(2)}
                  </div>
                  
                  {/* Quantity */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="md:hidden text-sm text-gray-500 mr-2">Quantity:</div>
                    <div className="flex border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="md:col-span-2 text-right font-medium">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Total:</div>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Cart actions */}
            <div className="p-4 bg-gray-50 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-gray-600"
              >
                <Trash2 size={16} className="mr-2" />
                Clear Cart
              </Button>
              
              <Link to="/products">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{totalPrice >= 50 ? 'Free' : '$5.00'}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(totalPrice >= 50 ? totalPrice : totalPrice + 5).toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              className="w-full bg-shop-blue hover:bg-shop-blue-dark"
              onClick={handleCheckout}
              size="lg"
            >
              Checkout
              <ArrowRight size={16} className="ml-2" />
            </Button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>We accept all major credit cards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
