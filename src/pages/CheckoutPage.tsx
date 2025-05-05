
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { saveOrder } from '@/services/orderService';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import ShippingMethodSection from '@/components/checkout/ShippingMethodSection';
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection';
import OrderSummary from '@/components/checkout/OrderSummary';
import AuthWarning from '@/components/checkout/AuthWarning';

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

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("CheckoutPage authentication check:", { isAuthenticated, itemsCount: items.length });
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
    
    // Check authentication directly
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in before completing your purchase",
        variant: "destructive"
      });
      sessionStorage.setItem('pendingCart', 'true');
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Submitting order for user:", user?.id);
      
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

      console.log("Order data being sent:", orderData);
      const savedOrder = await saveOrder(orderData);
      console.log("Order saved successfully:", savedOrder);
      
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

  // Only render the checkout page if user is authenticated
  if (!isAuthenticated) {
    return <AuthWarning />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} id="checkout-form">
              <ShippingAddressForm 
                formValues={formValues} 
                handleInputChange={handleInputChange} 
                errors={errors} 
              />
              
              <ShippingMethodSection />
              
              <PaymentMethodSection 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                formValues={formValues}
                handleInputChange={handleInputChange}
                errors={errors}
                handleSubmit={handleSubmit}
              />
            </form>
          </div>
          
          <OrderSummary 
            items={items} 
            totalPrice={totalPrice} 
            isProcessing={isProcessing} 
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
