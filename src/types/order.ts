
export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

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
