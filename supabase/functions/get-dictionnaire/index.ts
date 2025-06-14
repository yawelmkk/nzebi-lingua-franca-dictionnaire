
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Fetching dictionary from dictionnaire.json file in dictionnaire bucket...')
    
    // Download the JSON file from your existing 'dictionnaire' bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('dictionnaire')
      .download('dictionnaire.json')

    if (downloadError) {
      console.error('Error downloading dictionnaire.json file from dictionnaire bucket:', downloadError)
      // Fallback to database if file doesn't exist
      console.log('Falling back to database...')
      const { data: words, error: dbError } = await supabase
        .from('words')
        .select('*')
        .order('nzebi_word')

      if (dbError) {
        throw dbError
      }

      console.log(`Successfully fetched ${words?.length || 0} words from database`)
      return new Response(
        JSON.stringify(words),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
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
    console.error('Error in get-dictionnaire function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
