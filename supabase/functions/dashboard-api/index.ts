import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StatusAlert {
  id: number;
  message: string;
  alert_status: string;
  filter?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get reactor_id from query params or request body
    const url = new URL(req.url);
    let reactorId = url.searchParams.get('reactor_id');
    
    if (!reactorId && req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      reactorId = body.reactor_id;
    }

    if (!reactorId) {
      return new Response(
        JSON.stringify({ error: 'Reactor ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Dashboard API request for reactor ID: ${reactorId}`);

    // Get user profile by reactor_id
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('reactor_id, subscription, sub_change')
      .eq('reactor_id', reactorId)
      .single();

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update expired alerts first
    await supabase.rpc('update_expired_alerts');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch current alerts
    const { data: currentAlerts } = await supabase
      .from('reactor_alerts')
      .select('id, message, alert_status, filter')
      .eq('alert_status', 'Current')
      .lte('start_date', today)
      .gte('end_date', today);

    // Fetch filtered alerts
    const { data: filteredAlerts } = await supabase
      .from('reactor_alerts')
      .select('id, message, alert_status, filter')
      .eq('alert_status', 'Filtered')
      .lte('start_date', today)
      .gte('end_date', today);

    let relevantFiltered: StatusAlert[] = [];
    
    // Filter the filtered alerts based on user demographics
    if (filteredAlerts && userProfile?.reactor_id) {
      for (const alert of filteredAlerts) {
        if (!alert.filter || !Array.isArray(alert.filter) || alert.filter.length === 0) {
          // If no filter, include for all users
          relevantFiltered.push(alert);
        } else {
          // For now, include all filtered alerts - proper demographic matching would require user demographic data
          relevantFiltered.push(alert);
        }
      }
    }

    // Combine filtered alerts first, then current alerts
    const allAlerts = [...relevantFiltered, ...(currentAlerts || [])];
    
    // Format status updates
    const statusUpdates = allAlerts.map(alert => ({
      id: alert.id,
      message: alert.message,
      type: alert.alert_status.toLowerCase()
    }));

    // Get subscription reward details
    let subscriptionReward = null;
    if (userProfile.subscription) {
      const { data: subscriptionChoice } = await supabase
        .from('subscription_choices')
        .select('subscription, sub_details')
        .eq('subscription', userProfile.subscription)
        .single();
      
      if (subscriptionChoice) {
        subscriptionReward = {
          subscription: subscriptionChoice.subscription,
          sub_details: subscriptionChoice.sub_details
        };
      }
    }

    // Format eligible to change date
    const eligibleToChangeDate = userProfile.sub_change || null;

    const response = {
      status_updates: statusUpdates,
      subscription_reward: subscriptionReward,
      eligible_to_change_date: eligibleToChangeDate
    };

    console.log(`Dashboard API response:`, response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Dashboard API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});