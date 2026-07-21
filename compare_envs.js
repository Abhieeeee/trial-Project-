const fs = require("fs");

function parseEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, "utf-8");
  content.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join("=").trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });
  return env;
}

const pulled = parseEnv(".env.vercel.pulled");
const local = parseEnv(".env.local");

console.log("Keys in pulled:", Object.keys(pulled));
console.log("Keys in local:", Object.keys(local));

for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
  const pVal = pulled[key];
  const lVal = local[key];
  if (!pVal) {
    console.log(`${key} is missing in pulled env`);
  } else if (pVal === "[SENSITIVE]") {
    console.log(`${key} in pulled env is literally the string "[SENSITIVE]" (redacted by Vercel)`);
  } else if (pVal === lVal) {
    console.log(`${key} matches perfectly!`);
  } else {
    console.log(`${key} DOES NOT MATCH!`);
    console.log(`Pulled length: ${pVal.length}, Local length: ${lVal.length}`);
    console.log(`Pulled starts with: ${pVal.substring(0, 8)}... ends with: ...${pVal.substring(pVal.length - 8)}`);
    console.log(`Local starts with: ${lVal.substring(0, 8)}... ends with: ...${lVal.substring(lVal.length - 8)}`);
  }
}
