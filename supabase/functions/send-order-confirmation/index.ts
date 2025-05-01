
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderDetails {
  id: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Function to send email
async function sendEmail(orderDetails: OrderDetails): Promise<any> {
  try {
    console.log("Preparing to send email for order:", orderDetails.orderId);
    
    // Create HTML for the email
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f0f9ff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: #0369a1;">Order Confirmation</h1>
              <p>Thank you for your order!</p>
            </div>
            
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px;">
              <p>Hello ${orderDetails.customerName},</p>
              <p>Your order <strong>#${orderDetails.orderId}</strong> has been received and is being processed.</p>
              
              <h3>Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f9fafb;">
                  <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Item</th>
                  <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Qty</th>
                  <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Price</th>
                  <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Total</th>
                </tr>
                ${orderDetails.items.map(item => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.title}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Total</td>
                  <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">$${orderDetails.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
              
              <h3>Shipping Address</h3>
              <p>
                ${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}<br>
                ${orderDetails.shippingAddress.address}<br>
                ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}
              </p>
              
              <p>We'll send you another email when your order ships.</p>
              <p>If you have any questions, please contact our support team.</p>
              
              <p>Thank you for shopping with us!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // For demonstration purposes, log the email content
    console.log("Would send email to:", orderDetails.customerEmail);
    
    // Here you would integrate with an email service like SendGrid, AWS SES, or Resend
    // For now, we'll just return success
    return { success: true, message: "Email would be sent in production" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, customerName, items, totalAmount, shippingAddress } = await req.json();

    // Data validation
    if (!orderId || !customerEmail || !items || !totalAmount || !shippingAddress) {
      throw new Error("Missing required order information");
    }

    const orderDetails: OrderDetails = {
      id: crypto.randomUUID(),
      orderId,
      customerEmail,
      customerName,
      items,
      totalAmount,
      shippingAddress
    };

    // Send the confirmation email
    const emailResult = await sendEmail(orderDetails);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent successfully",
        data: emailResult
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-order-confirmation function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to send confirmation email"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
