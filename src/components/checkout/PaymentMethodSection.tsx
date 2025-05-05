
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreditCard, DollarSign, LockKeyhole } from 'lucide-react';

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  formValues: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  formValues,
  handleInputChange,
  errors,
  handleSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <CreditCard className="mr-2 text-shop-blue" size={20} />
        Payment Method
      </h2>
      
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="mb-4"
      >
        <div className="flex items-center justify-between border rounded-md p-4 mb-2">
          <div className="flex items-center">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card" className="ml-2">Credit Card</Label>
          </div>
          <div className="flex space-x-1">
            <div className="w-8 h-6 bg-blue-700 rounded"></div>
            <div className="w-8 h-6 bg-red-500 rounded"></div>
            <div className="w-8 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between border rounded-md p-4">
          <div className="flex items-center">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="ml-2">Cash on Delivery</Label>
          </div>
          <DollarSign size={20} className="text-gray-500" />
        </div>
      </RadioGroup>
      
      {paymentMethod === 'credit-card' && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={formValues.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className={errors.cardNumber ? 'border-red-500' : ''}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              name="cardName"
              value={formValues.cardName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={errors.cardName ? 'border-red-500' : ''}
            />
            {errors.cardName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={formValues.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={errors.expiryDate ? 'border-red-500' : ''}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                value={formValues.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <LockKeyhole size={14} className="mr-1" />
            Your payment information is secure and encrypted
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentMethodSection;
