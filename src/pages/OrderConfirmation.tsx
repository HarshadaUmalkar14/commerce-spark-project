
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Box, Truck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  shippingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  useEffect(() => {
    // Get order details from location state
    const state = location.state as { orderDetails?: OrderDetails } | undefined;
    
    if (state?.orderDetails) {
      setOrderDetails(state.orderDetails);
      
      // Send confirmation email
      if (state.orderDetails.shippingAddress?.email) {
        sendConfirmationEmail(state.orderDetails);
      }
    } else {
      // If we don't have order details, redirect to home
      toast({
        title: "No order information",
        description: "We couldn't find your order details. Please contact support.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [location, navigate, toast]);

  const sendConfirmationEmail = async (order: OrderDetails) => {
    try {
      if (!order.shippingAddress?.email) return;
      
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          orderId: order.orderNumber,
          customerEmail: order.shippingAddress.email,
          customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          items: order.items,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress
        }
      });

      if (error) throw error;
      
      console.log("Email confirmation response:", data);
      setEmailSent(true);
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      toast({
        title: "Email notification failed",
        description: "We couldn't send your confirmation email, but your order has been placed successfully.",
        variant: "destructive"
      });
    }
  };

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-6 text-center">
          Your order has been placed successfully and is being processed.
          {emailSent && (
            <span className="block mt-1 text-sm">
              A confirmation email has been sent to your email address.
            </span>
          )}
        </p>
        
        <Alert className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center">
            <AlertTitle className="flex-1">Order #{orderDetails.orderNumber} Confirmed</AlertTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </div>
          <AlertDescription>
            We've received your order and will begin processing it right away.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Order Summary</h2>
              <span className="text-gray-500 text-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            
            <div className="space-y-3 mt-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
            
            {orderDetails.shippingAddress && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Shipping Details</h3>
                <p className="text-sm">
                  {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}<br />
                  {orderDetails.shippingAddress.address}<br />
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
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
        
        <div className="mt-8 space-y-4 flex flex-col items-center">
          <Link to="/" className="w-full max-w-xs">
            <Button className="bg-shop-blue hover:bg-shop-blue-dark w-full">
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
