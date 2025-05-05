
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  items: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  totalPrice: number;
  isProcessing: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totalPrice,
  isProcessing
}) => {
  return (
    <div className="md:col-span-2">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Order Summary</h2>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{totalPrice >= 50 ? 'Free' : '$5.00'}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${(totalPrice * 0.08).toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              ${(totalPrice + (totalPrice >= 50 ? 0 : 5) + (totalPrice * 0.08)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <Button
        form="checkout-form"
        type="submit"
        className="w-full bg-shop-blue hover:bg-shop-blue-dark"
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </Button>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default OrderSummary;
