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

    const { action, user_id, plan_id } = await req.json()

    console.log('Subscription action:', action, 'for user:', user_id)

    switch (action) {
      case 'create':
        // Get plan details
        const { data: plan, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .single()

        if (planError || !plan) {
          throw new Error('Invalid subscription plan')
        }

        // Calculate end date
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + plan.duration_months)

        // Create subscription
        const { data: subscription, error: subError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id,
            plan_id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'active'
          })
          .select()
          .single()

        if (subError) {
          throw subError
        }

        console.log('Subscription created:', subscription.id)
        
        return new Response(
          JSON.stringify({ 
            success: true,
            subscription,
            message: 'Subscription created successfully'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )

      case 'cancel':
        // Cancel subscription
        const { error: cancelError } = await supabase
          .from('user_subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', user_id)
          .eq('status', 'active')

        if (cancelError) {
          throw cancelError
        }

        console.log('Subscription cancelled for user:', user_id)

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Subscription cancelled successfully'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )

      case 'update':
        // Update subscription (change plan)
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({ plan_id })
          .eq('user_id', user_id)
          .eq('status', 'active')

        if (updateError) {
          throw updateError
        }

        console.log('Subscription updated for user:', user_id)

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Subscription updated successfully'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Subscription management error:', error)
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