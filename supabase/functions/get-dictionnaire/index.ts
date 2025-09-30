import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        },
      )
    }
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Fetching dictionary from dictionnaire.json file in dictionnaire bucket...')
    
    // Download the JSON file from the 'dictionnaire' bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('dictionnaire')
      .download('dictionnaire.json')

    if (downloadError) {
      console.error('Error downloading dictionnaire.json file from dictionnaire bucket:', downloadError)
      throw downloadError
    }

    // Convert the file data to text and parse JSON
    const fileText = await fileData.text()
    const dictionaryData = JSON.parse(fileText)

    console.log(`Successfully loaded dictionary from dictionnaire.json file in dictionnaire bucket with ${dictionaryData?.length || 0} entries`)

    return new Response(
      JSON.stringify(dictionaryData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    // Log detailed error for debugging (server-side only)
    console.error('Error in get-dictionnaire function:', error)
    
    // Return generic error message to client (security best practice)
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur interne est survenue. Veuillez réessayer ultérieurement.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
