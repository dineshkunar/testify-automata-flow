
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = async (request: Request): Promise<{ user: any; error?: string }> => {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader) {
    return { user: null, error: 'Missing authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  const { data: { user }, error } = await supabaseClient.auth.getUser(token)

  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' }
  }

  return { user, error: undefined }
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate the request
    const { user, error } = await authMiddleware(req)
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: error || 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Example protected endpoint logic
    const url = new URL(req.url)
    const pathname = url.pathname

    if (pathname.includes('/api/test-cases')) {
      // Handle test cases API
      return new Response(
        JSON.stringify({ 
          message: 'Authenticated access to test cases',
          user_id: user.id 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Authenticated request', user_id: user.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
