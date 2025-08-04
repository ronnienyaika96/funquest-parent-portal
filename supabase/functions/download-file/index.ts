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

    const url = new URL(req.url)
    const fileId = url.searchParams.get('fileId')
    const userId = url.searchParams.get('userId')

    if (!fileId || !userId) {
      throw new Error('Missing fileId or userId parameter')
    }

    console.log('Download request for file:', fileId, 'by user:', userId)

    // Verify user has access to this file
    // Check if it's a free printable or if user has purchased it
    const { data: printable, error: printableError } = await supabase
      .from('printables')
      .select('*')
      .eq('id', fileId)
      .eq('status', 'active')
      .single()

    if (printableError || !printable) {
      throw new Error('File not found or inactive')
    }

    // Check if user has purchased this item (for paid content)
    // For now, we'll allow all downloads since we don't have payment verification
    const hasAccess = true // In real app: check user orders or subscription status

    if (!hasAccess) {
      throw new Error('Access denied: Purchase required')
    }

    // Increment download count
    await supabase
      .from('printables')
      .update({ downloads: printable.downloads + 1 })
      .eq('id', fileId)

    // In a real app, you would:
    // 1. Generate a secure, time-limited download URL
    // 2. Serve the file from secure storage
    // 3. Log the download for analytics
    
    // For demo purposes, return the file URL
    const downloadUrl = printable.file_url

    console.log('File download authorized for:', printable.title)

    return new Response(
      JSON.stringify({ 
        success: true,
        download_url: downloadUrl,
        filename: `${printable.title}.pdf`,
        message: 'Download authorized'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Download error:', error)
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