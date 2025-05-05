
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, ShippingAddress } from "@/types/order";

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (order: Order): Promise<void> => {
  if (!order.shippingAddress?.email) return;
  
  try {
    const { error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
      body: {
        orderId: order.id,
        customerEmail: order.shippingAddress.email,
        customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress
      }
    });
    
    if (emailError) {
      throw emailError;
    } else {
      console.log("Confirmation email sent successfully with order details");
    }
  } catch (emailErr) {
    console.error("Failed to invoke email function:", emailErr);
    throw emailErr;
  }
};
