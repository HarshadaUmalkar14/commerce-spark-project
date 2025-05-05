
import { Order, NewOrder } from "@/types/order";
import { saveOrderToDb, saveOrderToLocalStorage, fetchOrdersFromDb, fetchOrdersFromLocalStorage } from "@/services/db/orderDb";
import { sendOrderConfirmationEmail } from "@/services/notifications/emailService";
import { toast } from '@/components/ui/use-toast';

/**
 * Save an order, attempt database first, fall back to local storage
 */
export const saveOrder = async (orderData: NewOrder): Promise<Order> => {
  try {
    console.log("Saving order to database with complete details:", orderData);
    
    if (!orderData.customerId) {
      console.warn("No customer ID provided, using localStorage fallback");
      throw new Error("User not authenticated");
    }
    
    // Attempt to save to database
    const savedOrder = await saveOrderToDb(orderData);

    // After successful save, send confirmation email
    try {
      await sendOrderConfirmationEmail(savedOrder);
    } catch (emailErr) {
      console.error("Failed to send confirmation email, but order was saved:", emailErr);
    }

    return savedOrder;
    
  } catch (error) {
    console.error("Error saving complete order details to Supabase:", error);
    toast({
      title: "Database error",
      description: "There was an issue saving your order to our database. We'll store it locally for now.",
      variant: "destructive",
    });
    
    // Fallback to localStorage
    return saveOrderToLocalStorage(orderData);
  }
};

/**
 * Get all orders, attempt database first, fall back to local storage
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    // First try to get complete order details from Supabase
    return await fetchOrdersFromDb();
  } catch (error) {
    console.error("Error fetching orders from Supabase:", error);
    
    // Fallback to localStorage
    return fetchOrdersFromLocalStorage();
  }
};
