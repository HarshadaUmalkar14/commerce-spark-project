
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Box, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface OrderDetails {
  id: string;
  orderNumber: string;
  totalAmount: number;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  useEffect(() => {
    // Get order details from location state
    const state = location.state as { orderDetails?: OrderDetails } | undefined;
    
    if (state?.orderDetails) {
      setOrderDetails(state.orderDetails);
    } else if (items.length > 0) {
      // If we have items in cart but no order details, redirect to cart
      navigate('/cart');
    } else {
      // If we have neither order details nor items, use a placeholder
      setOrderDetails({
        id: '',
        orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
        totalAmount: 0,
        items: []
      });
    }
  }, [location, items, navigate]);

  if (!orderDetails) {
    return null; // Loading state
  }

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
        
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle>Order #{orderDetails.orderNumber} Confirmed</AlertTitle>
          <AlertDescription>
            We've received your order and will begin processing it right away.
          </AlertDescription>
        </Alert>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600 mb-2">Order Number</p>
          <p className="text-xl font-bold">{orderDetails.orderNumber}</p>
          {orderDetails.totalAmount > 0 && (
            <p className="text-md mt-2">Total: ${orderDetails.totalAmount.toFixed(2)}</p>
          )}
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
