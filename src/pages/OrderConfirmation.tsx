
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Box, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  
  // Generate a random order number
  const orderNumber = React.useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);
  
  // Redirect if cart is not empty (which would mean this page was accessed directly)
  useEffect(() => {
    if (items.length > 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed and is being processed. You'll receive a confirmation email shortly.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600 mb-2">Order Number</p>
          <p className="text-xl font-bold">{orderNumber}</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-shop-blue-light p-2">
                  <ShoppingBag className="h-6 w-6 text-shop-blue" />
                </div>
              </div>
              <p className="text-sm font-medium mb-1">Order Placed</p>
              <p className="text-xs text-gray-500">Today</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-shop-blue-light p-2">
                  <Box className="h-6 w-6 text-shop-blue" />
                </div>
              </div>
              <p className="text-sm font-medium mb-1">Processing</p>
              <p className="text-xs text-gray-500">1-2 days</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-shop-blue-light p-2">
                  <Truck className="h-6 w-6 text-shop-blue" />
                </div>
              </div>
              <p className="text-sm font-medium mb-1">Shipping</p>
              <p className="text-xs text-gray-500">3-5 days</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link to="/">
            <Button className="bg-shop-blue hover:bg-shop-blue-dark w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Have questions? <Link to="/contact" className="text-shop-blue hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
