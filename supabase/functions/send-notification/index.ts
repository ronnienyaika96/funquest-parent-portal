import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // In a real app, you would integrate with:
    // - Email service (SendGrid, Resend, etc.)
    // - Push notification service (Firebase, OneSignal, etc.)
    // - SMS service (Twilio, etc.)

    switch (type) {
      case 'welcome':
        // Send welcome email
        console.log('Sending welcome notification to user:', user_id)
        break

      case 'achievement':
        // Send achievement notification
        console.log('Sending achievement notification:', message)
        break

      case 'purchase_confirmation':
        // Send purchase confirmation
        console.log('Sending purchase confirmation:', data)
        break

      case 'subscription_reminder':
        // Send subscription reminder
        console.log('Sending subscription reminder to user:', user_id)
        break

      case 'progress_update':
        // Send progress update
        console.log('Sending progress update:', message)
        break

      default:
        console.log('Generic notification:', message)
    }

    // Log notification for admin tracking
    // In real app, you might store notifications in a table

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