
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';

const ShippingMethodSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Truck className="mr-2 text-shop-blue" size={20} />
        Shipping Method
      </h2>
      
      <RadioGroup defaultValue="standard">
        <div className="flex items-center justify-between border rounded-md p-4 mb-2">
          <div className="flex items-center">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="ml-2">Standard Shipping</Label>
          </div>
          <span>Free</span>
        </div>
        
        <div className="flex items-center justify-between border rounded-md p-4">
          <div className="flex items-center">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express" className="ml-2">Express Shipping</Label>
          </div>
          <span>$15.00</span>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ShippingMethodSection;
