const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in env config.");
  process.exit(1);
}

// Admin client to bypass RLS and create users directly
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
    role: "user",
    name: "Alex Mercer (Staff)"
  }
];

async function createAccounts() {
  for (const account of credentials) {
    console.log(`Processing: ${account.email}...`);

    // 1. Try to create user in auth.users
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
      if (authError.message && authError.message.includes("already registered") || authError.status === 422) {
        console.log(`User ${account.email} already exists in auth.users.`);
      } else {
        console.error(`Failed to create user ${account.email}:`, JSON.stringify(authError, null, 2), authError);
        continue;
      }
    }

    // Get user id (either from newly created authData or by querying)
    let userId;
    if (authData && authData.user) {
      userId = authData.user.id;
    } else {
      // Query auth user list to get the id if already registered
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error("Error listing users:", listError.message);
        continue;
      }
      const existingUser = userList.users.find(u => u.email === account.email);
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    if (!userId) {
      console.error(`Could not locate user ID for ${account.email}`);
      continue;
    }

    // 2. Insert or update role in profiles table (bypassing RLS with service_role client)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: account.email,
        name: account.name,
        role: account.role,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

    if (profileError) {
      console.error(`Failed to set profile role for ${account.email}:`, profileError.message);
    } else {
      console.log(`Successfully configured ${account.email} with role '${account.role}'!`);
    }
  }

  console.log("\nProcess complete!");
}

createAccounts();
