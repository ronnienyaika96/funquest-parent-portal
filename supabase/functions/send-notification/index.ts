import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, user_id, message, title, data } = await req.json()

    console.log('Sending notification:', type, 'to user:', user_id)

    // Get user email from auth if user_id provided
    let userEmail = null;
    if (user_id) {
      const { data: user } = await supabase.auth.admin.getUserById(user_id);
      userEmail = user?.user?.email;
    } else {
      // Get from current session
      const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
      if (authHeader) {
        const { data: { user } } = await supabase.auth.getUser(authHeader);
        userEmail = user?.email;
      }
    }

    switch (type) {
      case 'welcome':
        if (userEmail) {
          await resend.emails.send({
            from: 'KidsLearn <welcome@kidslearn.app>',
            to: [userEmail],
            subject: 'Welcome to KidsLearn!',
            html: `
              <h1>Welcome to KidsLearn!</h1>
              <p>We're excited to have you join our learning community.</p>
              <p>Start exploring educational games and activities for your children.</p>
            `
          });
        }
        break

      case 'achievement':
        console.log('Sending achievement notification:', message)
        // Could send push notifications here
        break

      case 'purchase_confirmation':
        if (userEmail && data?.order_id) {
          await resend.emails.send({
            from: 'KidsLearn <orders@kidslearn.app>',
            to: [userEmail],
            subject: `Order Confirmation #${data.order_id}`,
            html: `
              <h1>Thank you for your order!</h1>
              <p>Order ID: <strong>#${data.order_id}</strong></p>
              <p>Total: <strong>$${data.total}</strong></p>
              <p>Your order has been confirmed and will be processed shortly.</p>
              <p>You can track your order status in your dashboard.</p>
            `
          });
        }
        break

      case 'subscription_reminder':
        if (userEmail) {
          await resend.emails.send({
            from: 'KidsLearn <billing@kidslearn.app>',
            to: [userEmail],
            subject: 'Subscription Reminder',
            html: `
              <h1>Subscription Update</h1>
              <p>${message}</p>
              <p>Manage your subscription in your account settings.</p>
            `
          });
        }
        break

      case 'progress_update':
        console.log('Sending progress update:', message)
        // Could integrate with parent notification preferences
        break

      default:
        console.log('Generic notification:', message)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Notification sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Notification error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})