import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting daily reset at', new Date().toISOString());

    // Reset all used numbers back to available
    const { error, count } = await supabaseClient
      .from('numbers')
      .update({ 
        status: 'available',
        used_by: null,
        used_at: null
      })
      .eq('status', 'used');

    if (error) {
      console.error('Error resetting numbers:', error);
      throw error;
    }

    console.log(`Successfully reset ${count || 0} numbers to available`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Reset ${count || 0} numbers`,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error('Daily reset error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});