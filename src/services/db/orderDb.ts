
import { supabase } from "@/integrations/supabase/client";
import { Order, NewOrder } from "@/types/order";
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Save order to the database
 */
export const saveOrderToDb = async (orderData: NewOrder): Promise<Order> => {
  if (!orderData.customerId) {
    throw new Error("User not authenticated");
  }
  
  // Insert order data into the orders table
  // Convert shippingAddress to a plain object for compatibility with Supabase's Json type
  const { data: orderResult, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.customerId,
      shipping_address: orderData.shippingAddress as any, // Cast to any to resolve type issue
      payment_method: orderData.paymentMethod,
      total_amount: orderData.totalAmount,
      status: 'pending' as const
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error inserting order:", orderError);
    throw orderError;
  }
  
  console.log("Order inserted successfully with all details:", orderResult);

  // Insert each order item with complete details
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

  if (itemsError) {
    console.error("Error inserting order items:", itemsError);
    throw itemsError;
  }
  
  console.log("Order items inserted successfully with details:", orderItems);

  // Return the complete order object with all details
  return {
    id: orderResult.id,
    customerId: orderResult.user_id,
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    totalAmount: orderData.totalAmount,
    status: orderResult.status as 'pending' | 'processing' | 'completed',
    createdAt: orderResult.created_at
  };
};

/**
 * Save order to local storage (fallback)
 */
export const saveOrderToLocalStorage = (orderData: NewOrder): Order => {
  const newOrder: Order = {
    ...orderData,
    id: uuidv4(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Save complete details to localStorage as fallback
  const storedOrders = localStorage.getItem('orders');
  const orders = storedOrders ? JSON.parse(storedOrders) : [];
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  return newOrder;
};

/**
 * Fetch orders from the database
 */
export const fetchOrdersFromDb = async (): Promise<Order[]> => {
  // First try to get complete order details from Supabase
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

  // Get complete order items for each order
  const orders: Order[] = [];
  for (const order of ordersData) {
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) throw itemsError;

    // Convert shipping_address from Json to the expected typed object
    const typedShippingAddress = order.shipping_address as any as {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };

    orders.push({
      id: order.id,
      customerId: order.user_id,
      items: itemsData.map(item => ({
        id: item.product_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress: typedShippingAddress,
      paymentMethod: order.payment_method,
      totalAmount: order.total_amount,
      status: order.status as 'pending' | 'processing' | 'completed',
      createdAt: order.created_at
    });
  }

  console.log("Retrieved complete order details from database:", orders);
  return orders;
};

/**
 * Fetch orders from local storage (fallback)
 */
export const fetchOrdersFromLocalStorage = (): Order[] => {
  const storedOrders = localStorage.getItem('orders');
  return storedOrders ? JSON.parse(storedOrders) : [];
};
