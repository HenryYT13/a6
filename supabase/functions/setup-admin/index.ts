import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create or update admin user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: "quanly@a6quanly.lvt",
      password: "Admin123!",
      email_confirm: true,
    });

    if (userError) {
      throw userError;
    }

    // Set admin flag in users table
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .upsert({ 
        id: user.id,
        is_admin: true
      });

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ message: "Admin setup completed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});