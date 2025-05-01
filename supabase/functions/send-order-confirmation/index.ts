
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
}

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface EmailRequestBody {
  orderId: string
  customerEmail: string
  customerName: string
  totalAmount: number
  items: OrderItem[]
  shippingAddress: ShippingAddress
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const requestData: EmailRequestBody = await req.json()
    
    // Extract the data from the request
    const { 
      orderId, 
      customerEmail, 
      customerName, 
      totalAmount, 
      items, 
      shippingAddress 
    } = requestData

    console.log("Preparing to send email for order:", orderId)
    
    // In a real implementation, you would use a service like SendGrid, Mailgun, or Resend
    // to send the actual email. For this simulation, we'll just log the details.
    
    console.log("Would send email to:", customerEmail)
    
    // Format items for email
    const formattedItems = items.map(item => 
      `${item.title} (Quantity: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')
    
    // Build the email content (in a real implementation, this would be an HTML template)
    const emailContent = `
      Order Confirmation #${orderId}
      
      Thank you for your order, ${customerName}!
      
      Items:
      ${formattedItems}
      
      Total: $${totalAmount.toFixed(2)}
      
      Shipping Address:
      ${shippingAddress.firstName} ${shippingAddress.lastName}
      ${shippingAddress.address}
      ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
      
      We will notify you when your order ships.
    `
    
    // In a real implementation, this is where you would call your email service
    // For demonstration, we'll just log the email content
    console.log("Email content:", emailContent)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order confirmation email sent successfully" 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send order confirmation email",
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
})
