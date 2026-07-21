import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase URL or Service Key on server" }, { status: 500 });
  }

  // Create service client to bypass RLS and edit users
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });

  const credentials = [
    {
      email: "super@aurastreet.com",
      password: "SuperAdminSecure123!",
      role: "super_admin",
      name: "Émile Leclerc (Super Admin)"
    },
    {
      email: "admin@aurastreet.com",
      password: "AdminSecure123!",
      role: "admin",
      name: "Yuki Tanaka (Admin)"
    },
    {
      email: "staff@aurastreet.com",
      password: "StaffSecure123!",
      role: "staff",
      name: "Alex Mercer (Staff)"
    }
  ];

  const log: string[] = [];

  try {
    for (const account of credentials) {
      log.push(`Processing: ${account.email}`);

      // List users to see if they already exist
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        log.push(`Error listing users: ${listError.message}`);
        continue;
      }

      const existingUser = userList.users.find(u => u.email === account.email);
      let userId = existingUser?.id;

      if (existingUser && userId) {
        log.push(`User exists (ID: ${userId}). Resetting password and confirming email...`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
          password: account.password,
          email_confirm: true,
          user_metadata: {
            name: account.name,
            role: account.role
          }
        });
        if (updateError) {
          log.push(`Error resetting password: ${updateError.message}`);
          continue;
        }
      } else {
        log.push(`User does not exist. Creating new user...`);
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: {
            name: account.name,
            role: account.role
          }
        });

        if (authError) {
          log.push(`Error creating user: ${authError.message}`);
          continue;
        }
        userId = authData.user.id;
      }

      // Sync role to profiles table
      log.push(`Syncing profile for ${account.email} to role '${account.role}'...`);
      // Since database role constraint might block 'staff' role, we store staff as 'user' in db and let src/proxy.ts override it via email check.
      const dbRole = account.role === "staff" ? "user" : account.role;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          email: account.email,
          name: account.name,
          role: dbRole,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });

      if (profileError) {
        log.push(`Error syncing profile: ${profileError.message}`);
      } else {
        log.push(`Successfully configured ${account.email}!`);
      }
    }

    return NextResponse.json({ success: true, log });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, log });
  }
}
