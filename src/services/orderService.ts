
import { v4 as uuidv4 } from 'uuid';

export interface Order {
  id: string;
  customerId?: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

let orders: Order[] = [];

export const saveOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  return new Promise((resolve) => {
    const newOrder: Order = {
      ...orderData,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    
    // Save to localStorage to persist the data
    localStorage.setItem('orders', JSON.stringify(orders));
    
    setTimeout(() => {
      resolve(newOrder);
    }, 500);
  });
};

export const getOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    // Load from localStorage
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      orders = JSON.parse(storedOrders);
    }
    
    setTimeout(() => {
      resolve(orders);
    }, 300);
  });
};
