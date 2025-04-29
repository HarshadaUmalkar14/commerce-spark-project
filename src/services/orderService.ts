
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

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

export const saveOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  try {
    // Insert the order into the database
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.customerId,
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        total_amount: orderData.totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert each order item
    const orderItems = orderData.items.map(item => ({
      order_id: orderResult.id,
      product_id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Return the complete order object
    return {
      id: orderResult.id,
      customerId: orderResult.user_id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.totalAmount,
      status: orderResult.status,
      createdAt: orderResult.created_at
    };
  } catch (error) {
    console.error("Error saving order to Supabase:", error);
    
    // Fallback to localStorage for offline support or if user isn't authenticated
    const newOrder: Order = {
      ...orderData,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage as fallback
    const storedOrders = localStorage.getItem('orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return newOrder;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    // First try to get orders from Supabase
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        shipping_address,
        payment_method,
        total_amount,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Get order items for each order
    const orders: Order[] = [];
    for (const order of ordersData) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;

      orders.push({
        id: order.id,
        customerId: order.user_id,
        items: itemsData.map(item => ({
          id: item.product_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      });
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders from Supabase:", error);
    
    // Fallback to localStorage
    const storedOrders = localStorage.getItem('orders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  }
};
