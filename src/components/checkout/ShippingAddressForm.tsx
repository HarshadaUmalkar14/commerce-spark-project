
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface ShippingAddressFormProps {
  formValues: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  formValues,
  handleInputChange,
  errors
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <MapPin className="mr-2 text-shop-blue" size={20} />
        Shipping Information
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formValues.firstName}
            onChange={handleInputChange}
            placeholder="John"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formValues.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleInputChange}
          placeholder="johndoe@example.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      <div className="mb-4">
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          name="address"
          value={formValues.address}
          onChange={handleInputChange}
          placeholder="123 Main St"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formValues.city}
            onChange={handleInputChange}
            placeholder="New York"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formValues.state}
            onChange={handleInputChange}
            placeholder="NY"
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formValues.zipCode}
            onChange={handleInputChange}
            placeholder="10001"
            className={errors.zipCode ? 'border-red-500' : ''}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
