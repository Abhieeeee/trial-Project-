const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const envPath = "./.env.local";
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function listAllProfiles() {
  console.log("Fetching profiles from:", url);
  const { data: profiles, error } = await supabase.from("profiles").select("*");
  if (error) {
    console.error("Error fetching profiles:", error.message);
  } else {
    console.log("Profiles list:");
    profiles.forEach(p => {
      console.log(`- ID: ${p.id}, Email: ${p.email}, Name: ${p.name}, Role: ${p.role}`);
    });
  }

  console.log("\nFetching auth users list...");
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Error fetching auth users:", usersError.message);
  } else {
    console.log("Auth users list:");
    users.users.forEach(u => {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Metadata:`, u.user_metadata);
    });
  }
}

listAllProfiles();
