import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { saveOrder } from '@/services/orderService';
import {
  CreditCard,
  DollarSign,
  LockKeyhole,
  User,
  MapPin,
  Truck
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect to login if not authenticated - using useEffect to avoid direct navigation
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      toast({
        title: "Login Required",
        description: "Please sign in to complete your purchase",
        variant: "destructive"
      });
      // Save cart in session storage
      sessionStorage.setItem('pendingCart', 'true');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, items.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formValues.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formValues.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formValues.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formValues.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formValues.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (paymentMethod === 'credit-card') {
      if (!formValues.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formValues.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formValues.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formValues.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formValues.expiryDate)) {
        newErrors.expiryDate = 'Please use MM/YY format';
      }
      
      if (!formValues.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formValues.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Skip the authentication check here - the useEffect will handle redirects if needed
    // and this prevents re-checking which might be causing the loop
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        customerId: user?.id,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          address: formValues.address,
          city: formValues.city,
          state: formValues.state,
          zipCode: formValues.zipCode,
        },
        paymentMethod,
        totalAmount: totalPrice + (totalPrice >= 50 ? 0 : 5) + (totalPrice * 0.08)
      };

      const savedOrder = await saveOrder(orderData);
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order is being processed.",
      });
      
      clearCart();
      
      // Navigate to confirmation page with extended order details
      navigate('/order-confirmation', { 
        state: { 
          orderDetails: {
            id: savedOrder.id,
            orderNumber: savedOrder.id.substring(0, 8),
            totalAmount: savedOrder.totalAmount,
            items: savedOrder.items,
            shippingAddress: savedOrder.shippingAddress
          } 
        } 
      });
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Error placing order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Return early if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Render only if authenticated
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="mr-2 text-shop-blue" size={20} />
                Shipping Information
              </h2>
              
              <form onSubmit={handleSubmit}>
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
              </form>
            </div>
            
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
          </div>
          
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
            
            {!isAuthenticated && (
              <div className="bg-shop-blue-light text-shop-blue p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <User className="flex-shrink-0 mr-2" size={18} />
                  <div>
                    <p className="font-medium">Already have an account?</p>
                    <p className="text-sm">Sign in for faster checkout and to save your shipping information</p>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              className="w-full bg-shop-blue hover:bg-shop-blue-dark"
              size="lg"
              onClick={() => document.forms[0].requestSubmit()}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
