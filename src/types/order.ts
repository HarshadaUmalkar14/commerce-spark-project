
import { Json } from '@/integrations/supabase/types';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

// This interface defines the shape of shipping address data
// It's compatible with Supabase's jsonb column
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  customerId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'status'>;

// Database-specific type for storing order data
export interface DbOrder {
  id: string;
  user_id: string;
  shipping_address: Json;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// Database-specific type for storing order item data
export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  created_at: string;
}
